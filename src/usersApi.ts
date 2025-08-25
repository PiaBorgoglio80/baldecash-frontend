import { api } from './api';

export type Role = 'ADMIN' | 'REVIEWER';
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
};

export const UsersApi = {
  list: () => api.get<User[]>('/users'),
  create: (payload: Omit<User, 'id'|'createdAt'> & { password: string }) =>
    api.post<User>('/users', payload),
  update: (id: number, payload: Partial<Omit<User, 'id'|'createdAt'>> & { password?: string }) =>
    api.put<User>(`/users/${id}`, payload),
  remove: (id: number) => api.delete<void>(`/users/${id}`),
};
