import React from "react";
import logo from '../../assets/Logo.png'

const Footer = () => {
  return (
 <footer className="footer footer-horizontal footer-center bg-slate-950 text-slate-200 p-10 border-t border-slate-800">
  <aside>
    {/* Your Vault Logo */}
   <img 
  src={logo} 
  alt="Vault Logo" 
  className="w-12 h-12 mb-2"
/>
    <p className="font-bold text-xl tracking-tight text-white">
      VAULT
      <br />
      <span className="text-sm font-normal text-slate-400">Secure Asset Allocation & IT Helpdesk</span>
    </p>
    <p className="text-slate-500">Copyright © {new Date().getFullYear()} - All rights reserved</p>
  </aside>
 
</footer>
  );
};

export default Footer;
