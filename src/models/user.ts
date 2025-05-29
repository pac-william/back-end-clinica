type Role = 'USER' | 'ADMIN' | 'MASTER';

export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}