"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { BloomMark } from "./components/BloomMark";

const stages = [
  {
    number: "01",
    name: "Reads",
    title: "It reads every lease.",
    body: "Every PDF, rent roll, and email is parsed and structured automatically.",
    points: ["Lease terms extracted", "Rent rolls reconciled", "Obligations surfaced"],
  },
  {
    number: "02",
    name: "Decides",
    title: "It knows every deadline.",
    body: "Every event is tracked against the rules in your jurisdiction. No spreadsheet required.",
    points: ["Renewal windows calculated", "Rent caps checked", "Timelines tracked"],
  },
  {
    number: "03",
    name: "Executes",
    title: "It runs the workflow.",
    body: "Notices, renewals, and filings are drafted correctly and sent from your account.",
    points: ["Notices pre-filled", "Approvals kept human", "Audit trail logged"],
  },
];

const faqs = [
  {
    question: "Does Brikli work in my province/state?",
    answer:
      "Brikli is built for Canadian multifamily landlords, starting with Ontario, British Columbia, Alberta, and Québec. Your province is verified during setup so the correct rules, timelines, and forms are applied automatically.",
  },
  {
    question: "How does Brikli know which notice to send?",
    answer:
      "Brikli reads your lease terms and cross-references the residential tenancy requirements in your jurisdiction—from notice periods and forms to rent increase caps and eviction grounds. When a deadline approaches, the correct action is surfaced with a document pre-filled for your tenant.",
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
      "An afternoon, not seven weeks. Drop in lease PDFs and rent rolls and Brikli builds the portfolio, maps deadlines, and surfaces active workflows automatically—without a drawn-out software migration.",
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

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
            <a className="nav-cta" href="#contact">Join the waitlist <Arrow /></a>
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
            <h1>Every lease.<br />Every deadline.<br /><em>Handled.</em></h1>
            <p className="hero-deck">
              Brikli ensures renewals, notices, and rent increases happen on time before gaps turn into lost revenue.
            </p>
            <div className="hero-actions">
              <a className="button button-paper" href="https://calendly.com/jonathan-brikli" target="_blank" rel="noreferrer">
                Book a demo
              </a>
              <a className="button button-ghost" href="#platform">See the platform</a>
            </div>
          </div>
        </div>
        <a href="#platform" className="scroll-cue" aria-label="Scroll to discover">
          <span>Scroll to discover</span><i />
        </a>
      </section>

      <section className="manifesto section" id="platform">
        <div className="container manifesto-grid">
          <div>
            <h2 className="display-heading muted-reveal">
              Your portfolio should run on intelligence, <em>not institutional memory.</em>
            </h2>
            <div className="manifesto-copy">
              <p>Revenue is rarely lost all at once. It slips through a renewal sent late, a notice drafted wrong, or a turnover that sat too long.</p>
              <p>Brikli turns the documents you already have into a living system of tenants, timelines, and revenue actions—before your team has to chase them.</p>
            </div>
          </div>

          <div className="lease-art" aria-hidden="true" data-reveal>
            <div className="lease-paper">
              <div className="lease-paper-head"><Logo /><span>LEASE / 00142</span></div>
              <p>1250 Pine Street</p>
              <h3>Unit 412</h3>
              <div className="paper-lines"><i /><i /><i /><i /></div>
              <div className="paper-event"><span>42</span><p>days until<br />renewal window</p></div>
              <div className="paper-status"><i /> All terms extracted</div>
            </div>
          </div>
        </div>

        <div className="container principles">
          {[
            ["01", "Revenue before leakage", "Every lease event is surfaced early enough to act—so an avoidable gap never becomes a line item."],
            ["02", "Judgment stays human", "Brikli does the reading and drafting. Your operators keep the final say on what leaves the account."],
            ["03", "Compliance built in", "The right jurisdiction, timeline, form, and rent cap are applied to every workflow automatically."],
            ["04", "Every action, accountable", "A complete audit trail follows every notice, approval, edit, and send across the portfolio."],
          ].map(([number, title, copy], index) => (
            <article className="principle" data-reveal key={number} style={{ "--delay": `${index * 220}ms` } as React.CSSProperties}>
              <span className="principle-number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="photo-break">
        <div className="photo-frame" data-reveal>
          <Image
            src="/output-image (1).png"
            alt="Painted atrium of a refined multifamily residence"
            fill
            sizes="100vw"
          />
          <div className="photo-overlay" />
          <div className="photo-copy">
            <h2>Infrastructure for the<br /><em>modern portfolio.</em></h2>
            <p>Built alongside the teams responsible for keeping buildings occupied, compliant, and growing.</p>
          </div>
        </div>
      </section>

      <section className="engine section-dark" id="how-it-works">
        <div className="container">
          <div className="section-intro dark-intro" data-reveal>
            <h2>One platform.<br /><em>Every lease workflow.</em></h2>
            <p>Brikli reads what happened, knows what comes next, and prepares the action your team needs to take.</p>
          </div>

          <div className="engine-layout">
            <div className="stage-visual-grid">
              <div className="stage-visual stage-visual-reads" data-reveal>
                <Image
                  src="/brikli-lease-scanner.svg"
                  alt="Brikli scanning documents from a lease library"
                  width={688}
                  height={500}
                />
              </div>
              <div className="stage-visual stage-visual-deadlines" data-reveal>
                <Image
                  src="/brikli-deadline-intelligence.svg"
                  alt="Brikli checking lease records against a deadline"
                  width={640}
                  height={498}
                />
              </div>
              <div className="stage-visual stage-visual-executes" data-reveal>
                <Image
                  src="/brikli-workflow-execution.png"
                  alt="Brikli moving a lease workflow from preparation through approval to completion"
                  width={1470}
                  height={1070}
                />
              </div>
            </div>

            <div className="stage-list" role="list" aria-label="Lease workflow stages">
              {stages.map((stage) => (
                <div
                  key={stage.number}
                  className="stage-button stage-active"
                  role="listitem"
                >
                  <span>{stage.number}</span>
                  <div><small>{stage.name}</small><strong>{stage.title}</strong></div>
                  <i />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="setup section" id="why-brikli">
        <div className="container">
          <div className="section-intro" data-reveal>
            <h2>Drop your leases. <em>Portfolio mapped instantly.</em></h2>
            <p>Brikli turns the files sitting in your inbox and drives into a live portfolio—with every tenant, timeline, and action already in place.</p>
          </div>

          <div className="setup-visual" data-reveal>
            <div className="upload-zone">
              <div className="upload-icon"><span>↑</span></div>
              <small>YOUR DOCUMENTS</small>
              <h3>Drop files to build your portfolio</h3>
              <p>Leases · rent rolls · notices · emails</p>
              <div className="file-chips">
                <span><b>XLSX</b> Portfolio rent roll</span>
                <span><b>PDF</b> Residential lease</span>
                <span><b>PDF</b> N1 notice</span>
              </div>
            </div>
            <div className="process-arrow"><span></span><i>→</i></div>
            <div className="portfolio-result">
              <h3>Oakwood Residential</h3>
              <div className="result-stats">
                <div><strong>1520</strong><small>LEASES</small></div>
                <div><strong>96</strong><small>UPCOMING</small></div>
                <div><strong>50</strong><small>ACTIONS</small></div>
              </div>
              <div className="event-row"><span>N1</span><p>Rent increase · Unit 412<small>Ready to review</small></p><b>Today</b></div>
              <div className="event-row"><span>R</span><p>Renewal · Unit 7B<small>Window opens</small></p><b>3 days</b></div>
              <div className="event-row"><span>N4</span><p>Non-payment · Unit 3F<small>Draft prepared</small></p><b>5 days</b></div>
            </div>
          </div>

        </div>
      </section>

      <section className="trust section">
        <div className="container trust-layout">
          <div className="trust-copy" data-reveal>
            <h2>Built to the standards your portfolio demands.</h2>
            <p>Brikli reads leases and property records to run workflows, never to replace your judgment. Your team controls approvals, and every action stays visible.</p>
          </div>
          <div className="standards-list" data-reveal>
            {[
              ["Human approval", "Nothing leaves your account until your team says so."],
              ["Jurisdiction aware", "Rules, timelines, and forms are matched to every property."],
              ["Complete audit trail", "Every source, edit, approval, and send is recorded."],
            ].map(([title, copy]) => (
              <article className="standard-row" key={title}>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
            <a href="mailto:support@brikli.com">Talk to us about security <span aria-hidden="true">↗</span></a>
          </div>
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
            <p>Join Canadian multifamily operators building a portfolio that acts before revenue slips away.</p>
            <ul>
              <li><i /> Founding pricing locked for year one</li>
              <li><i /> Live in an afternoon</li>
              <li><i /> We respond within 24 hours</li>
            </ul>
          </div>
          <div className="contact-form-wrap" data-reveal>
            {submitted ? (
              <div className="success-message">
                <span>✓</span>
                <h3>Thanks. We&apos;ll be in touch within 24 hours.</h3>
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
                  {submitting ? "Sending…" : "Join the waitlist"} {!submitting && <Arrow />}
                </button>
                <small>By submitting, you agree to be contacted about Brikli.</small>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-fade" />
        <div className="container footer-main">
          <div className="footer-intro">
            <p>Lease intelligence for modern multifamily operators.</p>
            <a className="footer-demo" href="https://calendly.com/jonathan-brikli" target="_blank" rel="noreferrer">
              Book a demo <Arrow />
            </a>
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
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Brikli. All rights reserved.</span>
          <a href="mailto:support@brikli.com">support@brikli.com</a>
        </div>
      </footer>

    </main>
  );
}
