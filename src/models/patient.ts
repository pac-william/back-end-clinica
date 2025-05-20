import { Meta } from "./meta";

export interface Patient {
  id: number;
  name: string;
  address: string;
  phone: string;
  cpf: string;
} 

export type PatientPaginatedResponse = {
  patients: Patient[];
  meta: Meta;
};

