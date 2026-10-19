"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useExercises } from "@/hooks/useExercises";

function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function StrokeIcon({ d, extra }: { d?: string; extra?: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d ? <path d={d} /> : extra}
    </svg>
  );
}

export function LandingView() {
  const t = useTranslations("landing");
  const th = useTranslations("home");
  const exercises = useExercises();

  useEffect(() => {
    const nav = document.getElementById("landing-nav");
    const onScroll = () => {
      nav?.classList.toggle("scrolled", window.pageYOffset > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const productLinks = t.raw("footerProductLinks") as string[];
  const resourcesLinks = t.raw("footerResourcesLinks") as string[];
  const companyLinks = t.raw("footerCompanyLinks") as string[];

  const trustItems = [
    {
      icon: <StrokeIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      label: t("trust1"),
      sub: t("trust1Sub"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
          }
        />
      ),
      label: t("trust2"),
      sub: t("trust2Sub"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
          }
        />
      ),
      label: t("trust3"),
      sub: t("trust3Sub"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          }
        />
      ),
      label: t("trust4"),
      sub: t("trust4Sub"),
    },
  ];

  const features = [
    {
      icon: (
        <StrokeIcon
          extra={
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </>
          }
        />
      ),
      title: t("feat1Title"),
      desc: t("feat1Desc"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          }
        />
      ),
      title: t("feat2Title"),
      desc: t("feat2Desc"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </>
          }
        />
      ),
      title: t("feat3Title"),
      desc: t("feat3Desc"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          }
        />
      ),
      title: t("feat4Title"),
      desc: t("feat4Desc"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </>
          }
        />
      ),
      title: t("feat5Title"),
      desc: t("feat5Desc"),
    },
    {
      icon: (
        <StrokeIcon
          extra={
            <>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </>
          }
        />
      ),
      title: t("feat6Title"),
      desc: t("feat6Desc"),
    },
  ];

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  const testimonials = [
    { text: t("t1Text"), name: t("t1Name"), role: t("t1Role"), color: "var(--teal)" },
    { text: t("t2Text"), name: t("t2Name"), role: t("t2Role"), color: "var(--terracotta)" },
    { text: t("t3Text"), name: t("t3Name"), role: t("t3Role"), color: "var(--sage)" },
  ];

  return (
    <div className="landing">
      <nav className="nav" id="landing-nav">
        <div className="container nav-inner">
          <a href="#" className="nav-logo">
            CTB<span>.</span>
          </a>
          <ul className="nav-links">
            <li>
              <a href="#features">{t("navFeatures")}</a>
            </li>
            <li>
              <a href="#how-it-works">{t("navHow")}</a>
            </li>
            <li>
              <a href="#exercises">{t("navExercises")}</a>
            </li>
            <li>
              <a href="#testimonials">{t("navStories")}</a>
            </li>
          </ul>
          <a href="#cta" className="nav-cta">
            {t("navCta")}
            <ArrowIcon size={14} />
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">{t("heroBadge")}</div>
            <h1 className="display">
              {t("heroTitleA")} <em>{t("heroTitleEm")}</em>
              {t("heroTitleB")}
            </h1>
            <p className="hero-sub">{t("heroSub")}</p>
            <div className="hero-actions">
              <a href="#cta" className="btn btn-primary">
                {t("heroPrimary")}
                <ArrowIcon />
              </a>
              <a href="#how-it-works" className="btn btn-secondary">
                {t("heroSecondary")}
              </a>
            </div>
            <div className="hero-proof">
              <div className="hero-proof-avatars">
                <span>SC</span>
                <span>MR</span>
                <span>JD</span>
              </div>
              <span>{t("heroProof")}</span>
            </div>
          </div>

          <div className="phone-wrap">
            <div className="phone">
              <div className="phone-screen">
                <div className="phone-statusbar">
                  <span>9:41</span>
                  <span>&#128267;</span>
                </div>
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <span className="phone-greeting">{t("phoneGreeting")}</span>
                  <span className="phone-title">{t("phoneTitle")}</span>
                  <div className="phone-mood">
                    <div className="phone-mood-label">{t("phoneMoodLabel")}</div>
                    <div className="phone-mood-emojis">
                      <span>&#128533;</span>
                      <span>&#128528;</span>
                      <span className="selected">&#128522;</span>
                      <span>&#128516;</span>
                      <span>&#128578;</span>
                    </div>
                  </div>
                  <div className="phone-exercise">
                    <div className="phone-exercise-header">
                      <span className="phone-exercise-title">{t("phoneExerciseTitle")}</span>
                      <span className="phone-exercise-tag">{t("phoneExerciseTag")}</span>
                    </div>
                    <div className="phone-exercise-desc">{t("phoneExerciseDesc")}</div>
                  </div>
                  <div className="phone-btn">{t("phoneBtn")}</div>
                </div>
                <div className="phone-bottom-nav">
                  <div className="phone-nav-item active">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                  <div className="phone-nav-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <div className="phone-nav-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="container trust-grid">
          {trustItems.map((item) => (
            <div className="trust-item" key={item.label}>
              <div className="trust-icon">{item.icon}</div>
              <div className="trust-label">{item.label}</div>
              <div className="trust-sublabel">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t("featuresTag")}</div>
            <h2 className="section-title display">{t("featuresTitle")}</h2>
            <p className="section-desc">{t("featuresDesc")}</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="container hiw-grid">
          <div>
            <div className="section-tag">{t("howTag")}</div>
            <h2 className="section-title display">{t("howTitle")}</h2>
            <p className="section-desc">{t("howDesc")}</p>
            <div className="hiw-steps">
              {steps.map((s, i) => (
                <div className="hiw-step" key={s.title}>
                  <div className="hiw-step-num">{i + 1}</div>
                  <div>
                    <div className="hiw-step-title">{s.title}</div>
                    <div className="hiw-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="phone-wrap">
            <div className="phone">
              <div className="phone-screen">
                <div className="phone-statusbar">
                  <span>9:41</span>
                  <span>&#128267;</span>
                </div>
                <div className="phone-notch"></div>
                <div className="phone-content">
                  <span className="phone-greeting">{t("progressGreeting")}</span>
                  <span className="phone-title">{t("progressTitle")}</span>
                  <div className="phone-mood">
                    <div className="phone-mood-label">{t("moodTrend")}</div>
                    <div style={{ padding: "8px 0" }}>
                      <svg width="100%" height="60" viewBox="0 0 240 60" fill="none">
                        <polyline
                          points="0,45 40,40 80,35 120,30 160,22 200,15 240,10"
                          stroke="#7BA89C"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <circle cx="240" cy="10" r="4" fill="#7BA89C" />
                      </svg>
                    </div>
                  </div>
                  <div className="phone-exercise">
                    <div className="phone-exercise-header">
                      <span className="phone-exercise-title">{t("streakTitle")}</span>
                      <span className="phone-exercise-tag">{t("streakTag")}</span>
                    </div>
                    <div className="phone-exercise-desc">{t("streakDesc")}</div>
                  </div>
                  <div className="phone-exercise">
                    <div className="phone-exercise-header">
                      <span className="phone-exercise-title">{t("insightTitle")}</span>
                    </div>
                    <div className="phone-exercise-desc">{t("insightDesc")}</div>
                  </div>
                  <div className="phone-btn" style={{ background: "var(--teal-soft)" }}>
                    {t("reportBtn")}
                  </div>
                </div>
                <div className="phone-bottom-nav">
                  <div className="phone-nav-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                  <div className="phone-nav-item active">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div className="phone-nav-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="exercises" id="exercises">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t("exTag")}</div>
            <h2 className="section-title display">{t("exTitle")}</h2>
            <p className="section-desc">{t("exDesc")}</p>
          </div>
          <div className="features-grid">
            {exercises.map((ex) => (
              <Link key={ex.id} href={`/exercises/${ex.id}`} className="feature-card">
                <div className="section-tag">{th(`categories.${ex.category}`)}</div>
                <div className="feature-title">{ex.title}</div>
                <div className="feature-desc">
                  {t("exCta")} <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t("storiesTag")}</div>
            <h2 className="section-title display">{t("storiesTitle")}</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <div className="testimonial-card" key={item.name}>
                <div className="testimonial-stars">★ ★ ★ ★ ★</div>
                <p className="testimonial-text">&quot;{item.text}&quot;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: item.color }}>
                    {item.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="testimonial-name">{item.name}</div>
                    <div className="testimonial-role">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta" id="cta">
        <div className="container">
          <h2 className="display">
            {t("ctaTitleA")}
            <br />
            {t("ctaTitleB")}
          </h2>
          <p>{t("ctaDesc")}</p>
          <div className="cta-actions">
            <a href="#" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </a>
            <a href="#" className="btn btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.68.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
              </svg>
              Google Play
            </a>
          </div>
          <p className="cta-note">{t("ctaNote")}</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo">
                CTB<span>.</span>
              </div>
              <p>{t("footerTagline")}</p>
            </div>
            <div className="footer-col">
              <h4>{t("footerProduct")}</h4>
              <ul>
                {productLinks.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t("footerResources")}</h4>
              <ul>
                {resourcesLinks.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t("footerCompany")}</h4>
              <ul>
                {companyLinks.map((l) => (
                  <li key={l}>
                    <a href="#">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t("footerRights")}</span>
            <div className="footer-social">
              <a href="#" aria-label="Twitter / X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="footer-disclaimer">{t("footerDisclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
