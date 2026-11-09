import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Sun, Moon, Bell, Globe, Shield, RefreshCw } from 'lucide-react';
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize display themes, alert frequencies, and language preferences.
        </p>
      </div>

      {/* Theme Preference */}
      <Card>
        <CardHeader
          title="Appearance & Theme"
          subtitle="Choose between light mode and dark mode"
        />
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'border-civic bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-civic'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</h4>
                <p className="text-[11px] text-slate-500">High contrast daylight theme</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'border-civic bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-civic'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                <p className="text-[11px] text-slate-500">Low-glare night interface</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader
          title="Notification Dispatch"
          subtitle="Manage automatic updates on your submitted grievances"
        />
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Email Dispatch Notifications
              </span>
              <span className="text-[11px] text-slate-500">
                Receive notification whenever a municipal crew is routed to your report
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 text-civic focus:ring-civic"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                AI Triage Classification Alerts
              </span>
              <span className="text-[11px] text-slate-500">
                Receive instant priority score report within 5 minutes of filing
              </span>
            </div>
            <input
              type="checkbox"
              checked={triageAlerts}
              onChange={(e) => setTriageAlerts(e.target.checked)}
              className="rounded border-slate-300 text-civic focus:ring-civic"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Emergency SMS Broadcasts
              </span>
              <span className="text-[11px] text-slate-500">
                Critical water main and power outage alerts for your registered district
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="rounded border-slate-300 text-civic focus:ring-civic"
            />
          </label>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader title="Language & Regional Settings" />
        <CardContent>
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Portal Interface Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-xs text-slate-900 dark:text-white px-3 py-2"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Demo Prototype Maintenance */}
      <Card className="border-amber-200/80 dark:border-amber-900/40">
        <CardHeader
          title="Portfolio Demonstration Controls"
          subtitle="Reset state back to the original seed data"
        />
        <CardContent>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            If you have tested various status updates, filed new test complaints, or modified priorities, you can reset all demonstration storage back to the initial sample records.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDemo}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset All Prototype Demo State
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
