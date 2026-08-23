import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Brikli",
  description: "Terms governing access to and use of the Brikli website.",
};

export default function TermsPage() {
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
        <h1>Terms of Use</h1>
        <p className="legal-effective">Effective August 22, 2026</p>

        <section>
          <h2>Acceptance</h2>
          <p>By accessing the Brikli website, you agree to these Terms of Use. If you do not agree, do not use the website.</p>
        </section>

        <section>
          <h2>Website purpose</h2>
          <p>The website provides general information about Brikli and allows prospective customers to contact us or book a demonstration. It does not provide legal, accounting, or other professional advice. Any use of the Brikli product is governed by the applicable customer agreement, not these website terms.</p>
        </section>

        <section>
          <h2>Permitted use</h2>
          <p>You may use the website only for lawful purposes. You must not interfere with its operation, attempt unauthorized access, submit malicious code, misuse forms, scrape the website through automated means, or use its content in a way that infringes another party&apos;s rights.</p>
        </section>

        <section>
          <h2>Intellectual property</h2>
          <p>The website and its content, design, branding, graphics, and software are owned by Brikli or its licensors and are protected by applicable intellectual property laws. No rights are granted except the limited right to access and use the website under these terms.</p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>The website may link to third-party services, including scheduling and social platforms. Brikli does not control those services and is not responsible for their content, availability, or practices. Your use of them is governed by their own terms and policies.</p>
        </section>

        <section>
          <h2>Availability and disclaimers</h2>
          <p>The website is provided on an “as is” and “as available” basis. To the extent permitted by law, Brikli disclaims warranties regarding the website&apos;s availability, accuracy, security, or fitness for a particular purpose.</p>
        </section>

        <section>
          <h2>Limitation of liability</h2>
          <p>To the extent permitted by law, Brikli will not be liable for indirect, incidental, special, consequential, or punitive damages arising from access to or use of the website.</p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>We may update these terms from time to time. The effective date above indicates when the current version took effect. Continued use of the website after an update constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about these terms may be sent to <a href="mailto:support@brikli.com">support@brikli.com</a>.</p>
        </section>
      </article>
    </main>
  );
}
