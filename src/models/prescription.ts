export interface Prescription {
  id: number;
  appointmentId: number;
  description: string;
  date: Date;
  expirationDate: Date;
} 