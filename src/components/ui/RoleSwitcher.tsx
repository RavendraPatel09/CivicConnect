import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { UserCheck, Shield, HardHat, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import mockStorage from '../../services/mock/mockStorage';

export const RoleSwitcher: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'citizen',
      label: 'Citizen Mode',
      icon: <UserCheck className="w-4 h-4 text-emerald-500" />,
      desc: 'Elena Rostova (Report issues, track progress)',
    },
    {
      role: 'staff',
      label: 'Municipal Staff',
      icon: <HardHat className="w-4 h-4 text-amber-500" />,
      desc: 'Marcus Vance (Field updates & work orders)',
    },
    {
      role: 'admin',
      label: 'City Administrator',
      icon: <Shield className="w-4 h-4 text-blue-500" />,
      desc: 'Sarah Chen (Triage queue, triage overrides, analytics)',
    },
  ];

  const handleSelectRole = (r: UserRole) => {
    switchRole(r);
    setIsOpen(false);
  };

  const handleResetData = () => {
    setIsResetting(true);
    mockStorage.resetDemoData();
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors shadow-2xs"
        title="Switch between Citizen, Staff, and Admin test personas"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-civic" />
          <span className="font-semibold capitalize text-slate-800 dark:text-slate-100">
            {role || 'Persona'}:
          </span>
          <span className="truncate max-w-[100px] text-slate-600 dark:text-slate-300">
            {user?.name.split(' ')[0] || 'Demo'}
          </span>
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#131E30] border border-slate-200 dark:border-[#22344D] shadow-xl z-50 p-2 divide-y divide-slate-100 dark:divide-[#22344D]">
            <div className="px-3 py-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Portfolio Persona Switcher
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Switch roles instantly to inspect role-tailored dashboards and permission boundaries.
              </p>
            </div>

            <div className="py-1">
              {roles.map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleSelectRole(item.role)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    role === item.role
                      ? 'bg-civic/10 text-civic font-semibold dark:bg-civic/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {role === item.role && (
                    <span className="w-2 h-2 rounded-full bg-civic" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 px-1">
              <button
                type="button"
                onClick={handleResetData}
                disabled={isResetting}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                Reset Sample Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSwitcher;
