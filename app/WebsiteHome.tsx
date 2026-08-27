"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BloomMark } from "./components/BloomMark";
import { PlatformSection } from "@/components/platform/PlatformSection";

const manifestoCopy =
  "Brikli turns leases, rent rolls, and property records into compliant renewals, rent increases, and notices on the right provincial form and timeline. Every action is logged for audit, so your team can focus on decisions, not deadlines.";

const manifestoWords = manifestoCopy.split(" ");

const faqs = [
  {
    question: "Does Brikli work in my province/state?",
    answer:
      "Brikli is built for Canadian multifamily landlords, starting with Ontario, British Columbia, Alberta, and Québec. Your province is verified during setup so the correct rules, timelines, and forms are applied automatically.",
  },
  {
    question: "How does Brikli know which notice to send?",
    answer:
      "Brikli reads your lease terms and cross-references the residential tenancy requirements in your jurisdiction, from notice periods and forms to permitted increase rules and eviction grounds. When a deadline approaches, the correct action is surfaced with a document pre-filled for your tenant.",
  },
  {
    question: "Can it handle rent increases and eviction notices?",
    answer:
      "Yes. Brikli tracks the correct workflow by jurisdiction: N1 and N4 notices in Ontario, Form F and formal demands in Québec, and the equivalent forms in BC and Alberta. Your team reviews everything before it goes out.",
  },
  {
    question: "Can I review everything before it sends?",
    answer:
      "Always. Nothing leaves your account without approval. Every document is editable before sending, and you can choose where routine reminders are automated while sensitive actions always stay with your team.",
  },
  {
    question: "How long does setup take?",
    answer:
      "See value from your first couple of properties in an afternoon. Start with a focused set of lease PDFs and rent rolls, and Brikli maps the governing facts, deadlines, and active workflows before expanding across the portfolio.",
  },
  {
    question: "Why doesn’t Yardi just build this?",
    answer:
      "Property management systems are designed to record accounting and portfolio data. The controlling facts behind lease operations often live across agreements, amendments, notices, inboxes, and spreadsheets. Brikli reconciles that evidence and converts it into executable workflows.",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={diagonal ? "arrow arrow-diagonal" : "arrow"}>→</span>;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo ${light ? "logo-light" : ""}`} role="img" aria-label="Brikli">
      <Image src="/brikli.svg" alt="" width={225} height={225} aria-hidden="true" />
      <span className="logo-word" aria-hidden="true">Brikli</span>
    </span>
  );
}

function AnimatedMetric({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  enabled = true,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  enabled?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const metricRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const metric = metricRef.current;
    if (!metric) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let hasAnimated = false;

    const runAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      if (reducedMotion) {
        setDisplayValue(value);
        return;
      }

      const duration = 1900;
      let startTime = 0;

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(value * easedProgress);

        if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
      };

      animationFrame = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(metric);

    return () => {
      observer.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [enabled, value]);

  return (
    <strong
      ref={metricRef}
      className={className}
      aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}
    >
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </strong>
  );
}

export default function WebsiteHome() {
  const [loaded, setLoaded] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [manifestoWordCount, setManifestoWordCount] = useState(0);
  const manifestoTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setLoaded(true), 60);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introLeaveTimer = window.setTimeout(
      () => setIntroLeaving(true),
      reducedMotion ? 80 : 1850,
    );
    const introRemoveTimer = window.setTimeout(
      () => setIntroVisible(false),
      reducedMotion ? 280 : 3150,
    );
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 90);
      document.documentElement.style.setProperty(
        "--hero-shift",
        `${Math.min(window.scrollY, 700) * 0.1}px`,
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6%" },
    );

    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(loadTimer);
      window.clearTimeout(introLeaveTimer);
      window.clearTimeout(introRemoveTimer);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateManifesto = () => {
      animationFrame = 0;
      const track = manifestoTrackRef.current;
      if (!track) return;

      if (reducedMotion.matches) {
        setManifestoWordCount(manifestoWords.length);
        return;
      }

      const rect = track.getBoundingClientRect();
      const isCompact = window.innerWidth <= 640;
      const scrollDistance = isCompact
        ? window.innerHeight + rect.height
        : Math.max(rect.height - window.innerHeight, 1);
      const rawProgress = isCompact
        ? (window.innerHeight - rect.top) / scrollDistance
        : -rect.top / scrollDistance;
      const progress = Math.min(Math.max(rawProgress / 0.98, 0), 1);
      const openingWords = rawProgress >= 0 ? 0.04 : 0;
      const visibleProgress = openingWords + progress * (1 - openingWords);
      const nextCount = Math.ceil(visibleProgress * manifestoWords.length);

      setManifestoWordCount((current) => current === nextCount ? current : nextCount);
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateManifesto);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          city: formData.get("city"),
          portfolio: formData.get("portfolio"),
          website: formData.get("website"),
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      form.reset();
      setSubmitted(true);
    } catch {
      setSubmitError("We couldn’t send this right now. Please email support@brikli.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {introVisible && (
        <div className={`bloom-intro ${introLeaving ? "bloom-intro-leaving" : ""}`} aria-hidden="true">
          <BloomMark size={176} speed={1.35} loop={false} color="#f4f1e8" />
        </div>
      )}

      <header className={`site-header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="nav-shell">
          <a href="#top" aria-label="Brikli home"><Logo /></a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#platform">Platform</a>
            <a href="#how-it-works">How it works</a>
            <a href="#why-brikli">Why Brikli</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <a className="nav-cta" href="https://calendly.com/jonathan-brikli" target="_blank" rel="noreferrer">Book a demo <Arrow /></a>
            <button
              className={`menu-button ${menuOpen ? "menu-open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span /><span />
            </button>
          </div>
        </div>
        <div className={`mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}>
          {["Platform", "How it works", "Why Brikli", "FAQ"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replaceAll(" ", "-")}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}<Arrow />
            </a>
          ))}
        </div>
      </header>

      <section className="hero" id="top">
        <Image
          className="hero-image"
          src="/brikli-hero.png"
          alt="Painted sunlit courtyard of a multifamily residence"
          fill
          sizes="100vw"
          priority
        />
        <div className="hero-wash" />
        <div className="container hero-content">
          <div className={`hero-copy ${loaded ? "hero-copy-in" : ""}`}>
            <h1>
              <span className="hero-title-line">The AI execution</span>{" "}
              <span className="hero-title-line">layer for real estate</span>{" "}
              <span className="hero-title-line">operations.</span>
            </h1>
            <p className="hero-deck">
              <span className="hero-automation-intro">Put Brikli to work by automating your</span>
              <span className="hero-automation-window" aria-hidden="true">
                <span className="hero-automation-track">
                  <span>leases</span>
                  <span>rent rolls</span>
                  <span>renewals</span>
                  <span>maintenance</span>
                  <span>leases</span>
                </span>
              </span>
              <span className="hero-automation-accessible"> leases, rent rolls, renewals, and maintenance.</span>
            </p>
            <div className="hero-actions">
              <a className="button button-paper" href="https://calendly.com/jonathan-brikli" target="_blank" rel="noreferrer">
                Book a demo
              </a>
              <a className="button button-ghost" href="#platform">See the platform</a>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-green-band" aria-label="Customer trust">
        <div className="container">
          <p>Trusted by leading <br />owners and operators</p>
        </div>
      </section>

      <section className="manifesto" id="platform">
        <div className="manifesto-track" ref={manifestoTrackRef}>
          <div className="manifesto-sticky">
            <h2 className="manifesto-statement" aria-label={manifestoCopy}>
              {manifestoWords.map((word, index) => (
                <span
                  aria-hidden="true"
                  className={`manifesto-word ${index < manifestoWordCount || (index >= manifestoWords.length - 4 && manifestoWordCount > manifestoWords.length - 4) ? "manifesto-word-active" : ""} ${index >= manifestoWords.length - 4 ? "manifesto-word-accent" : ""}`}
                  key={`${word}-${index}`}
                >
                  {word}
                </span>
              ))}
            </h2>

            <aside className="manifesto-impact" aria-label="Revenue impact metrics">
              <span className="impact-kicker">Revenue impact</span>
              <AnimatedMetric className="impact-total" value={389} prefix="$" suffix="M+" enabled={!introVisible} />
              <div className="impact-details">
                <div>
                  <AnimatedMetric value={7.3} decimals={1} suffix="B" enabled={!introVisible} />
                  <span>In increased asset valuation</span>
                </div>
                <div>
                  <AnimatedMetric value={15} suffix="M+" enabled={!introVisible} />
                  <span>Audits performed</span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="principles-spacer" aria-hidden="true" />
      </section>

      <PlatformSection />

      <section className="engine section-dark" id="how-it-works">
        <div className="container">
          <div className="engine-layout">
            <div className="workflow-demo" data-reveal>
              <h3>Drop your leases. <em>Portfolio mapped instantly.</em></h3>
              <p>Brikli turns the files sitting in your inbox and drives into a live portfolio, with every tenant, timeline, and action already in place.</p>
              <video
                className="workflow-demo-video"
                src="/our-workflows-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                preload="metadata"
              >
                Your browser does not support embedded video.
              </video>
            </div>

            <div className="workflow-demo" data-reveal>
              <h3>Ask a question. Get the answer and the page it came from.</h3>
              <p>Every rent, deposit, deadline, and clause across your buildings is one plain-English question away, and Brikli answers from your own documents with the file, page, and line attached, so you can check the work before you act on it.</p>
              <video
                className="workflow-demo-video"
                src="/question-answer-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                preload="metadata"
              >
                Your browser does not support embedded video.
              </video>
            </div>

          </div>
        </div>
      </section>

      <section className="jurisdiction-feature" id="why-brikli" aria-labelledby="jurisdiction-heading">
        <div className="jurisdiction-feature-image" data-reveal>
          <Image
            src="/output-image (3).png"
            alt="A city skyline representing the jurisdictions where property teams operate"
            fill
            sizes="(max-width: 780px) 100vw, 50vw"
          />
        </div>
        <div className="feature-copy" data-reveal>
          <h2 id="jurisdiction-heading">Built for the rules<br />that govern every property.</h2>
          <p>Brikli matches each property to its jurisdiction, effective rules, required timelines, and current forms. Every workflow stays compliant from decision to delivery.</p>
        </div>
      </section>

      <section className="security-feature" aria-labelledby="security-heading">
        <div className="feature-copy security-feature-copy" data-reveal>
          <h2 id="security-heading">Built on trust<br />and security.</h2>
          <p>Built with enterprise-grade security so you never have to think twice about privacy, ownership, or control. Encrypted at rest and in transit.</p>
          <a href="mailto:support@brikli.com">
            Talk to us about security <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="security-feature-image" data-reveal>
          <Image
            src="/output-image (1).png"
            alt="Warm, refined interior of a multifamily residence"
            fill
            sizes="(max-width: 780px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="faq section" id="faq">
        <div className="container faq-layout">
          <div className="faq-heading" data-reveal>
            <h2>Questions, answered</h2>
          </div>
          <div className="accordion" data-reveal>
            {faqs.map((faq, index) => (
              <div className={`faq-item ${openFaq === index ? "faq-open" : ""}`} key={faq.question}>
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                  <span>{faq.question}</span><i><b /><b /></i>
                </button>
                <div className="faq-answer"><div><p>{faq.answer}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact section-dark" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy" data-reveal>
            <h2>Put every lease<br /><em>to work.</em></h2>
            <p>Revenue-critical operational infrastructure for Canadian multifamily teams managing complex lease obligations.</p>
          </div>
          <div className="contact-form-wrap" data-reveal>
            {submitted ? (
              <div className="success-message">
                <span>✓</span>
                <h3>Thanks. We&apos;ll be in touch.</h3>
                <button onClick={() => setSubmitted(false)}>Send another inquiry</button>
              </div>
            ) : (
              <form onSubmit={submitForm}>
                <div className="form-heading"><p>Tell us about your portfolio.</p></div>
                <label className="form-honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
                <label><span>Name</span><input name="name" autoComplete="name" required /></label>
                <div className="form-row">
                  <label><span>Work email</span><input type="email" name="email" autoComplete="email" required /></label>
                  <label><span>City</span><input name="city" autoComplete="address-level2" /></label>
                </div>
                <label>
                  <span>Portfolio size</span>
                  <select name="portfolio" required defaultValue="">
                    <option value="" disabled>Select a range</option>
                    <option>1—10 units</option><option>11—50 units</option><option>51—200 units</option>
                    <option>201—500 units</option><option>500+ units</option>
                  </select>
                </label>
                {submitError && <p className="form-error" role="alert">{submitError}</p>}
                <button className="button button-forest" type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send inquiry"} {!submitting && <Arrow />}
                </button>
                <small>By submitting, you agree to be contacted about Brikli.</small>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-fade" />
        <div className="container footer-showcase">
          <div className="footer-lockup" role="img" aria-label="Brikli">
            <span aria-hidden="true">Brikli</span>
            <div className="footer-mark" aria-hidden="true">
              <Image
                src="/brikli.svg"
                alt=""
                width={225}
                height={225}
              />
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <div>
              <a href="#platform">Platform</a>
              <a href="#how-it-works">How it works</a>
              <a href="#why-brikli">Why Brikli</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <a href="#contact">Contact</a>
              <a href="mailto:support@brikli.com">Support</a>
              <a href="https://www.linkedin.com/company/brikli" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/briklihq/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Brikli. All rights reserved.</span>
          <nav aria-label="Legal and support">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="mailto:support@brikli.com">support@brikli.com</a>
          </nav>
        </div>
      </footer>

    </main>
  );
}
