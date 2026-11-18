import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/forms/Input';
import { User, Mail, Phone, Calendar, Shield, Camera, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-8901');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-2 border-b border-[#E5E8E4] dark:border-[#22344D]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#66736F] dark:text-slate-400 mb-0.5">
          Account Administration
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#202B2A] dark:text-white">User Profile</h1>
        <p className="text-xs text-[#66736F] dark:text-slate-400 mt-0.5">
          Manage your verified credentials and municipal communications settings.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E5E8E4] dark:border-[#22344D]">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover border border-[#E5E8E4] dark:border-slate-700 shadow-subtle"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#183B3A] text-white shadow hover:bg-[#183B3A]/90 dark:bg-[#2563EB]"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base font-bold text-[#202B2A] dark:text-white">
                {user?.name}
              </h3>
              <p className="text-xs text-[#66736F] dark:text-slate-400">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAFAF7] dark:bg-[#0E1624] text-[#183B3A] dark:text-[#3B8278] border border-[#E5E8E4] dark:border-[#22344D] capitalize mt-1">
                <Shield className="w-3 h-3" />
                {user?.role} Account
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-6">
            <Input
              label="Full Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address (Locked)"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              helperText="Contact city administrator to update registered municipal email."
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <div className="flex items-center gap-2 text-xs text-[#66736F] pt-1">
              <Calendar className="w-4 h-4 text-[#66736F]" />
              <span className="tabular-nums">
                Registered account since{' '}
                {new Date(user?.joinedDate || '2024-01-15').toLocaleDateString()}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs font-semibold text-[#23845B] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated
                </span>
              ) : (
                <div />
              )}
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
