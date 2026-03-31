import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VaultBack from "../../src/assets/vault_categories_white_bg.svg";

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
          end: "+=200%",
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


export default HeroSection;