import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import { Loader2 } from 'lucide-react';

// Lazy load feature pages for optimal bundle performance
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const CitizenDashboardLayout = lazy(() => import('../components/layout/CitizenDashboardLayout'));
const CitizenOverviewPage = lazy(() => import('../pages/citizen/CitizenOverviewPage'));
const MyComplaintsPage = lazy(() => import('../pages/citizen/MyComplaintsPage'));
const ComplaintSubmissionPage = lazy(() => import('../pages/citizen/ComplaintSubmissionPage'));
const ComplaintDetailsPage = lazy(() => import('../pages/citizen/ComplaintDetailsPage'));
const MapExplorerPage = lazy(() => import('../pages/citizen/MapExplorerPage'));
const NearbyIssuesPage = lazy(() => import('../pages/citizen/NearbyIssuesPage'));
const NotificationsPage = lazy(() => import('../pages/citizen/NotificationsPage'));
const ProfilePage = lazy(() => import('../pages/citizen/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/citizen/SettingsPage'));

const AdminDashboardLayout = lazy(() => import('../components/layout/AdminDashboardLayout'));
const AdminOverviewPage = lazy(() => import('../pages/admin/AdminOverviewPage'));
const ComplaintManagementPage = lazy(() => import('../pages/admin/ComplaintManagementPage'));
const AITriagePage = lazy(() => import('../pages/admin/AITriagePage'));
const StaffManagementPage = lazy(() => import('../pages/admin/StaffManagementPage'));
const AnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage'));
const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage'));

const PageLoadingSpinner = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin text-civic mb-3" />
    <span className="text-xs font-medium text-slate-500">Loading CivicConnect AI...</span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Standalone Citizen Action Routes */}
        <Route path="/report" element={<ComplaintSubmissionPage />} />
        <Route path="/tickets/:id" element={<ComplaintDetailsPage />} />

        {/* Citizen Portal Protected Layout */}
        <Route path="/citizen" element={<CitizenDashboardLayout />}>
          <Route index element={<CitizenOverviewPage />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="nearby" element={<NearbyIssuesPage />} />
          <Route path="map" element={<MapExplorerPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin & Municipal Staff Portal */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="queue" element={<ComplaintManagementPage />} />
          <Route path="triage" element={<AITriagePage />} />
          <Route path="staff" element={<StaffManagementPage />} />
          <Route path="map" element={<MapExplorerPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
