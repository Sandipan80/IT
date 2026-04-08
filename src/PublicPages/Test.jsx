import React, { useEffect, useRef, useState,useLayoutEffect } from "react";
// import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VaultBack from "../../src/assets/vault_categories_white_bg.svg";
// ─────────────────────────────────────────────
// FONT: Add this to your index.html <head>
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
// ─────────────────────────────────────────────

// ── SHARED HOOK: Intersection Observer for scroll reveals ──
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Reset any stale state before building
      gsap.set(svgRef.current, { scale: 1, opacity: 1, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",        // fires the instant this hits the top — no offset
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        svgRef.current,
        {
          scale: 18,
          transformOrigin: "50% 50%", // dead center — text is centered in viewBox
          ease: "power2.inOut",
          duration: 1,
        },
        0
      );

      tl.to(
        svgRef.current,
        {
          opacity: 0,
          ease: "none",
          duration: 0.2,
        },
        0.85
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    /*
      Key fix: remove overflow-hidden from the outer container — it was
      clipping the sticky context and causing ScrollTrigger to miscalculate
      the pin start, producing the upward drift on first scroll.
      The h-screen + relative is all that's needed for the pin anchor.
    */
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-white"
      style={{ marginTop: 0, paddingTop: 0 }}
    >
      {/* ── BACKGROUND IMAGE ── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center px-16 py-10 bg-white">
        <img
          src={VaultBack}
          alt="Vault background"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/*
        ── SVG MASK LAYER
        Critical fixes:
        1. viewBox is now 100x100 so percentage coords are literal percentages
           — no more unit mismatch between viewBox and screen space
        2. Text sits at exactly 50% 50% — same as transformOrigin
        3. No dominantBaseline or textAnchor tricks that shift the bbox
           away from the declared x/y center
        4. The outer <svg> has top-0 explicitly and no margin
      */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
          willChange: "transform, opacity",
          contain: "strict",
          display: "block",   // removes inline-block gap (the tiny space browsers add under SVGs)
        }}
      >
        <defs>
          <mask id="vault-mask">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {/*
              fontSize="18" in a 100-unit viewBox with slice scaling
              renders as ~180px on a 1000px wide screen — equivalent to before.
              x="50" y="50" + textAnchor + dominantBaseline = true geometric center.
              This means transformOrigin: "50% 50%" on the SVG element
              rotates/scales exactly around the text — no drift.
            */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="18"
              fontWeight="900"
              letterSpacing="0.8"
              fill="black"
            >
              VAULT
            </text>
          </mask>
        </defs>

        <rect
          x="0" y="0"
          width="100" height="100"
          fill="white"
          mask="url(#vault-mask)"
        />
      </svg>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-400">
        <svg
          width="20" height="28" viewBox="0 0 20 28"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          className="animate-bounce"
        >
          <rect x="1" y="1" width="18" height="26" rx="9"
            stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="8" r="2.5" fill="currentColor" opacity="0.6">
            <animate attributeName="cy" values="8;16;8" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
        <p className="text-[10px] tracking-[0.2em] font-semibold uppercase">
          Scroll to Explore
        </p>
      </div>
    </div>
  );
}; 

const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

// ── SHARED: animated counter ──
const useCounter = (target, inView, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
};

// ════════════════════════════════════════════════════════════
// 1. IMPACT SECTION
// ════════════════════════════════════════════════════════════
const ImpactSection = () => {
  const [ref, inView] = useInView();

  const stats = [
    { value: 98, suffix: "%", label: "SLA Compliance", desc: "Across all active helpdesk contracts" },
    { value: 40, suffix: "%", label: "Faster Resolution", desc: "Average ticket close time reduced" },
    { value: 12000, suffix: "+", label: "Assets Tracked", desc: "Devices, software & peripherals" },
    { value: 99, suffix: ".9%", label: "Platform Uptime", desc: "Guaranteed across enterprise tiers" },
  ];

  return (
    <section
      style={{
        background: "#0a0f1a",
        padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 100px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}/>

      {/* Accent blob */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,144,217,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(10px, 1.5vw, 12px)",
            fontWeight: 500,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#4a90d9",
            marginBottom: "16px",
          }}>Our Impact</p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-1px",
            maxWidth: "600px",
          }}>
            Numbers that define<br />
            <span style={{ color: "#4a90d9" }}>operational excellence.</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div ref={ref} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: "clamp(1px, 0.2vw, 2px)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          overflow: "hidden",
        }}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} inView={inView} delay={i * 120} />
          ))}
        </div>

        {/* Description */}
        <div style={{
          marginTop: "clamp(48px, 8vw, 80px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "clamp(32px, 5vw, 64px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "clamp(48px, 6vw, 64px)",
        }}>
          <ImpactParagraph
            inView={inView}
            title="Why asset visibility changes everything"
            text="When your organisation operates without a unified view of its hardware, software licences, and devices, inefficiency compounds silently. Shadow IT grows. Licence audits become nightmares. Critical endpoints go unpatched for months. VAULT eliminates that uncertainty — every asset, from a laptop in a remote branch to a server in your core datacentre, is tracked, versioned, and auditable in real time."
          />
          <ImpactParagraph
            inView={inView}
            title="Helpdesk as a strategic function"
            text="IT support is not a cost centre — it is the pulse of your workforce's productivity. Every unresolved ticket is lost hours. Every missed SLA is eroded trust. Our helpdesk module transforms reactive firefighting into a proactive, data-driven operation. With intelligent ticket routing, knowledge base automation, and SLA dashboards that surface risk before it becomes a breach, your team shifts from overwhelmed to in control."
            delay={200}
          />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ value, suffix, label, desc, inView, delay = 0 }) => {
  const count = useCounter(value, inView, 2000 + delay);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (inView) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }
  }, [inView, delay]);

  return (
    <div style={{
      padding: "clamp(28px, 4vw, 48px) clamp(24px, 3vw, 40px)",
      background: "#0d1422",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(36px, 5vw, 56px)",
        fontWeight: 800,
        color: "#ffffff",
        lineHeight: 1,
        letterSpacing: "-2px",
        marginBottom: "8px",
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(13px, 1.5vw, 15px)",
        fontWeight: 600,
        color: "#4a90d9",
        marginBottom: "8px",
        letterSpacing: "0.2px",
      }}>{label}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "clamp(12px, 1.2vw, 13px)",
        color: "rgba(255,255,255,0.35)",
        lineHeight: 1.5,
      }}>{desc}</div>
    </div>
  );
};

const ImpactParagraph = ({ title, text, inView, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (inView) { const t = setTimeout(() => setVisible(true), delay + 300); return () => clearTimeout(t); }
  }, [inView, delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
    }}>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(16px, 2vw, 20px)",
        fontWeight: 700,
        color: "#fff",
        marginBottom: "16px",
        lineHeight: 1.3,
      }}>{title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "clamp(14px, 1.4vw, 15px)",
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.85,
        fontWeight: 300,
      }}>{text}</p>
    </div>
  );
};


// ════════════════════════════════════════════════════════════
// 2. WHY VAULT SECTION (importance paragraphs)
// ════════════════════════════════════════════════════════════
const WhyVaultSection = () => {
  const [ref, inView] = useInView();

  const pillars = [
    {
      number: "01",
      color: "#4a90d9",
      title: "One Source of Truth",
      body: "Organisations running on spreadsheets and siloed ticketing systems are flying blind. The moment an asset changes hands, a licence expires, or a critical ticket is misrouted, the gaps compound. VAULT centralises every data point — asset lifecycle, incident history, ownership chains, and compliance status — into a single, auditable system. Your IT team stops hunting for information and starts acting on it.",
    },
    {
      number: "02",
      color: "#3dba7a",
      title: "Reduce Risk Before It Becomes Cost",
      body: "Untracked endpoints are security liabilities. Expired software licences are legal exposure. Unresolved helpdesk queues are productivity drains. Each of these is measurable, preventable risk — and each is invisible without the right platform. VAULT surfaces these risks proactively, giving leadership and IT teams the intelligence to intervene before an incident becomes a crisis or an audit becomes a fine.",
    },
    {
      number: "03",
      color: "#9b59d9",
      title: "Built for How Organisations Actually Work",
      body: "Most enterprise software is designed for how companies are supposed to work, not how they actually do. VAULT was built from real operational workflows — the helpdesk engineer who needs context before picking up a ticket, the IT manager who needs a live asset count before procurement, the compliance officer who needs a full audit trail before a review. Every feature answers a real question someone in your organisation asks today.",
    },
    {
      number: "04",
      color: "#f0a030",
      title: "Scale Without Chaos",
      body: "As your organisation grows, so does the complexity of keeping its digital infrastructure orderly. New offices, remote teams, contractor devices, cloud licences, SaaS sprawl — each addition multiplies the surface area your IT function must manage. VAULT is architected to scale horizontally, handling thousands of assets and hundreds of concurrent tickets without degrading the clarity or speed that smaller teams rely on.",
    },
  ];

  return (
    <section style={{
      background: "#ffffff",
      padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 100px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative line */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "1px",
        background: "linear-gradient(180deg, transparent, #e8edf5 20%, #e8edf5 80%, transparent)",
      }}/>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div ref={ref} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          gap: "clamp(48px, 8vw, 80px) clamp(40px, 6vw, 80px)",
        }}>
          {pillars.map((p, i) => (
            <PillarCard key={i} {...p} inView={inView} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PillarCard = ({ number, color, title, body, inView, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (inView) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }
  }, [inView, delay]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "20px" }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "2px",
          color: color,
          opacity: 0.7,
          paddingTop: "4px",
          flexShrink: 0,
        }}>{number}</span>
        <div style={{
          flex: 1, height: "1px", background: color, opacity: 0.2, marginTop: "12px",
        }}/>
      </div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(18px, 2.2vw, 24px)",
        fontWeight: 700,
        color: "#0a0f1a",
        marginBottom: "16px",
        lineHeight: 1.25,
        letterSpacing: "-0.3px",
      }}>{title}</h3>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "clamp(14px, 1.4vw, 15px)",
        color: "#5a6577",
        lineHeight: 1.85,
        fontWeight: 300,
      }}>{body}</p>
    </div>
  );
};


// ════════════════════════════════════════════════════════════
// 3. PROJECTS SECTION (completed + ongoing)
// ════════════════════════════════════════════════════════════
const ProjectsSection = () => {
  const [ref, inView] = useInView();
  const [activeTab, setActiveTab] = useState("completed");

  const completed = [
    {
      tag: "Asset Management",
      tagColor: "#4a90d9",
      title: "Enterprise-wide Hardware Rollout",
      client: "Regional Healthcare Network",
      scope: "2,400 endpoints across 18 facilities",
      result: "100% asset visibility within 6 weeks. Reduced unplanned replacements by 34%.",
      duration: "14 weeks",
      year: "2024",
    },
    {
      tag: "IT Helpdesk",
      tagColor: "#3dba7a",
      title: "Helpdesk Transformation Programme",
      client: "National Logistics Company",
      scope: "Unified ticketing across 5 regional IT teams",
      result: "Average resolution time cut from 4.2 days to 1.1 days. SLA compliance reached 97%.",
      duration: "10 weeks",
      year: "2024",
    },
    {
      tag: "Unified Platform",
      tagColor: "#9b59d9",
      title: "IT Operations Consolidation",
      client: "Mid-size Financial Services Firm",
      scope: "Replaced 4 legacy tools with VAULT",
      result: "60% reduction in IT admin overhead. Single pane of glass for 1,800 assets and 3 helpdesk teams.",
      duration: "20 weeks",
      year: "2023",
    },
    {
      tag: "Asset Management",
      tagColor: "#4a90d9",
      title: "Software Licence Audit & Optimisation",
      client: "University IT Department",
      scope: "Audit of 380 software titles across 6,000 seats",
      result: "Identified £210,000 in unused licences. Achieved full compliance before annual external audit.",
      duration: "8 weeks",
      year: "2023",
    },
  ];

  const ongoing = [
    {
      tag: "Helpdesk + Assets",
      tagColor: "#f0a030",
      title: "Hybrid Workforce IT Infrastructure",
      client: "Global Consulting Firm",
      scope: "3,200 remote & in-office employees across 9 countries",
      status: "Phase 2 of 3 — Helpdesk rollout in progress",
      progress: 66,
      startYear: "2024",
    },
    {
      tag: "Asset Management",
      tagColor: "#4a90d9",
      title: "IoT & OT Asset Integration",
      client: "Manufacturing Group",
      scope: "Integrating VAULT with existing OT systems and 800 connected devices",
      status: "Phase 1 complete — API integration underway",
      progress: 38,
      startYear: "2025",
    },
    {
      tag: "IT Helpdesk",
      tagColor: "#3dba7a",
      title: "AI-Assisted Ticket Triage Pilot",
      client: "Public Sector Department",
      scope: "Piloting intelligent routing for 1,200 monthly tickets",
      status: "Pilot active — accuracy benchmarking in progress",
      progress: 52,
      startYear: "2025",
    },
  ];

  return (
    <section style={{
      background: "#f5f7fb",
      padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 100px)",
      position: "relative",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "24px",
          marginBottom: "clamp(40px, 6vw, 64px)",
        }}>
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(10px, 1.5vw, 12px)",
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#4a90d9",
              marginBottom: "12px",
            }}>Project Portfolio</p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(28px, 4.5vw, 56px)",
              fontWeight: 800,
              color: "#0a0f1a",
              lineHeight: 1.05,
              letterSpacing: "-1px",
            }}>
              Work that speaks<br />
              <span style={{ color: "#4a90d9" }}>for itself.</span>
            </h2>
          </div>

          {/* Tab Toggle */}
          <div style={{
            display: "flex",
            background: "#e8edf5",
            borderRadius: "10px",
            padding: "4px",
            gap: "2px",
          }}>
            {["completed", "ongoing"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "8px 20px",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: activeTab === tab ? "#ffffff" : "transparent",
                  color: activeTab === tab ? "#0a0f1a" : "#8a96a8",
                  boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  letterSpacing: "0.2px",
                }}
              >
                {tab === "completed" ? `Completed (${completed.length})` : `Ongoing (${ongoing.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Completed Projects */}
        <div ref={ref} style={{ display: activeTab === "completed" ? "block" : "none" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "clamp(16px, 2vw, 24px)",
          }}>
            {completed.map((p, i) => (
              <CompletedCard key={i} {...p} inView={inView} delay={i * 80} />
            ))}
          </div>
        </div>

        {/* Ongoing Projects */}
        <div style={{ display: activeTab === "ongoing" ? "block" : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2vw, 20px)" }}>
            {ongoing.map((p, i) => (
              <OngoingCard key={i} {...p} inView={inView || activeTab === "ongoing"} delay={i * 100} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const CompletedCard = ({ tag, tagColor, title, client, scope, result, duration, year, inView, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (inView) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }
  }, [inView, delay]);

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "14px",
      padding: "clamp(24px, 3vw, 36px)",
      border: "1px solid rgba(0,0,0,0.06)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease",
      cursor: "default",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px", fontWeight: 500,
          letterSpacing: "1.5px", textTransform: "uppercase",
          color: tagColor,
          background: `${tagColor}15`,
          padding: "4px 12px", borderRadius: "20px",
        }}>{tag}</span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px", color: "#aab0bc", fontWeight: 300,
        }}>{year} · {duration}</span>
      </div>

      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(16px, 2vw, 20px)",
        fontWeight: 700, color: "#0a0f1a",
        marginBottom: "8px", lineHeight: 1.2,
      }}>{title}</h3>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px", color: "#8a96a8",
        marginBottom: "20px", fontWeight: 400,
      }}>{client} — {scope}</p>

      <div style={{
        borderTop: "1px solid #f0f2f7",
        paddingTop: "20px",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px, 1.3vw, 14px)",
          color: "#3d4a5c",
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          <span style={{ color: "#0a0f1a", fontWeight: 500 }}>Outcome: </span>
          {result}
        </p>
      </div>

      {/* Completed badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        marginTop: "20px",
        background: "#edfaf3", borderRadius: "6px",
        padding: "6px 12px",
      }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3dba7a" }}/>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#1d9a5a", letterSpacing: "0.5px" }}>
          Delivered
        </span>
      </div>
    </div>
  );
};

const OngoingCard = ({ tag, tagColor, title, client, scope, status, progress, startYear, inView, delay }) => {
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => { setVisible(true); setBarWidth(progress); }, delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay, progress]);

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "14px",
      padding: "clamp(24px, 3vw, 36px)",
      border: "1px solid rgba(0,0,0,0.06)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "24px",
      alignItems: "center",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px", fontWeight: 500,
            letterSpacing: "1.5px", textTransform: "uppercase",
            color: tagColor, background: `${tagColor}15`,
            padding: "4px 12px", borderRadius: "20px",
          }}>{tag}</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px", fontWeight: 500,
            color: "#f0a030", background: "#fef3e2",
            padding: "4px 12px", borderRadius: "20px",
          }}>In Progress</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#aab0bc", fontWeight: 300 }}>
            Since {startYear}
          </span>
        </div>

        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(15px, 1.8vw, 19px)",
          fontWeight: 700, color: "#0a0f1a",
          marginBottom: "6px", lineHeight: 1.2,
        }}>{title}</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13px", color: "#8a96a8",
          marginBottom: "16px", fontWeight: 400,
        }}>{client} — {scope}</p>

        {/* Progress bar */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{
            height: "5px", background: "#f0f2f7",
            borderRadius: "99px", overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, ${tagColor}88, ${tagColor})`,
              borderRadius: "99px",
              transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}/>
          </div>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px", color: "#8a96a8", fontWeight: 300,
        }}>{status}</p>
      </div>

      {/* Progress % */}
      <div style={{
        flexShrink: 0,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(28px, 3vw, 36px)",
          fontWeight: 800,
          color: tagColor,
          lineHeight: 1,
          letterSpacing: "-1px",
        }}>{progress}%</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          color: "#aab0bc",
          marginTop: "4px",
          letterSpacing: "0.5px",
        }}>complete</div>
      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════════════
// 4. SERVICES DEEP-DIVE SECTION
// ════════════════════════════════════════════════════════════
const ServicesSection = () => {
  const [ref, inView] = useInView();

  const services = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
      ),
      color: "#4a90d9",
      title: "Asset Lifecycle Management",
      headline: "From procurement to decommission.",
      body: "Track every device from the moment it is ordered to the day it is retired. VAULT maintains a full history of ownership, location, configuration, maintenance, and disposal — giving you the audit trail regulators and finance teams require without manual record-keeping.",
      features: ["Auto-discovery & onboarding", "Depreciation tracking", "Warranty & contract alerts", "Disposal & data-wipe records"],
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      color: "#3dba7a",
      title: "Intelligent IT Helpdesk",
      headline: "Support that never falls behind.",
      body: "Our helpdesk is built around the engineer's workflow, not around form-filling. Smart triage surfaces the right context — asset history, previous tickets, knowledge base articles — before the engineer takes action. SLA dashboards give managers early warning, not post-mortems.",
      features: ["Smart ticket routing", "SLA monitoring & alerts", "Integrated knowledge base", "Multi-channel intake (email, portal, Slack)"],
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      color: "#9b59d9",
      title: "Office & Facilities Management",
      headline: "The workspace, always in order.",
      body: "From room bookings to visitor logs, consumables inventory to facilities maintenance requests — VAULT brings the same rigour that IT teams apply to digital assets into the physical workplace. One system, one team, full visibility.",
      features: ["Room & desk booking", "Visitor management", "Consumables tracking", "Facilities maintenance requests"],
    },
  ];

  return (
    <section style={{
      background: "#0a0f1a",
      padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 100px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top border accent */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(74,144,217,0.3), transparent)",
      }}/>

      <div ref={ref} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(10px, 1.5vw, 12px)",
            fontWeight: 500, letterSpacing: "3px",
            textTransform: "uppercase", color: "#4a90d9",
            marginBottom: "16px",
          }}>What We Do</p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 4.5vw, 56px)",
            fontWeight: 800, color: "#ffffff",
            lineHeight: 1.05, letterSpacing: "-1px",
          }}>Three pillars.<br/>One platform.</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(16px, 2vw, 24px)",
        }}>
          {services.map((s, i) => (
            <ServiceCard key={i} {...s} inView={inView} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, color, title, headline, body, features, inView, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (inView) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }
  }, [inView, delay]);

  return (
    <div style={{
      background: "#0d1422",
      borderRadius: "16px",
      padding: "clamp(28px, 3.5vw, 44px)",
      border: "1px solid rgba(255,255,255,0.06)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: "opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}40`; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      {/* Icon */}
      <div style={{
        width: "52px", height: "52px",
        borderRadius: "12px",
        background: `${color}18`,
        color: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "24px",
      }}>{icon}</div>

      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(15px, 1.8vw, 18px)",
        fontWeight: 700, color: "#ffffff",
        marginBottom: "6px",
      }}>{title}</h3>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px", color: color,
        marginBottom: "16px", fontWeight: 500,
        letterSpacing: "0.2px",
      }}>{headline}</p>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "clamp(13px, 1.3vw, 14px)",
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.8, fontWeight: 300,
        marginBottom: "28px",
      }}>{body}</p>

      {/* Features list */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "24px" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: color, flexShrink: 0 }}/>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", color: "rgba(255,255,255,0.5)",
                fontWeight: 400,
              }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════════════
// 5. CTA SECTION
// ════════════════════════════════════════════════════════════
const CTASection = () => {
  const [ref, inView] = useInView();
  const [visible, setVisible] = useState(false);
  useEffect(() => { if (inView) setVisible(true); }, [inView]);

  return (
    <section style={{
      background: "#ffffff",
      padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 100px)",
    }}>
      <div
        ref={ref}
        style={{
          maxWidth: "900px", margin: "0 auto", textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(10px, 1.5vw, 12px)",
          fontWeight: 500, letterSpacing: "3px",
          textTransform: "uppercase", color: "#4a90d9",
          marginBottom: "20px",
        }}>Get Started</p>

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(32px, 5.5vw, 68px)",
          fontWeight: 800, color: "#0a0f1a",
          lineHeight: 1.05, letterSpacing: "-1.5px",
          marginBottom: "24px",
        }}>
          Your IT operations,<br />
          <span style={{ color: "#4a90d9" }}>finally under control.</span>
        </h2>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(15px, 1.6vw, 17px)",
          color: "#5a6577", lineHeight: 1.8, fontWeight: 300,
          maxWidth: "560px", margin: "0 auto 40px",
        }}>
          Join the organisations that have replaced spreadsheets, siloed tools, and reactive firefighting with a unified, intelligent platform built for modern IT operations.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px", fontWeight: 500,
            padding: "14px 32px", borderRadius: "8px",
            border: "none", cursor: "pointer",
            background: "#0a0f1a", color: "#ffffff",
            letterSpacing: "0.3px",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#4a90d9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0a0f1a"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Request a Demo
          </button>
          <button style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px", fontWeight: 500,
            padding: "14px 32px", borderRadius: "8px",
            border: "1px solid rgba(0,0,0,0.12)", cursor: "pointer",
            background: "transparent", color: "#0a0f1a",
            letterSpacing: "0.3px",
            transition: "border-color 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4a90d9"; e.currentTarget.style.color = "#4a90d9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#0a0f1a"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            View Documentation
          </button>
        </div>
      </div>
    </section>
  );
};


// ════════════════════════════════════════════════════════════
// ROOT EXPORT — drop this into your page after <HeroSection />
// ════════════════════════════════════════════════════════════
const HomePageSections = () => (
  <>
    <HeroSection />
    <ImpactSection />
    <WhyVaultSection />
    <ProjectsSection />
    <ServicesSection />
    <CTASection />
  </>
);

// export default HeroSection;
export default HomePageSections;

// Named exports if you want sections individually:
export {HeroSection, ImpactSection, WhyVaultSection, ProjectsSection, ServicesSection, CTASection };
