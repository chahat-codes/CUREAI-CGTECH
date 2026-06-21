import Link from "next/link";
import { Activity, Globe, MessageCircle, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Doctor Discovery", href: "/features" },
      { name: "Smart Appointments", href: "/features" },
      { name: "Digital Vault", href: "/for-patients" },
      { name: "AI Assistant", href: "/features" },
      { name: "For Clinics", href: "/for-clinics" },
    ],
    Features: [
      { name: "Symptom Checker", href: "/features" },
      { name: "Health Records", href: "/for-patients" },
      { name: "Video Consultation", href: "/for-clinics" },
      { name: "Prescription Delivery", href: "/features" },
      { name: "Lab Tests", href: "/features" },
    ],
    Company: [
      { name: "About Us", href: "/#how-it-works" },
      { name: "Careers", href: "/#contact" },
      { name: "Press", href: "/#contact" },
      { name: "Blog", href: "/features" },
      { name: "Partners", href: "/for-clinics" },
    ],
    Contact: [
      { name: "Help Center", href: "/#contact" },
      { name: "Support", href: "/#contact" },
      { name: "Contact Us", href: "/#contact" },
      { name: "Privacy Policy", href: "/#contact" },
      { name: "Terms of Service", href: "/#contact" },
    ]
  };

  return (
    <footer id="contact" className="bg-[#0F172A] border-t border-slate-800 pt-20 pb-10 text-slate-400 font-sans scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-[#0A66FF] p-1.5 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-outfit font-bold text-xl text-white tracking-tight">
                Cure<span className="text-[#0A66FF]">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs text-slate-400">
              Making healthcare smarter, faster, and more accessible through intelligent symptom understanding and instant specialist matching.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/#contact" className="text-slate-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="/#contact" className="text-slate-400 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></Link>
              <Link href="mailto:support@cureai.health" className="text-slate-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></Link>
              <Link href="tel:+10000000000" className="text-slate-400 hover:text-white transition-colors"><Phone className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-white font-semibold mb-5">{category}</h4>
              <ul className="space-y-3 text-sm">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#0A66FF] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© {currentYear} Cure AI Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/#contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/#contact" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/#contact" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
