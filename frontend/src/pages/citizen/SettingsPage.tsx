import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Sun, Moon, RefreshCw } from 'lucide-react';
import mockStorage from '../../services/mock/mockStorage';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [triageAlerts, setTriageAlerts] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleResetDemo = () => {
    mockStorage.resetDemoData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
          Preferences
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">Settings</h1>
        <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
          Configure appearance, alert frequencies, and language preferences.
        </p>
      </div>

      {/* Theme Preference */}
      <Card>
        <CardHeader
          title="Appearance & Theme"
          subtitle="Choose between light editorial mode and dark interface"
        />
        <CardContent>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'border-[#183B3A] bg-[#183B3A]/5 dark:border-white dark:bg-white/10 ring-1 ring-[#183B3A] dark:ring-white'
                  : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29]'
              }`}
            >
              <div className="w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#202B2A] dark:text-white">Light Mode</h4>
                <p className="text-[11px] text-[#66736F] dark:text-slate-400">Warm white civic design</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'border-[#183B3A] bg-[#183B3A]/5 dark:border-white dark:bg-white/10 ring-1 ring-[#183B3A] dark:ring-white'
                  : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29]'
              }`}
            >
              <div className="w-8 h-8 rounded-md bg-[#131E30] border border-[#22344D] flex items-center justify-center text-slate-200">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#202B2A] dark:text-white">Dark Mode</h4>
                <p className="text-[11px] text-[#66736F] dark:text-slate-400">Low-glare night interface</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader
          title="Notification Dispatch"
          subtitle="Manage alerts for your submitted grievances"
        />
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-[#202B2A] dark:text-white block">
                Email Dispatch Notifications
              </span>
              <span className="text-[11px] text-[#66736F] dark:text-slate-400">
                Receive notification whenever a municipal crew is routed to your report
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-[#E5E8E4] text-[#183B3A] focus:ring-[#183B3A]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[#E5E8E4] dark:border-[#22344D]">
            <div>
              <span className="text-xs font-semibold text-[#202B2A] dark:text-white block">
                Triage Classification Alerts
              </span>
              <span className="text-[11px] text-[#66736F] dark:text-slate-400">
                Receive instant priority score report upon initial case review
              </span>
            </div>
            <input
              type="checkbox"
              checked={triageAlerts}
              onChange={(e) => setTriageAlerts(e.target.checked)}
              className="rounded border-[#E5E8E4] text-[#183B3A] focus:ring-[#183B3A]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[#E5E8E4] dark:border-[#22344D]">
            <div>
              <span className="text-xs font-semibold text-[#202B2A] dark:text-white block">
                Emergency SMS Broadcasts
              </span>
              <span className="text-[11px] text-[#66736F] dark:text-slate-400">
                Critical public hazards (gas leaks, main breaks) for your registered district
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="rounded border-[#E5E8E4] text-[#183B3A] focus:ring-[#183B3A]"
            />
          </label>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader title="Language & Regional Settings" />
        <CardContent>
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1.5">
              Portal Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Demo Prototype Maintenance */}
      <Card>
        <CardHeader
          title="Demonstration Controls"
          subtitle="Reset state back to the original seed data"
        />
        <CardContent>
          <p className="text-xs text-[#66736F] dark:text-slate-400 mb-4 leading-relaxed">
            If you have tested status updates, submitted new complaints, or modified priorities, you can reset all mock browser storage back to the initial sample seed records.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDemo}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset Demonstration Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
