import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Brikli",
  description: "How Brikli collects, uses, and protects personal information submitted through its website.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link className="legal-home" href="/" aria-label="Brikli home">
            <Image src="/brikli.svg" alt="" width={38} height={38} aria-hidden="true" />
            <span>Brikli</span>
          </Link>
          <Link className="legal-back" href="/">Back to website</Link>
        </div>
      </header>

      <article className="legal-document">
        <h1>Privacy Policy</h1>
        <p className="legal-effective">Effective August 22, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>This policy explains how Brikli collects, uses, and handles personal information when you visit our website, submit an inquiry, or book a demonstration.</p>
        </section>

        <section>
          <h2>Information we collect</h2>
          <p>When you contact us, we may collect your name, work email, city, portfolio size, and any other information you choose to provide. Our website and service providers may also process technical information such as your IP address, browser type, device information, and request logs.</p>
        </section>

        <section>
          <h2>How we use information</h2>
          <p>We use personal information to respond to inquiries, schedule and provide demonstrations, communicate about Brikli, maintain website security, prevent abuse, and improve our website and services.</p>
        </section>

        <section>
          <h2>Service providers</h2>
          <p>We may share information with providers that support website hosting, email delivery, scheduling, security, and related business operations. These providers process information on our behalf or under their own applicable terms. Booking a demo through Calendly is also subject to Calendly&apos;s privacy practices.</p>
        </section>

        <section>
          <h2>Retention and security</h2>
          <p>We retain information only for as long as reasonably necessary for the purposes described above, to meet legal obligations, and to resolve disputes. We use reasonable administrative, technical, and organizational measures to protect information, but no transmission or storage system is completely secure.</p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>You may ask to access, correct, or delete personal information we hold about you, subject to applicable law. You may also ask us to stop sending non-essential communications.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>For privacy questions or requests, email <a href="mailto:support@brikli.com">support@brikli.com</a>.</p>
        </section>
      </article>
    </main>
  );
}
