import { Secretary } from 'models/secretary';
import db from '../database/connection';
import DoctorService from './doctorService';

class SecretaryService {
    async getAll(page: number = 0, limit: number = 10): Promise<{ data: Secretary[]; total: number }> {
        const offset = (page - 1) * limit;

        const [data, [{ count }]] = await Promise.all([
            db('secretarys').select('*').offset(offset).limit(limit),
            db('secretarys').count('* as count')
        ]);
        return { data, total: Number(count) };
    }

    async getById(id: string) {
        const secretary = await db('secretarys').where('id', id).first();
        return secretary;
    }

    async create(secretary: Secretary) {

        const doctorService = new DoctorService();
        const doctor = await doctorService.getDoctorById(String(secretary.doctor_id));

        if (!doctor) {
            return {
                message: "Doctor not found",
                success: false
            };
        }

        const [secretarySaved] = await db('secretarys').insert(secretary).returning('*');
        return {
            success: true,
            data: secretarySaved
        };
    }

    async update(id: string, name: string, email: string, phone: string) {
        const secretary = await db('secretarys').where('id', id).update({ name, email, phone });
        return secretary;
    }

    async delete(id: string) {
        const secretary = await db('secretarys').where('id', id).delete();
        return secretary;
    }
}

export default SecretaryService;
