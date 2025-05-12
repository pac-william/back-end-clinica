import { Nurse } from 'models/nurse';
import db from '../database/connection';

class NursesService {
    
    async getAll(page: number = 0, limit: number = 10): Promise<{ data: Nurse[]; total: number }> {
        const offset = (page - 1) * limit;
    
        const [data, [{ count }]] = await Promise.all([
            db('nurses').select('*').offset(offset).limit(limit),
            db('nurses').count('* as count')
        ]);
    
        return { data, total: Number(count) };
    }

    async getById(id: string) {
        const nurser = await db('nurses').where('id', id).first();
        return nurser;
    }

    async create(name: string, email: string, phone: string) {
        const nurser = await db('nurses').insert({ name, email, phone });
        return nurser;
    }

    async update(id: string, name: string, email: string, phone: string) {
        const nurser = await db('nurses').where('id', id).update({ name, email, phone });
        return nurser;
    }

    async delete(id: string) {
        const nurser = await db('nurses').where('id', id).delete();
        return nurser;
    }
}

export default NursesService;
