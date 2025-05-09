export interface Exam {
  id: number;
  patientId: number;
  doctorId: number;
  type: string;
  date: Date;
  result: string;
  status: string;
} 