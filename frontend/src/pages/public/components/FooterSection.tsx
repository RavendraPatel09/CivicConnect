import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../components/common/Logo';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-[#122C2B] text-slate-300 border-t border-[#183B3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" theme="dark" showTagline={true} />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mt-3">
              CivicConnect is a smart-city civic grievance management platform. We connect residents, municipal engineers, and public administrators to report, inspect, and resolve urban problems with transparent public oversight.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#96BCB9]">
              <ShieldCheck className="w-4 h-4 text-[#3B8278]" />
              <span>Municipal Open Data & Transparency Compliant</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Public Services
                </a>
              </li>
              <li>
                <a href="#explore" className="hover:text-white transition-colors">
                  Live Issue Explorer
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-white transition-colors">
                  Resolution Lifecycle
                </a>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Submit a Grievance
                </Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Access Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/citizen" className="hover:text-white transition-colors">
                  Resident Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Administrator Suite
                </Link>
              </li>
              <li>
                <Link to="/admin/queue" className="hover:text-white transition-colors">
                  Field Staff Queue
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className="hover:text-white transition-colors">
                  Municipal Analytics
                </Link>
              </li>
              <li>
                <Link to="/admin/audit-logs" className="hover:text-white transition-colors">
                  Audit Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Desk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Public Service Desk
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#3B8278]" />
                <span>City Hall, Municipal District 1</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#3B8278]" />
                <span>support@civicconnect.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#3B8278]" />
                <span>311 (Non-Emergency Services)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} CivicConnect AI Platform. Developed for municipal public service.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Notice</span>
            <span className="hover:text-white transition-colors cursor-pointer">Accessibility Statement</span>
            <span className="hover:text-white transition-colors cursor-pointer">Open Government Directive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
