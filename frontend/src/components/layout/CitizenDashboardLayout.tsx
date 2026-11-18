import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import RoleSwitcher from '../ui/RoleSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MapPin,
  Map,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ExternalLink,
} from 'lucide-react';

export const CitizenDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Overview', to: '/citizen', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { name: 'My Complaints', to: '/citizen/complaints', icon: <FileText className="w-4 h-4" /> },
    { name: 'Report an Issue', to: '/report', icon: <PlusCircle className="w-4 h-4 text-civic" />, highlight: true },
    { name: 'Nearby Issues', to: '/citizen/nearby', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Explore Map', to: '/citizen/map', icon: <Map className="w-4 h-4" /> },
    {
      name: 'Notifications',
      to: '/citizen/notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { name: 'Profile', to: '/citizen/profile', icon: <User className="w-4 h-4" /> },
    { name: 'Settings', to: '/citizen/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] flex text-[#202B2A] dark:text-[#F1F5F9]">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#131E30] border-r border-[#E5E8E4] dark:border-[#22344D] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 border-b border-[#E5E8E4] dark:border-[#22344D] flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#66736F] hover:text-[#202B2A] dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400">
              Citizen Portal
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#183B3A]/10 text-[#183B3A] dark:bg-white/10 dark:text-white font-semibold'
                      : item.highlight
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/40'
                      : 'text-[#66736F] dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#202B2A] dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Info & Exit */}
        <div className="p-4 border-t border-[#E5E8E4] dark:border-[#22344D]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border border-[#E5E8E4] dark:border-slate-700 flex-shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-[#202B2A] dark:text-white truncate">
                {user?.name || 'Citizen User'}
              </div>
              <div className="text-[11px] text-[#66736F] dark:text-slate-400 capitalize">
                {user?.role} Account
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-[#131E30] border-b border-[#E5E8E4] dark:border-[#22344D] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#66736F] hover:text-[#202B2A] dark:text-slate-300 dark:hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-semibold text-[#66736F] dark:text-slate-400 hidden sm:block">
              CivicConnect AI • Citizen Service Portal
            </div>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <ThemeToggle />
            <Link
              to="/citizen/notifications"
              className="relative p-2 rounded-lg text-[#66736F] hover:text-[#202B2A] dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#131E30]" />
              )}
            </Link>
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Issue
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboardLayout;
