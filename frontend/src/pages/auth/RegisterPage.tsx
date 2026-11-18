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
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#0B1320] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative text-[#202B2A] dark:text-[#F1F5F9]">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <Logo size="lg" />
        </Link>
        <h2 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-[#202B2A] dark:text-white">
          Create an Account
        </h2>
        <p className="mt-1.5 text-xs text-[#66736F] dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#2563EB] hover:underline">
            Sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#131E30] py-8 px-6 shadow-subtle rounded-lg border border-[#E5E8E4] dark:border-[#22344D] sm:px-10">
          {authError && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Account Type Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-2">
                Account Jurisdiction
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedRole === 'citizen'
                      ? 'border-[#183B3A] bg-[#183B3A]/5 text-[#183B3A] dark:border-white dark:bg-white/10 dark:text-white font-semibold'
                      : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] text-[#202B2A] dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="citizen"
                    className="sr-only"
                    {...register('role')}
                  />
                  <span className="text-xs font-bold">Resident Citizen</span>
                  <span className="text-[10px] text-[#66736F] dark:text-slate-400 mt-0.5">Report & Track</span>
                </label>

                <label
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedRole === 'staff'
                      ? 'border-[#183B3A] bg-[#183B3A]/5 text-[#183B3A] dark:border-white dark:bg-white/10 dark:text-white font-semibold'
                      : 'border-[#E5E8E4] dark:border-[#22344D] hover:bg-[#FAFAF7] dark:hover:bg-[#111A29] text-[#202B2A] dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="staff"
                    className="sr-only"
                    {...register('role')}
                  />
                  <span className="text-xs font-bold">Municipal Staff</span>
                  <span className="text-[10px] text-[#66736F] dark:text-slate-400 mt-0.5">Field Dispatch</span>
                </label>
              </div>
            </div>

            <Input
              label="Full Legal Name"
              type="text"
              placeholder="e.g. Elena Rostova"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            {selectedRole === 'staff' && (
              <div>
                <label className="block text-xs font-semibold text-[#202B2A] dark:text-slate-200 mb-1.5">
                  Municipal Department
                </label>
                <select
                  className="block w-full rounded-md border border-[#E5E8E4] dark:border-[#22344D] bg-[#FAFAF7] dark:bg-[#111A29] text-xs text-[#202B2A] dark:text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#183B3A]"
                  {...register('department')}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-xs text-rose-500">{errors.department.message}</p>
                )}
              </div>
            )}

            <Input
              label="Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Min 8 characters, uppercase & number"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              leftIcon={<Lock className="w-4 h-4" />}
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-1">
              <label className="flex items-start text-xs text-[#66736F] dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-[#E5E8E4] text-[#183B3A] focus:ring-[#183B3A] mt-0.5 mr-2"
                  {...register('termsAccepted')}
                />
                <span>
                  I agree to the{' '}
                  <span className="text-[#2563EB] hover:underline">Civic Terms of Service</span> and{' '}
                  <span className="text-[#2563EB] hover:underline">Municipal Privacy Policy</span>.
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-xs text-rose-500">{errors.termsAccepted.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Complete Registration
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
