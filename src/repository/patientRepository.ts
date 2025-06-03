import db from "../database/connection";

export class PatientRepository {
  /**
   * Busca um paciente pelo seu ID.
   * @param id ID do paciente
   */
  async getPatientById(id: string) {
    return db('patients').where('id', id).first();
  }

  // Outros métodos de consulta e manipulação de pacientes podem ser adicionados conforme necessário
} 