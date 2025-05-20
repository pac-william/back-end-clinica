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
}


export default SpecialtyService;