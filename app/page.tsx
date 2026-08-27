import { DemoModeHome } from "@/components/demo/DemoModeHome";
import WebsiteHome from "./WebsiteHome";

export default function Home() {
  const mode = process.env.DEMO_MODE;

  if (mode) {
    return <DemoModeHome mode={mode} />;
  }

  return <WebsiteHome />;
}
