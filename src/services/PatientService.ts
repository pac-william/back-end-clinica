import db from '../database/connection';

class PatientService {
    async getAllPatients(page: number = 1, limit: number = 10, name?: string, email?: string, phone?: string) {
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
            data: patients,
            meta: {
                total: total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getPatientById(id: string) {
        const patient = await db('patients').where('id', id).first();
        return patient;
    }

    async createPatient(name: string, email: string, phone: string) {
        const [patient] = await db('patients').insert({ name, email, phone }).returning('*');

        return patient;
    }

    async updatePatient(id: string, name: string, email: string, phone: string) {
        const patient = await db('patients').where('id', id).update({ name, email, phone });
        return patient;
    }

    async deletePatient(id: string) {
        const patient = await db('patients').where('id', id).delete();
        return patient;
    }
}

export default PatientService;
