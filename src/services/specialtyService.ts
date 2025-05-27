import { z } from 'zod';
import db from '../database/connection';
import { SpecialtyDTO } from '../dtos/specialty.dto';

interface Specialty {
  id: number;
  name: string;
}

class SpecialtyService {

  async createUser({ name }: z.infer<typeof SpecialtyDTO>): Promise<any> {


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
      .insert({ name }).returning(['id', 'name']);

    return {
      success: true,
      data: user,
    };
  }


  async getAll(page: number = 1, limit: number = 10, name?: string) {

    const offset = (page - 1) * limit;

    let query = db('specialty').select(['id', 'name', 'created_at', 'updated_at']);

    if (name) {
      query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
    }

    const countResult = await db('specialty')
      .modify(q => {
        if (name?.trim()) {
          q.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name.trim()}%`]);
        }
      })
      .count('id as count')
      .first();
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

  async getById(id: number): Promise<Specialty | null> {
    const specialty = await db('specialty').where('id', id).first();

    if (!specialty) {
      return null;
    }

    return specialty;
  }

  async update(id: number, { name }: { name: string }): Promise<Specialty | null> {
    const specialty = await db('specialty').where('id', id).first();

    if (!specialty) {
      return null;
    }

    const updatedSpecialty = await db('specialty')
      .where('id', id)
      .update({ name })
      .returning(['id', 'name']);

    return updatedSpecialty[0];
  }

  async delete(id: number): Promise<boolean> {
    const specialty = await db('specialty').where('id', id).first();

    if (!specialty) {
      return false;
    }

    await db('specialty').where('id', id).del();
    return true;
  }
}


export default SpecialtyService;