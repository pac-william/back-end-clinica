import db from '../database/connection';

class PatientService {
    async getAllPatients() {
        const patients = await db('pacientes').select('*');
        return patients;
    }
}

export default PatientService;
