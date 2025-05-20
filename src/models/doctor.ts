import { Meta } from './meta';
import { Specialty } from './specialty';

export type Doctor = {
  id?: number;
  name: string;
  crm: string;
  specialties: Specialty[];
  phone: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export type DoctorPaginatedResponse = {
  doctors: Doctor[];
  meta: Meta;
};
