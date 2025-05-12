import db from '../database/connection';

class DoctorService {
  async getAllDoctors() {
    return await db('doctors').select('*');
  }

  async getDoctorById(id: string) {
    return await db('doctors').where('id', id).first();
  }

  async createDoctor(name: string, crm: string, specialty: string, phone: string, email: string) {
    const [id] = await db('doctors').insert({
      name,
      crm,
      specialty,
      phone,
      email,
    });
    return await this.getDoctorById(id.toString());
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