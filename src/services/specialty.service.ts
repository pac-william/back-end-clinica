import { z } from 'zod';
import db from '../database/connection';
import { createSpecialtyDTO } from '../dtos/specialty.dto';

interface Specialty {
  id: number;
  name: string;
}

class SpecialtyService {

  async createUser({ name }: z.infer<typeof createSpecialtyDTO>): Promise<any> {

    
      const existing = await db('specialty').where('name', name).first();
  
      if (existing) {
        return {
          success: false,
          data: {
            email: ['Name already in use'],
          },
        };
      }
  
  
      const [user] = await db('specialty')
        .insert({name}).returning(['id', 'name']);
  
      return {
        success: true,
        data: user,
      };
    }


    async getAll(page: number = 1, limit: number = 10, name?: string) {
    const offset = (page - 1) * limit;
    
    let query = db('specialty').select(['id', 'name','created_at', 'updated_at']);
    
    if (name) {
      query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
    }
    
    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;
    
    const specialties = await query.offset(offset).limit(limit);
    
    return {
      data: specialties,
      meta: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}


export default SpecialtyService;