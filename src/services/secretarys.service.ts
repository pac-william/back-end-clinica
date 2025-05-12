import { Secretary } from 'models/secretary';
import db from '../database/connection';

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
        const nurser = await db('secretarys').where('id', id).first();
        return nurser;
    }

    async create(secretary: Secretary) {
        const [nurser] = await db('secretarys').insert(secretary).returning('*');
        return nurser;
    }

    async update(id: string, name: string, email: string, phone: string) {
        const nurser = await db('secretarys').where('id', id).update({ name, email, phone });
        return nurser;
    }

    async delete(id: string) {
        const nurser = await db('secretarys').where('id', id).delete();
        return nurser;
    }
}

export default SecretaryService;
