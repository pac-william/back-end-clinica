import db from "../database/connection";
import { Secretary } from "../models/secretary";
import { MetaBuilder } from "../utils/MetaBuilder";

export class SecretaryRepository {
  /**
   * Retorna todos os secretários com paginação e filtros opcionais.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param name Filtro por nome
   * @param email Filtro por email
   * @param phone Filtro por telefone
   */
  async getAllSecretaries(
    page: number,
    size: number,
    name?: string,
    email?: string,
    phone?: string
  ) {
    const offset = (page - 1) * size;
    
    let query = db('secretarys');
    
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
    
    const secretaries = await query.select('*').offset(offset).limit(size);
    
    return {
      data: secretaries,
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca um secretário pelo seu ID.
   * @param id ID do secretário
   */
  async getById(id: string) {
    return db('secretarys').where('id', id).first();
  }

  /**
   * Cria um novo secretário.
   * @param secretary Dados do secretário
   */
  async create(secretary: Secretary) {
    const [secretarySaved] = await db('secretarys').insert(secretary).returning('*');
    return secretarySaved;
  }

  /**
   * Atualiza os dados de um secretário.
   * @param id ID do secretário
   * @param name Nome atualizado
   * @param email Email atualizado
   * @param phone Telefone atualizado
   */
  async update(id: string, name: string, email: string, phone: string) {
    return db('secretarys')
      .where('id', id)
      .update({ name, email, phone })
      .returning('*');
  }

  /**
   * Remove um secretário do sistema.
   * @param id ID do secretário
   */
  async delete(id: string) {
    return db('secretarys').where('id', id).delete();
  }
} 