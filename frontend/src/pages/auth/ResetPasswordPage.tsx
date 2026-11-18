import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { resetPasswordSchema, ResetPasswordFormData } from '../../schemas';
import Logo from '../../components/common/Logo';
import Input from '../../components/forms/Input';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
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
          Create New Password
        </h2>
        <p className="mt-1.5 text-xs text-[#66736F] dark:text-slate-400">
          Your new password must be distinct from previously used credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#131E30] py-8 px-6 shadow-subtle rounded-lg border border-[#E5E8E4] dark:border-[#22344D] sm:px-10">
          {isSuccess ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#23845B] mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#202B2A] dark:text-white">
                Password Successfully Updated
              </h3>
              <p className="text-xs text-[#66736F] dark:text-slate-400">
                Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="New Password"
                type="password"
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="Min 8 characters, uppercase & number"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="Repeat new password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
              >
                Set New Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
