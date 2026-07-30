"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

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
    question: "Does Brikli work in my province?",
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
    <span className={`logo ${light ? "logo-light" : ""}`}>
      <Image src="/brikli.svg" alt="Brikli" width={225} height={225} />
    </span>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setLoaded(true), 60);
    const stageTimer = window.setInterval(
      () => setActiveStage((current) => (current + 1) % stages.length),
      3800,
    );

    const onScroll = () => {
      setScrolled(window.scrollY > 32);
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
      window.clearInterval(stageTimer);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
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
              Brikli ensures renewals, notices, and rent increases happen on time—before gaps turn into lost revenue.
            </p>
            <div className="hero-actions">
              <a className="button button-paper" href="https://calendly.com/jonathan-brikli" target="_blank" rel="noreferrer">
                Book a demo <Arrow diagonal />
              </a>
              <a className="button button-ghost" href="#platform">See the platform <Arrow /></a>
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
            <p className="eyebrow" data-reveal>The lease intelligence layer</p>
            <h2 className="display-heading muted-reveal" data-reveal>
              Your portfolio should run on intelligence, <em>not institutional memory.</em>
            </h2>
            <div className="manifesto-copy" data-reveal>
              <p>Revenue is rarely lost all at once. It slips through a renewal sent late, a notice drafted wrong, or a turnover that sat too long.</p>
              <p>Brikli turns the documents you already have into a living system of tenants, timelines, and revenue actions—before your team has to chase them.</p>
            </div>
          </div>

          <div className="lease-art" aria-hidden="true" data-reveal>
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="lease-paper">
              <div className="lease-paper-head"><Logo /><span>LEASE / 00142</span></div>
              <p>1250 Pine Street</p>
              <h3>Unit 412</h3>
              <div className="paper-lines"><i /><i /><i /><i /></div>
              <div className="paper-event"><span>42</span><p>days until<br />renewal window</p></div>
              <div className="paper-status"><i /> All terms extracted</div>
            </div>
            <div className="floating-tag tag-top"><i /> N1 notice due</div>
            <div className="floating-tag tag-bottom">Audit trail · current</div>
          </div>
        </div>

        <div className="container principles">
          {[
            ["01", "Revenue before leakage", "Every lease event is surfaced early enough to act—so an avoidable gap never becomes a line item."],
            ["02", "Judgment stays human", "Brikli does the reading and drafting. Your operators keep the final say on what leaves the account."],
            ["03", "Compliance built in", "The right jurisdiction, timeline, form, and rent cap are applied to every workflow automatically."],
            ["04", "Every action, accountable", "A complete audit trail follows every notice, approval, edit, and send across the portfolio."],
          ].map(([number, title, copy], index) => (
            <article className="principle" data-reveal key={number} style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
              <span className="eyebrow accent">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="photo-break">
        <div className="photo-frame" data-reveal>
          <Image
            src="/brikli-atrium.jpg"
            alt="Atrium of a refined multifamily residence"
            fill
            sizes="100vw"
          />
          <div className="photo-overlay" />
          <div className="photo-copy">
            <p className="eyebrow light">Built for the long term</p>
            <h2>Infrastructure for the<br /><em>modern portfolio.</em></h2>
            <p>Built alongside the teams responsible for keeping buildings occupied, compliant, and growing.</p>
          </div>
        </div>
      </section>

      <section className="engine section-dark" id="how-it-works">
        <div className="container">
          <div className="section-intro dark-intro" data-reveal>
            <p className="eyebrow light">How Brikli works</p>
            <h2>One platform.<br /><em>Every lease workflow.</em></h2>
            <p>Brikli reads what happened, knows what comes next, and prepares the action your team needs to take.</p>
          </div>

          <div className="engine-layout">
            <div className="stage-list" role="tablist" aria-label="Lease workflow stages">
              {stages.map((stage, index) => (
                <button
                  key={stage.number}
                  className={`stage-button ${index === activeStage ? "stage-active" : ""}`}
                  onClick={() => setActiveStage(index)}
                  role="tab"
                  aria-selected={index === activeStage}
                >
                  <span>{stage.number}</span>
                  <div><small>{stage.name}</small><strong>{stage.title}</strong></div>
                  <i />
                </button>
              ))}
            </div>

            <div className="control-room" data-reveal>
              <div className="control-topbar">
                <Logo light />
                <span className="live-pill"><i /> LIVE</span>
                <span>1250 PINE / UNIT 412</span>
              </div>
              <div className="control-body">
                <div className="control-sidebar">
                  <span className="side-active">Overview</span>
                  <span>Leases <i>62</i></span>
                  <span>Workflows <i>3</i></span>
                  <span>Documents</span>
                  <span>Audit trail</span>
                </div>
                <div className="control-main">
                  <div className="workflow-heading">
                    <div><small>LEASE WORKFLOW</small><h3>{stages[activeStage].title}</h3></div>
                    <span>Updated now</span>
                  </div>
                  <p className="workflow-description">{stages[activeStage].body}</p>
                  <div className="workflow-grid">
                    <div className="document-card">
                      <div className="doc-title"><span>PDF</span><p>Lease_1250_Pine_412.pdf</p><i>12 pages</i></div>
                      <div className="doc-preview">
                        <b>RESIDENTIAL<br />TENANCY AGREEMENT</b>
                        <i /><i /><i /><i /><i />
                        <div className="scan-line" />
                      </div>
                    </div>
                    <div className="action-stack">
                      {stages[activeStage].points.map((point, index) => (
                        <div className="action-card" key={point}>
                          <span>{index + 1}</span>
                          <div><small>{index === 2 ? "READY" : "COMPLETE"}</small><strong>{point}</strong></div>
                          <i>✓</i>
                        </div>
                      ))}
                      <button className="review-button">Review prepared action <Arrow /></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="control-footer">
                <span><i /> Secure Canadian data residency</span>
                <span>Every action logged</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="setup section" id="why-brikli">
        <div className="container">
          <div className="section-intro" data-reveal>
            <p className="eyebrow">Zero setup</p>
            <h2>Drop your leases.<br /><em>Portfolio mapped instantly.</em></h2>
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
            <div className="process-arrow"><span>Brikli AI</span><i>→</i></div>
            <div className="portfolio-result">
              <div className="result-head"><small>PORTFOLIO CREATED</small><span><i /> LIVE</span></div>
              <h3>Oakwood Residential</h3>
              <div className="result-stats">
                <div><strong>62</strong><small>LEASES</small></div>
                <div><strong>14</strong><small>UPCOMING</small></div>
                <div><strong>3</strong><small>ACTIONS</small></div>
              </div>
              <div className="event-row"><span>N1</span><p>Rent increase · Unit 412<small>Ready to review</small></p><b>Today</b></div>
              <div className="event-row"><span>R</span><p>Renewal · Unit 7B<small>Window opens</small></p><b>3 days</b></div>
              <div className="event-row"><span>N4</span><p>Non-payment · Unit 3F<small>Draft prepared</small></p><b>5 days</b></div>
            </div>
          </div>

          <div className="setup-steps">
            {[
              ["1", "Upload", "Lease PDFs and rent rolls"],
              ["2", "Brikli reads", "Terms, deadlines, and risks mapped"],
              ["3", "Workflows appear", "Renewals and notices ready"],
            ].map(([number, title, copy]) => (
              <div key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="revenue section">
        <div className="container revenue-grid">
          <div className="revenue-copy" data-reveal>
            <p className="eyebrow light">The math you haven&apos;t done</p>
            <h2>Same portfolio.<br /><em>Higher revenue.</em></h2>
            <p>Missed renewals, invalid notices, slow turns, and under-market pricing compound quietly. Brikli catches the events that keep revenue moving.</p>
            <a href="#contact" className="text-link light-link">Model your portfolio <Arrow /></a>
          </div>
          <div className="revenue-card" data-reveal>
            <div className="revenue-card-head"><span>ESTIMATED ANNUAL RECOVERY</span><small>175 UNITS · ON + QC</small></div>
            <strong className="revenue-number">$78K<span>—</span>$186K</strong>
            <p>1.9%—4.5% of gross portfolio revenue</p>
            <div className="recovery-bars">
              {[
                ["Missed or delayed renewals", "84%"],
                ["Vacancy gap compression", "66%"],
                ["Under-market renewal pricing", "54%"],
                ["Compliance penalties avoided", "38%"],
              ].map(([label, width]) => (
                <div key={label}><span>{label}</span><i><b style={{ width }} /></i></div>
              ))}
            </div>
            <small>Based on CMHC 2025 data and operator benchmarks.</small>
          </div>
        </div>
      </section>

      <section className="trust section">
        <div className="container">
          <div className="trust-heading" data-reveal>
            <p className="eyebrow">Built for responsible operations</p>
            <h2>The intelligent parts touch the least data.</h2>
            <p>Brikli reads leases and property records to run workflows. Your team controls approvals, and every action is visible.</p>
          </div>
          <div className="trust-grid">
            {[
              ["01", "Human approval", "Nothing leaves your account until your team says so."],
              ["02", "Jurisdiction aware", "Rules and forms are matched to every property automatically."],
              ["03", "Complete audit trail", "Every source, edit, approval, and send is recorded."],
            ].map(([number, title, copy]) => (
              <article key={number} data-reveal>
                <span>{number}</span><div className="trust-icon"><i /><i /><i /></div><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faq section" id="faq">
        <div className="container faq-grid">
          <div className="faq-heading" data-reveal>
            <p className="eyebrow">Questions, answered</p>
            <h2>Everything you&apos;d ask <em>in a demo.</em></h2>
            <a href="mailto:support@brikli.com" className="text-link">Still curious? Talk to us <Arrow /></a>
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
            <p className="eyebrow light">Early access</p>
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
                <p className="eyebrow">You&apos;re on the list</p>
                <h3>Thanks. We&apos;ll be in touch within 24 hours.</h3>
                <button onClick={() => setSubmitted(false)}>Send another inquiry</button>
              </div>
            ) : (
              <form onSubmit={submitForm}>
                <div className="form-heading"><span>GET IN TOUCH</span><p>Tell us about your portfolio.</p></div>
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
                <button className="button button-forest" type="submit">Join the waitlist <Arrow /></button>
                <small>By submitting, you agree to be contacted about Brikli.</small>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-main">
          <div><Logo light /><p>The lease intelligence layer for Canadian multifamily.</p></div>
          <a className="footer-cta" href="https://calendly.com/jonathan-brikli" target="_blank" rel="noreferrer">Book a demo <Arrow diagonal /></a>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 BRIKLI</span>
          <nav>
            <a href="mailto:support@brikli.com">Support</a>
            <a href="https://www.linkedin.com/company/brikli" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/briklihq/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://brikli.com/privacy.html">Privacy</a>
            <a href="https://brikli.com/terms.html">Terms</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
