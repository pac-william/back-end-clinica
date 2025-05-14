import db from '../database/connection';

class DoctorService {

  async getAllDoctors() {
    return await db('doctors').select('*');
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
      const erros: Record<string, string[]> = {};
      if (existing.crm === crm) erros.crm = ['CRM já cadastrado'];
      if (existing.email === email) erros.email = ['Email já cadastrado'];
      return {
        success: false,
        dados: erros,
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
      dados: doctor,
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