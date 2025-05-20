export interface MedicalRecord {
  id: number;
  patientId: number;
  description: string;
  consultation_date: Date;
  doctorId: number;
} 