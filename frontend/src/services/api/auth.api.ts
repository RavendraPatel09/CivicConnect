import { User, UserRole } from '../../types';
import mockStorage from '../mock/mockStorage';
import { LoginFormData, RegisterFormData } from '../../schemas';
import apiClient from './client';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // FastAPI POST /api/v1/auth/login
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      const data = res.data;
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        department: data.user.department || (data.user as any).department_name,
        avatar: data.user.avatar || (data.user as any).profile_image,
        joinedDate: data.user.joinedDate || (data.user as any).created_at || new Date().toISOString(),
      };
      const token = data.token || (data as any).tokens?.access_token;
      localStorage.setItem('civic_auth_token', token);
      localStorage.setItem('civic_current_user', JSON.stringify(user));
      mockStorage.setCurrentUser(user, token);
      return { user, token };
    } catch (error) {
      // Offline / mock fallback for development & tests
      const users = mockStorage.getAllUsers();
      let user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user) {
        if (credentials.email.includes('admin')) {
          user = users.find((u) => u.role === 'admin') || users[2];
        } else if (credentials.email.includes('staff')) {
          user = users.find((u) => u.role === 'staff') || users[1];
        } else {
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
    }
  },

  // FastAPI POST /api/v1/auth/register
  async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
        department: data.department,
      });
      const resData = res.data;
      const user: User = {
        id: resData.user.id,
        name: resData.user.name,
        email: resData.user.email,
        role: resData.user.role,
        department: resData.user.department || (resData.user as any).department_name,
        avatar: resData.user.avatar || (resData.user as any).profile_image,
        joinedDate: resData.user.joinedDate || (resData.user as any).created_at || new Date().toISOString(),
      };
      const token = resData.token || (resData as any).tokens?.access_token;
      localStorage.setItem('civic_auth_token', token);
      localStorage.setItem('civic_current_user', JSON.stringify(user));
      mockStorage.setCurrentUser(user, token);
      return { user, token };
    } catch (error) {
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
    }
  },

  // FastAPI POST /api/v1/auth/logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignored if network unavailable
    }
    mockStorage.clearSession();
    localStorage.removeItem('civic_auth_token');
    localStorage.removeItem('civic_current_user');
  },

  // FastAPI GET /api/v1/auth/me
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('civic_auth_token');
      if (!token) return mockStorage.getCurrentUser();
      const res = await apiClient.get<any>('/auth/me');
      const u = res.data;
      const user: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department || u.department_name,
        avatar: u.avatar || u.profile_image,
        phone: u.phone,
        joinedDate: u.joinedDate || u.created_at || new Date().toISOString(),
      };
      localStorage.setItem('civic_current_user', JSON.stringify(user));
      return user;
    } catch (error) {
      return mockStorage.getCurrentUser();
    }
  },

  // Switch demo persona quick helper for interactive UI
  switchDemoRole(role: UserRole): User {
    const users = mockStorage.getAllUsers();
    const target = users.find((u) => u.role === role) || users[0];
    mockStorage.setCurrentUser(target, `civic_token_${target.id}`);
    return target;
  },
};

export default authApi;
