import { z } from 'zod';

const DoctorDTO = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  crm: z.string().min(4, 'CRM deve ter pelo menos 4 caracteres'),
  specialty: z.string().min(3, 'Especialidade deve ter pelo menos 3 caracteres'),
  phone: z.string(),
  email: z.string().email('Email inválido')
});

export default DoctorDTO;
