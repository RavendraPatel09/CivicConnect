import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, PlusCircle, LayoutDashboard, LogIn } from 'lucide-react';
import Button from '../ui/Button';

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Services', href: '#categories' },
    { name: 'Explore Issues', href: '#explore' },
    { name: 'About', href: '#transparency' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      return;
    }
    e.preventDefault();
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/admin/queue';
    return '/citizen';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAFAF7]/95 dark:bg-[#0B1320]/95 backdrop-blur-md border-b border-[#E5E8E4] dark:border-[#22344D] shadow-subtle'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-sm font-medium text-[#66736F] hover:text-[#183B3A] dark:text-slate-300 dark:hover:text-white rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Utilities & CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(getDashboardPath())}
                  leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
                >
                  Dashboard
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/report')}
                  leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                >
                  Report an Issue
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/report">
                  <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                    Report an Issue
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#66736F] hover:text-[#183B3A] dark:text-slate-300 dark:hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAFAF7] dark:bg-[#0E1624] border-b border-[#E5E8E4] dark:border-[#22344D] px-4 pt-3 pb-6 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-[#202B2A] dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#E5E8E4] dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => {
                    navigate(getDashboardPath());
                    setMobileMenuOpen(false);
                  }}
                  leftIcon={<LayoutDashboard className="w-4 h-4" />}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => {
                    navigate('/report');
                    setMobileMenuOpen(false);
                  }}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Report an Issue
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                  <Button variant="secondary" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link to="/report" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                  <Button variant="primary" className="w-full justify-center" leftIcon={<PlusCircle className="w-4 h-4" />}>
                    Report an Issue
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
