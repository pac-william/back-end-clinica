import db from '../../database/connection';
import { PatientPort } from './patientPort';
import { PatientPaginatedResponse } from '../../models/patient';
import { PatientDTO } from '../../dtos/patient.dot';

class PatientService implements PatientPort {
    async getAllPatients(page: number = 1, limit: number = 10, name?: string, email?: string, phone?: string): Promise<PatientPaginatedResponse> {
        const offset = (page - 1) * limit;
        
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
        
        const patients = await query.select('*').offset(offset).limit(limit);
        
        return {
            patients: patients,
            meta: {
                total: total,
                page: page,
                limit: limit,
            }
        };
    }

    async getPatientById(id: string) {
        const patient = await db('patients').where('id', id).first();
        return patient;
    }

    async createPatient(patient: PatientDTO) {
        const [patientResult] = await db('patients').insert({ name: patient.name, address: patient.address, phone: patient.phone, cpf: patient.cpf }).returning('*');

        return patientResult;
    }

    async updatePatient(id: string, patient: PatientDTO) {
        const [patientResult] = await db('patients').where('id', id).update({ name: patient.name, address: patient.address, phone: patient.phone, cpf: patient.cpf }).returning('*');
        return patientResult;
    }

    async deletePatient(id: string) {
        await db('patients').where('id', id).delete();
    }
}

export default PatientService;
