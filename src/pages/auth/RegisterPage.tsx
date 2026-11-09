import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, RegisterFormData } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/common/Logo';
import Input from '../../components/forms/Input';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { User, Mail, Lock, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../../constants';

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'citizen',
      termsAccepted: true,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setAuthError(null);
      await registerAuth(data);
      if (data.role === 'staff') {
        navigate('/admin/queue');
      } else {
        navigate('/citizen');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    }
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
          Create your account
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-civic hover:text-blue-700">
            Sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#131E30] py-8 px-6 shadow-sm rounded-2xl border border-slate-200/90 dark:border-[#22344D] sm:px-10">
          {authError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Account Type Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedRole === 'citizen'
                      ? 'border-civic bg-blue-50/50 dark:bg-blue-950/30 text-civic ring-1 ring-civic'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="citizen"
                    className="sr-only"
                    {...register('role')}
                  />
                  <span className="text-xs font-bold">Citizen</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Report & track
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedRole === 'staff'
                      ? 'border-civic bg-blue-50/50 dark:bg-blue-950/30 text-civic ring-1 ring-civic'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="staff"
                    className="sr-only"
                    {...register('role')}
                  />
                  <span className="text-xs font-bold">Municipal Staff</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Field resolution
                  </span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-rose-500">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Full Name"
              type="text"
              leftIcon={<User className="w-4 h-4" />}
              placeholder="e.g. Elena Rostova"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="your.email@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {selectedRole === 'staff' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Assigned Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <select
                    className="block w-full rounded-lg border border-slate-300 dark:border-[#22344D] bg-white dark:bg-[#111A29] text-sm text-slate-900 dark:text-white pl-9 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-civic/20"
                    {...register('department')}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <Input
              label="Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-2">
              <label className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-civic focus:ring-civic mt-0.5 mr-2"
                  {...register('termsAccepted')}
                />
                <span>
                  I agree to the CivicConnect AI Terms of Service, Public Accountability Charter, and Privacy Policy.
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.termsAccepted.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="civic"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
