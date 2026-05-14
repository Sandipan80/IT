import React, { useState } from "react";
import logo from "../../../src/assets/Logo.png";

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerSections = [
    {
      heading: "Asset Software",
      links: [
        { label: "Dashboard", href: "/Dashboard" },
        { label: "Profile", href: "/Profile/:id" },
        { label: "Asset Registry", href: "/AssetInventory" },
        { label: "Available Assets", href: "/AvailableAssets" },
        { label: "Asset Requests", href: "/AssetRequestPanel" },
      ],
    },
    {
      heading: "Web Services",
      links: [
        { label: "API Integration", href: "/Product/A" },
        { label: "Cloud Sync", href: "/Product/A" },
        { label: "Data Migration", href: "/Product/A" },
        { label: "Web Portal", href: "/Product/A" },
        { label: "Webhooks", href: "/Product/A" },
      ],
    },
    {
      heading: "Mobile Services",
      links: [
        { label: "iOS App", href: "/Product/B" },
        { label: "Android App", href: "/Product/B" },
        { label: "Mobile Dashboard", href: "/Product/B" },
        { label: "Push Notifications", href: "/Product/B" },
        { label: "Mobile Support", href: "/Product/B" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Vault", href: "/About" },
        { label: "Careers", href: "#careers" },
        { label: "Contact Us", href: "/ContactUs" },
      ],
    },
  ];

  const socials = [
    {
      label: "Twitter",
      href: "#twitter",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "#linkedin",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: "#github",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

        .vault-footer {
          background: #0a0f1e;
          color: #c8cdd8;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .vault-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3b82f6 30%, #60a5fa 60%, transparent);
        }

        .vault-footer::after {
          content: '';
          position: absolute;
          top: -160px; right: -160px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .footer-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .footer-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 32px 0;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr repeat(4, 1fr);
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        @media (max-width: 1024px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .footer-top {
            grid-template-columns: 1fr;
          }
          .footer-brand {
            grid-column: auto;
          }
          .footer-inner {
            padding: 48px 20px 0;
          }
        }

        /* Brand Column */
        .footer-brand {}

        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          text-decoration: none;
        }

        .brand-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
          filter: brightness(1.1);
        }

        .brand-logo-fallback {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f1f5ff;
          letter-spacing: -0.5px;
        }

        .brand-tagline {
          font-size: 13.5px;
          line-height: 1.7;
          color: #7a8299;
          margin-bottom: 28px;
          max-width: 260px;
        }

        /* Newsletter */
        .newsletter-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 10px;
        }

        .newsletter-form {
          display: flex;
          gap: 0;
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .newsletter-form:focus-within {
          border-color: #3b82f6;
        }

        .newsletter-input {
          flex: 1;
          background: rgba(59,130,246,0.06);
          border: none;
          outline: none;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #e2e8f0;
          min-width: 0;
        }

        .newsletter-input::placeholder { color: #4a5268; }

        .newsletter-btn {
          background: #3b82f6;
          border: none;
          padding: 10px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .newsletter-btn:hover { background: #2563eb; }

        .subscribe-success {
          font-size: 13px;
          color: #34d399;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Link Columns */
        .footer-col-heading {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #f1f5ff;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 12px;
        }

        .footer-col-heading::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 24px; height: 2px;
          background: #3b82f6;
          border-radius: 2px;
        }

        .footer-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-link {
          font-size: 13.5px;
          color: #7a8299;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.18s, transform 0.18s;
          width: fit-content;
        }

        .footer-link:hover {
          color: #e2e8f0;
          transform: translateX(4px);
        }

        .footer-link-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #3b82f6;
          opacity: 0;
          transition: opacity 0.18s;
          flex-shrink: 0;
        }

        .footer-link:hover .footer-link-dot {
          opacity: 1;
        }

        /* Bottom Bar */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 28px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .footer-legal {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .footer-copy {
          font-size: 13px;
          color: #4a5268;
        }

        .footer-legal-links {
          display: flex;
          gap: 20px;
        }

        .footer-legal-link {
          font-size: 12.5px;
          color: #4a5268;
          text-decoration: none;
          transition: color 0.18s;
        }

        .footer-legal-link:hover { color: #94a3b8; }

        .footer-divider {
          color: #232840;
          font-size: 16px;
        }

        /* Socials */
        .footer-socials {
          display: flex;
          gap: 10px;
        }

        .social-btn {
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: #566075;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s;
        }

        .social-btn:hover {
          background: rgba(59,130,246,0.12);
          border-color: rgba(59,130,246,0.35);
          color: #60a5fa;
          transform: translateY(-2px);
        }

        /* Status badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(52, 211, 153, 0.08);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11.5px;
          color: #34d399;
          font-weight: 500;
        }

        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34d399;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>

      <footer className="vault-footer">
        <div className="footer-grid-bg" />

        <div className="footer-inner">
          <div className="footer-top">
            {/* Brand Column */}
            <div className="footer-brand">
              <a href="#home" className="brand-logo-wrap">
                <img
                  src={logo}
                  alt="Vault Logo"
                  className="brand-logo-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <span
                  className="brand-logo-fallback"
                  style={{ display: "none" }}
                >
                  V
                </span>
                <span className="brand-name">Vault</span>
              </a>
              <p className="brand-tagline">
                Intelligent asset management for modern enterprises. Track,
                analyze, and optimize your entire asset portfolio in one place.
              </p>
              <div className="status-badge">
                <span className="status-dot" />
                All systems operational
              </div>

              <div style={{ marginTop: 28 }}>
                <p className="newsletter-label">Stay updated</p>
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe
                  </button>
                </form>
                {subscribed && (
                  <p className="subscribe-success">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="14"
                      height="14"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                    You're subscribed!
                  </p>
                )}
              </div>
            </div>

            {/* Link Columns */}
            {footerSections.map((section) => (
              <div key={section.heading}>
                <h4 className="footer-col-heading">{section.heading}</h4>
                <ul className="footer-links">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="footer-link"
                        onMouseEnter={() => setHoveredLink(link.label)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <span className="footer-link-dot" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div className="footer-legal">
              <span className="footer-copy">
                © {new Date().getFullYear()} Vault Inc.
              </span>
              <span className="footer-divider">·</span>
              <div className="footer-legal-links">
                <a href="#privacy" className="footer-legal-link">
                  Privacy Policy
                </a>
                <a href="#terms" className="footer-legal-link">
                  Terms of Service
                </a>
                <a href="#security" className="footer-legal-link">
                  Security
                </a>
              </div>
            </div>

            <div className="footer-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="social-btn"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
