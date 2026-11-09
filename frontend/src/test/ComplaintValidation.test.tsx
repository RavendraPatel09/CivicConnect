import { describe, it, expect } from 'vitest';
import { fullComplaintSchema, loginSchema, registerSchema } from '../schemas';

describe('Validation Schemas (Zod)', () => {
  it('validates compliant complaint submission payload', () => {
    const validData = {
      title: 'Dangerous Pothole at Main and 4th',
      category: 'roads_potholes',
      severity: 'high',
      description: 'Vehicles are swerving into oncoming traffic to avoid hitting the 8-inch deep crater.',
      address: '100 Main Street',
      landmark: 'Near City Hall',
      lat: 37.7749,
      lng: -122.4194,
      images: ['https://example.com/pothole.jpg'],
    };

    const result = fullComplaintSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects complaint with short description (<20 chars)', () => {
    const invalidData = {
      title: 'Pothole here',
      category: 'roads_potholes',
      severity: 'low',
      description: 'Too short',
      address: '100 Main St',
      lat: 37.77,
      lng: -122.41,
      images: ['https://example.com/pothole.jpg'],
    };

    const result = fullComplaintSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects complaint without photos', () => {
    const invalidData = {
      title: 'Broken Streetlight',
      category: 'streetlights',
      severity: 'medium',
      description: 'The light has been out for 3 days and pedestrians cannot see at night.',
      address: '500 Elm Street',
      lat: 37.77,
      lng: -122.41,
      images: [],
    };

    const result = fullComplaintSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates user registration passwords match', () => {
    const mismatchedPasswords = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
      role: 'citizen',
      termsAccepted: true,
    };

    const result = registerSchema.safeParse(mismatchedPasswords);
    expect(result.success).toBe(false);
  });
});
