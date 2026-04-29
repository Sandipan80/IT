import React, { Suspense, lazy } from "react";
import { Button, Card, Tag, Carousel, Input, Space } from "antd";
import { motion } from "framer-motion";
import {
  Laptop,
  MessageSquare,
  Building2,
  ShieldCheck,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";
import { TextHoverEffect } from "../components/UI/text-hover-effect";
// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.2 } },
};
const LazyTextFlippingBoard = lazy(
  () => import("../../src/components/UI/UI_Page/text-flipping-board-demo"),
);

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. HERO SECTION: Big Animated Vault Text */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f8fafc]">
        <div className="h-screen w-full flex items-center justify-center p-10 ">
          <TextHoverEffect text="VAULT" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-100/50 rounded-full blur-[120px] -z-10" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg md:text-xl text-slate-500 font-medium tracking-wide mt-4"
        >
          Secure. Unified. <span className="text-blue-600">Intelligent.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center"
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-blue-500 rounded-full"
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] mt-4 text-slate-400 font-bold">
            Scroll to Explore
          </p>
        </motion.div>
      </section>

      {/* 2. INDUSTRY IMPACT */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Driving Industry Innovation
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Synthesized results from global IT asset management and helpdesk
            platform case studies.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <ImpactCard
            tag="FINANCIAL SERVICES"
            title="99.9% Audit Compliance"
            desc="Ensuring near-perfect compliance with a 100% auditable lifecycle for a major bank."
            icon={<ShieldCheck className="text-blue-500" size={32} />}
          />
          <ImpactCard
            tag="HEALTHCARE"
            title="$5M+ Annual Savings"
            desc="Recovered costs through efficient device retrieval and license re-harvesting."
            icon={<TrendingUp className="text-green-500" size={32} />}
          />
          <ImpactCard
            tag="TECH ENTERPRISE"
            title="40% Faster Resolution"
            desc="Reduced average ticket-to-resolve time for 10k employees using predictive triage."
            icon={<Zap className="text-purple-500" size={32} />}
          />
        </motion.div>
      </section>

      {/* 3. WHAT WE DO */}
      <section className="bg-[#0a0c10] py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 font-bold tracking-[0.3em] uppercase text-sm mb-4">
              What We Do
            </p>
            <h2 className="text-5xl font-black mb-12">
              Three pillars. <br />
              One platform.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Laptop size={24} className="text-blue-400" />}
              title="Asset Lifecycle Management"
              subtitle="From procurement to decommission."
              content="Track every device from the moment it is ordered to the day it is retired. VAULT maintains a full history."
              list={["Auto-discovery & onboarding", "Smart asset tracking"]}
              color="blue"
            />
            <FeatureCard
              icon={<MessageSquare size={24} className="text-green-400" />}
              title="Intelligent IT Helpdesk"
              subtitle="Support that never falls behind."
              content="Our helpdesk is built around the engineer's workflow, not around form-filling."
              list={["Smart ticket routing", "Knowledge base integration"]}
              color="green"
            />
            <FeatureCard
              icon={<Building2 size={24} className="text-purple-400" />}
              title="Office & Facilities Management"
              subtitle="The workspace, always in order."
              content="From room bookings to visitor logs, VAULT brings the same rigour to the physical workplace."
              list={["Room & desk booking", "Visitor management"]}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* 4. PROJECTS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2">
                Project Portfolio
              </p>
              <h2 className="text-6xl font-black leading-tight">
                Work that speaks <br />
                <span className="text-blue-500 font-serif italic">
                  for itself.
                </span>
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ProjectCard
              category="ASSET MANAGEMENT"
              time="2024 · 14 weeks"
              title="Enterprise-wide Hardware Rollout"
              client="Regional Healthcare Network — 2,400 endpoints"
              outcome="100% asset visibility within 6 weeks."
            />
            <ProjectCard
              category="IT HELPDESK"
              time="2024 · 10 weeks"
              title="Helpdesk Transformation Programme"
              client="National Logistics Company — Unified ticketing"
              outcome="Average resolution time cut from 4.2 days to 1.1 days."
            />
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-12">
            Trusted by Industry Leaders
          </h2>
          <Carousel autoplay dots={{ className: "custom-dots" }}>
            <Testimonial
              quote="Vault transformed how we manage our entire IT infrastructure."
              author="Sarah Chen"
              role="CIO, Apex Financial Corp"
            />
            <Testimonial
              quote="The intelligent helpdesk is a game-changer."
              author="Marcus Rodriguez"
              role="Head of IT, LogiTech Solutions"
            />
          </Carousel>
        </div>
      </section>
    </div>
  );
};

// --- Sub-Components ---
const ImpactCard = ({ tag, title, desc, icon }) => (
  <motion.div variants={fadeInUp}>
    <Card className="h-full border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-shadow duration-300">
      <div className="mb-6 p-3 bg-slate-50 w-fit rounded-2xl">{icon}</div>
      <Tag
        color="blue"
        className="mb-4 border-none font-bold px-3 py-0.5 rounded-full"
      >
        {tag}
      </Tag>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </Card>
  </motion.div>
);

const FeatureCard = ({ icon, title, subtitle, content, list, color }) => {
  const accentClass =
    color === "blue"
      ? "text-blue-400"
      : color === "green"
        ? "text-green-400"
        : "text-purple-400";
  return (
    <div className="bg-[#14181f] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="mb-8 p-4 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-1">{title}</h3>
      <p className={`text-sm mb-6 font-medium ${accentClass}`}>{subtitle}</p>
      <p className="text-slate-400 text-sm leading-relaxed mb-8">{content}</p>
      <ul className="space-y-3">
        {list.map((item, i) => (
          <li key={i} className="flex items-center text-xs text-slate-300">
            <span
              className={`w-1.5 h-1.5 rounded-full mr-3 ${color === "blue" ? "bg-blue-500" : color === "green" ? "bg-green-500" : "bg-purple-500"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProjectCard = ({ category, time, title, client, outcome }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full"
  >
    <div className="flex justify-between items-start mb-6">
      <Tag className="bg-blue-50 text-blue-600 border-none px-4 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase">
        {category}
      </Tag>
      <span className="text-slate-400 text-xs font-medium">{time}</span>
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 text-sm mb-8">{client}</p>
    <div className="mt-auto pt-8 border-t border-slate-50">
      <p className="text-slate-700 font-medium">
        <span className="font-bold text-slate-900">Outcome:</span> {outcome}
      </p>
      <div className="mt-6">
        <Tag
          color="success"
          className="rounded-full border-none px-4 py-0.5 font-bold text-[10px]"
        >
          ● DELIVERED
        </Tag>
      </div>
    </div>
  </motion.div>
);

const Testimonial = ({ quote, author, role }) => (
  <div className="py-8">
    <p className="text-2xl font-medium text-slate-700 mb-8 italic">"{quote}"</p>
    <div className="flex items-center justify-center gap-4">
      <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
        {/* <img src={`https://i.pravatar.cc/150?u=${author}`} alt={author} /> */}
      </div>
      <div className="text-left">
        <p className="font-bold text-slate-900">{author}</p>
        <p className="text-slate-500 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

export default Homepage;
