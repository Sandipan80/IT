import React from "react";
import { Button, Input, Space } from "antd";
// import { Linkedin, Twitter, Github } from "lucide-react";
// import { Linkedin, Twitter,  } from "lucide-react"; // Optional: Better icons
import logo from "../../../src/assets/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#0a0c10] text-white pt-20 pb-10 px-6 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand & Social Section */}
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Vault Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white uppercase">Vault</span>
          </div>
          <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
            The unified platform for modern IT operations, asset management, and
            facility workflows. Securely managing the lifecycle of your digital and physical assets.
          </p>
          {/* <div className="flex gap-4"> */}
            {/* Social Icons - Using subtle hover effects */}
            {/* <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"> */}
              {/* <Linkedin size={18} /> */}
            {/* </a> */}
            {/* <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all cursor-pointer"> */}
              {/* <Twitter size={18} /> */}
            {/* </a> */}
            {/* <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all cursor-pointer"> */}
              {/* <Github size={18} /> */}
            {/* </a> */}
          {/* </div> */}
        </div>

        {/* Resources Navigation */}
        <div>
          <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">Resources</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Case Studies</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Documentation</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">SLA Agreements</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Whitepapers</li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm">Newsletter</h4>
          <p className="text-slate-400 text-xs mb-4">
            Get updates on new features and industry news directly in your inbox.
          </p>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Email address"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 hover:border-blue-500 focus:bg-white/10"
              style={{ borderRight: 'none' }}
            />
            <Button
              type="primary"
              className="bg-blue-600 border-none h-auto px-6 font-semibold"
            >
              Sign Up
            </Button>
          </Space.Compact>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Vault IT Operations. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0 uppercase tracking-widest font-bold">
          <span className="hover:text-white cursor-pointer transition-colors">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;