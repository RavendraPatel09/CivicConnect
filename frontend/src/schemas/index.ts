import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['citizen', 'staff'], {
      required_error: 'Please select an account type',
    }),
    department: z.string().optional(),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms of service' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address associated with your account'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Complaint step-by-step schemas
export const complaintStep1Schema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  category: z.enum(
    [
      'roads_potholes',
      'water_supply',
      'garbage_management',
      'streetlights',
      'drainage',
      'public_infrastructure',
    ],
    { required_error: 'Please select an issue category' }
  ),
  severity: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Please select an estimated severity',
  }),
  description: z
    .string()
    .min(20, 'Please provide at least 20 characters of detail for municipal crews')
    .max(2000, 'Description cannot exceed 2000 characters'),
});

export const complaintStep2Schema = z.object({
  address: z.string().min(5, 'Street address or descriptive location is required'),
  landmark: z.string().optional(),
  lat: z.number({ required_error: 'Latitude coordinate required' }),
  lng: z.number({ required_error: 'Longitude coordinate required' }),
});

export const complaintStep3Schema = z.object({
  images: z.array(z.string()).min(1, 'Please attach at least one photo showing the issue'),
});

export const fullComplaintSchema = complaintStep1Schema
  .merge(complaintStep2Schema)
  .merge(complaintStep3Schema);

export type ComplaintFormData = z.infer<typeof fullComplaintSchema>;

export const triageOverrideSchema = z.object({
  category: z.enum([
    'roads_potholes',
    'water_supply',
    'garbage_management',
    'streetlights',
    'drainage',
    'public_infrastructure',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  assignedDepartment: z.string().min(1, 'Department is required'),
  assignedStaffName: z.string().optional(),
  priorityScore: z.number().min(0).max(100),
  overrideNotes: z.string().min(5, 'Please provide rationale for overriding AI triage recommendation'),
});

export type TriageOverrideFormData = z.infer<typeof triageOverrideSchema>;

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  department: z.string().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
