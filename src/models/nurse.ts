import { Specialty } from "./specialty";

export interface Nurse {
  id: number;
  name: string;
  coren: string;
  specialty: Specialty;
  department: string;
  phone: string;
  cpf: string;
}

