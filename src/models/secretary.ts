export interface Secretary {
  id: number;
  name: string;
  department: string;
  phone: string;
  email: string;
  user_id?: number;
  active?: boolean;
}
