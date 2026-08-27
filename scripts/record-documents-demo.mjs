#!/usr/bin/env node
/**
 * Records the documents demo to a website-ready video file.
 *
 * Usage:
 *   npm run record:documents
 *   npm run record:documents -- --port 4310 --out public/videos/documents-demo.mp4
 *   npm run record:documents -- --skip-build
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const EXPORT_DURATION_MS = 19_800;
const VIEWPORT = { width: 1440, height: 900 };
const FPS = 30;
const FFMPEG_PATH = process.env.FFMPEG_PATH ?? "/opt/homebrew/bin/ffmpeg";

function parseArgs(argv) {
  const args = {
    port: 4310,
    out: path.join(ROOT, "public/videos/documents-demo.mp4"),
    skipBuild: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--port" && argv[i + 1]) {
      args.port = Number(argv[++i]);
    } else if (arg === "--out" && argv[i + 1]) {
      args.out = path.resolve(argv[++i]);
    } else if (arg === "--skip-build") {
      args.skipBuild = true;
    }
  }

  return args;
}

function waitForServer(url, timeoutMs = 120_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (res.ok) {
          resolve(undefined);
          return;
        }
      } catch {
        // retry
      }

      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server did not start within ${timeoutMs}ms (${url})`));
        return;
      }

      setTimeout(tick, 500);
    };

    tick();
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, ...options.env },
      shell: process.platform === "win32",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function runCapture(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(stderr || `${command} failed with code ${code}`));
    });
  });
}

async function framesToMp4(framesDir, outputPath, fps) {
  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  await runCapture(FFMPEG_PATH, [
    "-y",
    "-framerate",
    String(fps),
    "-i",
    path.join(framesDir, "frame-%06d.png"),
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "18",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    outputPath,
  ]);
}

async function captureFrames(page, framesDir) {
  await fs.promises.rm(framesDir, { recursive: true, force: true });
  await fs.promises.mkdir(framesDir, { recursive: true });

  let frame = 0;
  let capturing = true;

  const loop = async () => {
    while (capturing) {
      const file = path.join(framesDir, `frame-${String(frame).padStart(6, "0")}.png`);
      await page.screenshot({ path: file, type: "png" });
      frame += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000 / FPS));
    }
  };

  const capturePromise = loop();
  return {
    stop: async () => {
      capturing = false;
      await capturePromise;
      return frame;
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const exportDir = path.join(ROOT, "exports");
  const framesDir = path.join(exportDir, "frames");
  const baseUrl = `http://127.0.0.1:${args.port}`;
  const exportUrl = `${baseUrl}/export/documents`;

  await fs.promises.mkdir(exportDir, { recursive: true });
  await fs.promises.mkdir(path.dirname(args.out), { recursive: true });

  if (!args.skipBuild) {
    console.log("Building production app (documents mode)…");
    await run("npm", ["run", "build:documents"]);
  }

  console.log(`Starting server on ${baseUrl}…`);
  const server = spawn("npm", ["run", "start", "--", "-p", String(args.port)], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, DEMO_MODE: "documents" },
    shell: process.platform === "win32",
  });

  const stopServer = () => {
    if (!server.killed) server.kill("SIGTERM");
  };

  process.on("SIGINT", stopServer);
  process.on("SIGTERM", stopServer);

  try {
    await waitForServer(exportUrl);

    console.log("Recording demo…");
    const browser = await chromium.launch({
      headless: true,
      channel: "chrome",
    });

    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();
    await page.goto(exportUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => document.documentElement.dataset.exportReady === "true",
      { timeout: 30_000 },
    );

    const capture = await captureFrames(page, framesDir);

    await page.waitForFunction(
      () => document.documentElement.dataset.exportComplete === "true",
      { timeout: EXPORT_DURATION_MS + 30_000 },
    );
    await new Promise((resolve) => setTimeout(resolve, 500));

    const frameCount = await capture.stop();
    await browser.close();

    console.log(`Captured ${frameCount} frames at ${FPS}fps`);
    console.log(`Encoding MP4: ${args.out}`);
    await framesToMp4(framesDir, args.out, FPS);
    await fs.promises.rm(framesDir, { recursive: true, force: true });

    console.log(`Done: ${args.out}`);
  } finally {
    stopServer();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
