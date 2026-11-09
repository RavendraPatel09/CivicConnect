import { User, UserRole } from '../../types';
import mockStorage from '../mock/mockStorage';
import { LoginFormData, RegisterFormData } from '../../schemas';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Simulates FastAPI POST /api/v1/auth/login (OAuth2 Password flow / JSON)
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 350)); // Realistic network latency

    const users = mockStorage.getAllUsers();
    // Check if user exists with this email
    let user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());

    // If demo login with any credentials, match or fallback sensibly
    if (!user) {
      if (credentials.email.includes('admin')) {
        user = users.find((u) => u.role === 'admin') || users[2];
      } else if (credentials.email.includes('staff')) {
        user = users.find((u) => u.role === 'staff') || users[1];
      } else {
        // Create demo citizen session
        user = {
          id: `user-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'citizen',
          joinedDate: new Date().toISOString(),
        };
      }
    }

    const token = `civic_token_${user.id}_${Date.now()}`;
    mockStorage.setCurrentUser(user, token);
    return { user, token };
  },

  // Simulates FastAPI POST /api/v1/auth/register
  async register(data: RegisterFormData): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      department: data.department || (data.role === 'staff' ? 'Municipal Public Services' : undefined),
      joinedDate: new Date().toISOString(),
    };

    const token = `civic_token_${newUser.id}_${Date.now()}`;
    mockStorage.setCurrentUser(newUser, token);
    return { user: newUser, token };
  },

  // Simulates FastAPI POST /api/v1/auth/logout
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    mockStorage.clearSession();
  },

  // Simulates FastAPI GET /api/v1/auth/me
  async getCurrentUser(): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockStorage.getCurrentUser();
  },

  // Switch demo persona quick helper for testing
  switchDemoRole(role: UserRole): User {
    const users = mockStorage.getAllUsers();
    const target = users.find((u) => u.role === role) || users[0];
    mockStorage.setCurrentUser(target, `civic_token_${target.id}`);
    return target;
  },
};

export default authApi;
