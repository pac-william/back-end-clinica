import { Meta } from "./meta";

export interface Patient {
  id?: number;
  name: string;
  address: string;
  phone: string;
  birth_date: Date;
  cpf: string;
} 

export type PatientPaginatedResponse = {
  patients: Patient[];
  meta: Meta;
};

