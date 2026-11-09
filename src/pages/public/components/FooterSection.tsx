import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../common/Logo';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" theme="dark" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mt-3">
              CivicConnect AI is an enterprise-grade smart-city grievance management platform.
              We empower citizens, municipal engineers, and public administrators to report,
              triage, and resolve urban grievances with complete transparency.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-teal-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Certified Municipal Open Data Protocol Compliant</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Issue Categories
                </a>
              </li>
              <li>
                <a href="#explore" className="hover:text-white transition-colors">
                  Live Issue Explorer
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-white transition-colors">
                  Transparency Ledger
                </a>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">
                  Submit Grievance
                </Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Access Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/citizen" className="hover:text-white transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  City Administrator Suite
                </Link>
              </li>
              <li>
                <Link to="/admin/queue" className="hover:text-white transition-colors">
                  Field Staff Queue
                </Link>
              </li>
              <li>
                <Link to="/admin/triage" className="hover:text-white transition-colors">
                  AI Triage Workbench
                </Link>
              </li>
              <li>
                <Link to="/admin/analytics" className="hover:text-white transition-colors">
                  Municipal Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Municipal Desk
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>100 Civic Center Plaza</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>helpdesk@civicconnect.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>+1 (800) 555-CIVIC</span>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-3 text-xs">
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CivicConnect AI Platform. Demonstration Architecture. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded">
              v1.0.0 Frontend Prototype (FastAPI-Ready)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
