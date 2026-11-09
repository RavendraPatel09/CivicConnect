import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import RoleSwitcher from '../ui/RoleSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  LayoutDashboard,
  ClipboardList,
  Cpu,
  Users,
  Map,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
} from 'lucide-react';

export const AdminDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Overview', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { name: 'Complaint Queue', to: '/admin/queue', icon: <ClipboardList className="w-4 h-4" /> },
    { name: 'AI Triage', to: '/admin/triage', icon: <Cpu className="w-4 h-4 text-teal" />, highlight: true },
    { name: 'Staff Management', to: '/admin/staff', icon: <Users className="w-4 h-4" /> },
    { name: 'Map View', to: '/admin/map', icon: <Map className="w-4 h-4" /> },
    { name: 'Analytics', to: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Audit Logs', to: '/admin/audit-logs', icon: <ScrollText className="w-4 h-4" /> },
    { name: 'Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0B1320] flex">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F1E31] text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo size="md" theme="dark" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Municipal Operations
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-civic text-white font-bold shadow-xs'
                      : item.highlight
                      ? 'text-teal hover:bg-slate-800/80'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Admin Persona */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 bg-slate-800/50 rounded-xl">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-teal-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>{user?.role === 'admin' ? 'City Administrator' : 'Municipal Staff'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-[#131E30] border-b border-slate-200/90 dark:border-[#22344D] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Municipal Operations Center
              </span>
              <span className="hidden sm:inline-block text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                Metro City Jurisdiction
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <ThemeToggle />
            <Link
              to="/citizen/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </Link>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
