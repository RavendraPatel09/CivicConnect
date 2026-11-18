import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, LoginFormData } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';
import Input from '../../components/forms/Input';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { Mail, Lock, AlertCircle, UserCheck, HardHat, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'elena.rostova@example.com',
      password: 'Password123!',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      await login(data);
      if (data.email.includes('admin')) {
        navigate('/admin');
      } else if (data.email.includes('staff')) {
        navigate('/admin/queue');
      } else {
        navigate('/citizen');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const fillQuickDemo = (email: string, role: string) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/admin/queue');
    else navigate('/citizen');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative text-[#202B2A] dark:text-[#F1F5F9]">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <Logo size="lg" />
        </Link>
        <h2 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-[#202B2A] dark:text-white">
          Sign in to CivicConnect AI
        </h2>
        <p className="mt-1.5 text-xs text-[#66736F] dark:text-slate-400">
          Or{' '}
          <Link to="/register" className="font-semibold text-[#2563EB] hover:underline">
            register for a new citizen or municipal staff account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#131E30] py-8 px-6 shadow-subtle rounded-lg border border-[#E5E8E4] dark:border-[#22344D] sm:px-10">
          {/* Quick Demo Autofill Bar */}
          <div className="mb-6 p-3.5 bg-[#FAFAF7] dark:bg-[#0E1624] rounded-lg border border-[#E5E8E4] dark:border-[#22344D]">
            <div className="text-[11px] font-bold uppercase text-[#66736F] dark:text-slate-400 tracking-wider mb-2">
              Demonstration Quick Personas
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('elena.rostova@example.com', 'citizen')}
                className="p-2 rounded-md text-[11px] font-semibold bg-white dark:bg-[#131E30] border border-[#E5E8E4] dark:border-[#22344D] text-[#202B2A] dark:text-slate-200 hover:border-[#183B3A] text-center transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#23845B] mx-auto mb-1" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('marcus.vance@citygov.org', 'staff')}
                className="p-2 rounded-md text-[11px] font-semibold bg-white dark:bg-[#131E30] border border-[#E5E8E4] dark:border-[#22344D] text-[#202B2A] dark:text-slate-200 hover:border-[#183B3A] text-center transition-colors"
              >
                <HardHat className="w-3.5 h-3.5 text-[#B7791F] mx-auto mb-1" />
                Staff
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('sarah.chen@civicconnect.gov', 'admin')}
                className="p-2 rounded-md text-[11px] font-semibold bg-white dark:bg-[#131E30] border border-[#E5E8E4] dark:border-[#22344D] text-[#202B2A] dark:text-slate-200 hover:border-[#183B3A] text-center transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#2563EB] mx-auto mb-1" />
                Admin
              </button>
            </div>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-[#66736F] dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-[#E5E8E4] text-[#183B3A] focus:ring-[#183B3A] mr-2"
                  {...register('rememberMe')}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-[#2563EB] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In to Platform
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[11px] text-[#66736F] dark:text-slate-400">
              CivicConnect AI • Production-ready OAuth2 Bearer token authentication
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
