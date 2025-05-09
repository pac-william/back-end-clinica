export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: Date;
  status: string;
} 