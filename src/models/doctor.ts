import { Specialty } from './specialty';

export interface Doctor {
  id?: number;
  name: string;
  specialty: Specialty;
  phone: string;
  cpf: string;
} 