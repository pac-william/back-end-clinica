import db from '../database/connection';

class DoctorService {
  async getAllDoctors(page: number = 1, limit: number = 10, specialty?: string, name?: string) {
    const offset = (page - 1) * limit;
    
    let query = db('doctors')
      .select('doctors.*')
      .leftJoin('doctor_specialties', 'doctors.id', 'doctor_specialties.doctor_id')
      .leftJoin('specialty', 'doctor_specialties.specialty_id', 'specialty.id')
      .groupBy('doctors.id');
    
    if (specialty) {
      query = query.whereRaw('LOWER(specialty.name) LIKE LOWER(?)', [`%${specialty}%`]);
    }
    
    if (name) {
      query = query.whereRaw('LOWER(doctors.name) LIKE LOWER(?)', [`%${name}%`]);
    }

    const countResult = await query.clone().count('doctors.id as count').first();
    const total = countResult ? Number(countResult.count) : 0;
    
    const doctors = await query.offset(offset).limit(limit);

    // Buscar especialidades para cada médico
    const doctorsWithSpecialties = await Promise.all(doctors.map(async (doctor) => {
      const specialties = await db('doctor_specialties')
        .select('specialty.*')
        .join('specialty', 'doctor_specialties.specialty_id', 'specialty.id')
        .where('doctor_specialties.doctor_id', doctor.id);
      
      return {
        ...doctor,
        specialties
      };
    }));
    
    return {
      data: doctorsWithSpecialties,
      meta: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getDoctorById(id: string) {
    const doctor = await db('doctors').where('id', id).first();
    if (!doctor) return null;

    const specialties = await db('doctor_specialties')
      .select('specialty.*')
      .join('specialty', 'doctor_specialties.specialty_id', 'specialty.id')
      .where('doctor_specialties.doctor_id', id);

    return {
      ...doctor,
      specialties
    };
  }

  async createDoctor(name: string, crm: string, specialties: number[], phone: string, email: string): Promise<any> {
    const existing = await db('doctors')
      .where('crm', crm)
      .orWhere('email', email)
      .first();

    if (existing) {
      const errors: Record<string, string[]> = {};
      if (existing.crm === crm) errors.crm = ['CRM already registered'];
      if (existing.email === email) errors.email = ['Email already registered'];
      return {
        success: false,
        data: errors,
      };
    }

    // Verificar se todas as especialidades existem
    const existingSpecialties = await db('specialty')
      .whereIn('id', specialties)
      .select('id');

    if (existingSpecialties.length !== specialties.length) {
      return {
        success: false,
        data: {
          specialties: ['Uma ou mais especialidades não existem']
        }
      };
    }

    const trx = await db.transaction();

    try {
      const [doctor] = await trx('doctors').insert({
        name,
        crm,
        phone,
        email,
      }).returning('*');

      // Inserir relacionamentos com especialidades
      await trx('doctor_specialties').insert(
        specialties.map(specialtyId => ({
          doctor_id: doctor.id,
          specialty_id: specialtyId
        }))
      );

      await trx.commit();

      return {
        success: true,
        data: {
          ...doctor,
          specialties: existingSpecialties
        }
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async updateDoctor(id: string, name: string, crm: string, specialties: number[], phone: string, email: string) {
    const trx = await db.transaction();

    try {
      // Verificar se todas as especialidades existem
      const existingSpecialties = await trx('specialty')
        .whereIn('id', specialties)
        .select('id');

      if (existingSpecialties.length !== specialties.length) {
        await trx.rollback();
        return {
          success: false,
          data: {
            specialties: ['Uma ou mais especialidades não existem']
          }
        };
      }

      await trx('doctors').where('id', id).update({
        name,
        crm,
        phone,
        email,
        updated_at: db.fn.now(),
      });

      // Atualizar especialidades
      await trx('doctor_specialties').where('doctor_id', id).delete();
      await trx('doctor_specialties').insert(
        specialties.map(specialtyId => ({
          doctor_id: id,
          specialty_id: specialtyId
        }))
      );

      await trx.commit();

      return await this.getDoctorById(id);
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async deleteDoctor(id: string) {
    await db('doctors').where('id', id).delete();
    return { id };
  }
}

export default DoctorService;