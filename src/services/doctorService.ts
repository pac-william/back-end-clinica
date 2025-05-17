import db from '../database/connection';

class DoctorService {
  async getAllDoctors(page: number = 1, limit: number = 10, specialty?: string, name?: string) {
    const offset = (page - 1) * limit;
    
    let query = db('doctors');
    
    if (specialty) {
      query = query.whereRaw('LOWER(specialty) LIKE LOWER(?)', [`%${specialty}%`]);
    }
    
    if (name) {
      query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
    }

    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;
    
    const doctors = await query.select('*').offset(offset).limit(limit);
    
    return {
      data: doctors,
      meta: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getDoctorById(id: string) {
    return await db('doctors').where('id', id).first();
  }

  async createDoctor(name: string, crm: string, specialty: string, phone: string, email: string): Promise<any> {

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

    const doctor = await db('doctors').insert({
      name,
      crm,
      specialty,
      phone,
      email,
    }).returning('*');

    return {
      success: true,
      data: doctor,
    };
  }

  async updateDoctor(id: string, name: string, crm: string, specialty: string, phone: string, email: string) {
    await db('doctors').where('id', id).update({
      name,
      crm,
      specialty,
      phone,
      email,
      updated_at: db.fn.now(),
    });
    return await this.getDoctorById(id);
  }

  async deleteDoctor(id: string) {
    await db('doctors').where('id', id).delete();
    return { id };
  }
}

export default DoctorService;