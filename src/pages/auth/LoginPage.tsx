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
import { Mail, Lock, AlertCircle, Sparkles, UserCheck, HardHat, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1320] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <Logo size="lg" />
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#142B45] dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Or{' '}
          <Link to="/register" className="font-semibold text-civic hover:text-blue-700">
            register for a new citizen or municipal staff account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#131E30] py-8 px-6 shadow-sm rounded-2xl border border-slate-200/90 dark:border-[#22344D] sm:px-10">
          {/* Quick Demo Autofill Bar */}
          <div className="mb-6 p-3.5 bg-slate-50 dark:bg-[#0E1726] rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-civic" />
              One-Click Demo Personas
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('elena.rostova@example.com', 'citizen')}
                className="p-1.5 rounded-lg text-[11px] font-medium bg-white dark:bg-[#131E30] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-civic text-center"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-0.5" />
                Citizen
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('marcus.vance@citygov.org', 'staff')}
                className="p-1.5 rounded-lg text-[11px] font-medium bg-white dark:bg-[#131E30] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-civic text-center"
              >
                <HardHat className="w-3.5 h-3.5 text-amber-500 mx-auto mb-0.5" />
                Staff
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('sarah.chen@civicconnect.gov', 'admin')}
                className="p-1.5 rounded-lg text-[11px] font-medium bg-white dark:bg-[#131E30] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-civic text-center"
              >
                <Shield className="w-3.5 h-3.5 text-blue-500 mx-auto mb-0.5" />
                Admin
              </button>
            </div>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
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
              <label className="flex items-center text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-civic focus:ring-civic mr-2"
                  {...register('rememberMe')}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-civic hover:text-blue-700 dark:hover:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="civic"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In to Platform
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Demonstration auth layer • Ready for FastAPI OAuth2 Bearer token
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
