import { Doctor, DoctorPaginatedResponse } from "models/doctor";
import { DoctorDTO } from "dtos/doctor.dto";
export interface DoctorPort {
    getAllDoctors: (page: number, limit: number, specialty?: number, name?: string) => Promise<DoctorPaginatedResponse>;
    getDoctorById: (id: string) => Promise<Doctor>;
    createDoctor: (doctor: DoctorDTO) => Promise<Doctor>;
    updateDoctor: (id: string, doctor: DoctorDTO) => Promise<Doctor>;
    deleteDoctor: (id: string) => Promise<void>;
}

export default DoctorPort;
