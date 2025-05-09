export interface Payment {
  id: number;
  appointmentId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  status: string;
  insuranceId?: number;
} 