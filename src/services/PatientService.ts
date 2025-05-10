import db from '../database/connection';

class PatientService {
    async getAllPatients() {
        const patients = await db('pacientes').select('*');
        return patients;
    }

    async getPatientById(id: string) {
        const patient = await db('pacientes').where('id', id).first();
        return patient;
    }

    async createPatient(name: string, email: string, phone: string) {
        const patient = await db('pacientes').insert({ name, email, phone });
        return patient;
    }

    async updatePatient(id: string, name: string, email: string, phone: string) {
        const patient = await db('pacientes').where('id', id).update({ name, email, phone });
        return patient;
    }

    async deletePatient(id: string) {
        const patient = await db('pacientes').where('id', id).delete();
        return patient;
    }
}

export default PatientService;
