import db from "../database/connection";
import { Patient, PatientPaginatedResponse } from "../models/patient";
import { PatientDTO } from "../dtos/patient.dto";
import { MetaBuilder } from "../utils/MetaBuilder";

export class PatientRepository {
  /**
   * Retorna todos os pacientes com paginação e filtros opcionais.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param name Filtro por nome
   * @param email Filtro por email
   * @param phone Filtro por telefone
   */
  async getAllPatients(page: number, size: number, name?: string, email?: string, phone?: string): Promise<PatientPaginatedResponse> {
    const offset = (page - 1) * size;

    let query = db('patients');

    if (name) {
      query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
    }

    if (email) {
      query = query.whereRaw('LOWER(email) LIKE LOWER(?)', [`%${email}%`]);
    }

    if (phone) {
      query = query.where('phone', 'like', `%${phone}%`);
    }

    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    const patients = await query.select('*').offset(offset).limit(size);

    return {
      patients: patients,
      meta: {
        total: total,
        page: page,
        size: size,
      }
    };
  }

  /**
   * Busca um paciente pelo seu ID.
   * @param id ID do paciente
   */
  async getPatientById(id: string) {
    return db('patients').where('id', id).first();
  }

  /**
   * Busca um paciente pelo seu CPF.
   * @param cpf CPF do paciente
   */
  async getByCpf(cpf: string) {
    return db('patients').where('cpf', cpf).first();
  }

  /**
   * Cria um novo paciente.
   * @param patient Dados do paciente
   */
  async createPatient(patient: Patient) {
    const [patientResult] = await db('patients').insert(patient).returning('*');
    return patientResult;
  }

  /**
   * Atualiza os dados de um paciente.
   * @param id ID do paciente
   * @param patient Dados atualizados do paciente
   */
  async updatePatient(id: string, patient: PatientDTO) {
    const [patientResult] = await db('patients')
      .where('id', id)
      .update({ 
        name: patient.name, 
        address: patient.address, 
        phone: patient.phone, 
        cpf: patient.cpf 
      })
      .returning('*');
    
    return patientResult;
  }

  /**
   * Remove um paciente do sistema.
   * @param id ID do paciente
   */
  async deletePatient(id: string) {
    return db('patients').where('id', id).delete();
  }

  // Outros métodos de consulta e manipulação de pacientes podem ser adicionados conforme necessário
} 