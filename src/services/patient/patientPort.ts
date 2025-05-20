import { Patient, PatientPaginatedResponse } from "models/patient";
import { PatientDTO } from "dtos/patient.dot";

export interface PatientPort {
    getAllPatients: (page: number, limit: number, name?: string, email?: string, phone?: string) => Promise<PatientPaginatedResponse>;
    getPatientById: (id: string) => Promise<Patient>;
    createPatient: (patient: PatientDTO) => Promise<Patient>;
    updatePatient: (id: string, patient: PatientDTO) => Promise<Patient>;
    deletePatient: (id: string) => Promise<void>;
}   
