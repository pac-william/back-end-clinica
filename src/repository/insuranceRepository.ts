import db from "../database/connection";
import { InsuranceDTO } from "../dtos/insurance.dto";
import { MetaBuilder } from "../utils/MetaBuilder";

export class InsuranceRepository {
  /**
   * Retorna uma lista paginada de convênios com filtro opcional por nome.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param name Nome para filtrar
   */
  async getAllInsurances(
    page: number,
    size: number,
    name?: string
  ) {
    const offset = (page - 1) * size;
    let query = db('insurances');

    if (name) {
      query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
    }

    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    const insurances = await query.offset(offset).limit(size);

    return {
      insurances,
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca todos os convênios sem paginação.
   */
  async getAllInsurancesWithoutPagination() {
    return db('insurances').select('*');
  }

  /**
   * Busca um convênio pelo seu ID.
   * @param id ID do convênio
   */
  async getInsuranceById(id: string) {
    return db('insurances').where('id', id).first();
  }

  /**
   * Busca um convênio pelo nome.
   * @param name Nome do convênio
   */
  async getInsuranceByName(name: string) {
    return db('insurances').whereRaw('LOWER(name) = LOWER(?)', [name]).first();
  }

  /**
   * Cria um novo convênio.
   * @param insurance Dados do convênio
   */
  async createInsurance(insurance: InsuranceDTO) {
    const [result] = await db('insurances').insert({
      name: insurance.name,
      description: insurance.description || '',
      contact_phone: insurance.contactPhone || ''
    }).returning('*');

    return result;
  }

  /**
   * Atualiza um convênio existente.
   * @param id ID do convênio
   * @param insurance Dados atualizados
   */
  async updateInsurance(id: string, insurance: Partial<InsuranceDTO>) {
    const [result] = await db('insurances')
      .where('id', id)
      .update({
        ...(insurance.name && { name: insurance.name }),
        ...(insurance.description !== undefined && { description: insurance.description }),
        ...(insurance.contactPhone !== undefined && { contact_phone: insurance.contactPhone })
      })
      .returning('*');

    return result;
  }

  /**
   * Remove um convênio (soft delete via flag active).
   * @param id ID do convênio
   */
  async deleteInsurance(id: string) {
    return db('insurances')
      .where('id', id)
      .update({ active: false });
  }
} 