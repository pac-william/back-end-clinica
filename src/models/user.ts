type Role = 'DOCTOR' | 'SECRETARY' | 'PATIENT';

interface User {
  id: number;
  login: string;
  senha: string;
  role: Role;
}