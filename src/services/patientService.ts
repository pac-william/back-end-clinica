import Utils from '../utils/utils';
import db from '../database/connection';
import { PatientDTO } from '../dtos/patient.dto';
import { Patient, PatientPaginatedResponse } from '../models/patient';

class PatientService {
    async getAllPatients(page: number, size: number, name?: string, email?: string, phone?: string): Promise<PatientPaginatedResponse> {
        const offset = (page - 1) * size;

        let query = db('patients');

        if (name) {
            query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
        }

        if (email) {
            query = query.whereRaw('LOWER(email) LIKE LOWER(?)', [`%${email}%`]);
        }

        if (phone) {
            query = query.where('phone', 'like', `%${phone}%`);
        }

        const countResult = await query.clone().count('id as count').first();
        const total = countResult ? Number(countResult.count) : 0;

        const patients = await query.select('*').offset(offset).limit(size);

        return {
            patients: patients,
            meta: {
                total: total,
                page: page,
                size: size,
            }
        };
    }

    async getPatientById(id: string) {
        const patient = await db('patients').where('id', id).first();
        return patient;
    }

    async createPatient(patient: Patient) {
        if(!Utils.checkCPF(patient.cpf)) {
            return {
                success:false,
                message: 'Invalid CPF'
            }
        };

        patient.cpf = patient.cpf.length > 11 ? Utils.removeMask(patient.cpf) : patient.cpf;
        if(await this.getByCpf(patient.cpf)) {
            return  {
                message: "Patient with this CPF already exists",
                success: false
            };
        }

        const [patientResult] = await db('patients').insert(patient).returning('*');
        return {
            success: true,
            data: patientResult
        };
    }

    async updatePatient(id: string, patient: PatientDTO) {
        const [patientResult] = await db('patients').where('id', id).update({ name: patient.name, address: patient.address, phone: patient.phone, cpf: patient.cpf }).returning('*');
        return patientResult;
    }

    async deletePatient(id: string) {
        await db('patients').where('id', id).delete();
    }

    async getByCpf(cpf: string) {
        const patient = await db('patients').where('cpf', cpf).first();
        return patient;
    }
}

export default PatientService;
