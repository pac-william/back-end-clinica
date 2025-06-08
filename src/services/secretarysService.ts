import { Secretary } from 'models/secretary';
import db from '../database/connection';
import DoctorService from './doctorService';

// Service responsável pelas operações de negócio relacionadas às secretárias
class SecretaryService {
    /**
     * Lista secretárias com filtros e paginação.
     * @param page Número da página
     * @param limit Tamanho da página
     * @param name Nome da secretária (opcional)
     * @param email Email da secretária (opcional)
     * @param phone Telefone da secretária (opcional)
     * @returns Lista paginada de secretárias
     */
    async getAllSecretaries(page: number = 1, limit: number = 10, name?: string, email?: string, phone?: string): Promise<{ data: Secretary[]; meta: { total: number, page: number, limit: number, totalPages: number } }> {
        const offset = (page - 1) * limit;
        
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
        
        const secretaries = await query.select('*').offset(offset).limit(limit);
        
        return {
            data: secretaries,
            meta: {
                total: total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Busca uma secretária pelo id.
     * @param id Id da secretária
     * @returns A secretária encontrada ou null
     */
    async getById(id: string) {
        const secretary = await db('secretarys').where('id', id).first();
        return secretary;
    }

    /**
     * Cria uma nova secretária.
     * @param secretary Dados da secretária
     * @returns A secretária criada ou erro de validação
     */
    async create(secretary: Secretary) {
        const doctorService = new DoctorService();
        const doctor = await doctorService.getDoctorById(String(secretary.doctor_id));

        if (!doctor) {
            return {
                message: "Doctor not found",
                success: false
            };
        }

        const [secretarySaved] = await db('secretarys').insert(secretary).returning('*');
        return {
            success: true,
            data: secretarySaved
        };
    }

    /**
     * Atualiza os dados de uma secretária existente.
     * @param id Id da secretária
     * @param name Nome da secretária
     * @param email Email da secretária
     * @param phone Telefone da secretária
     * @returns A secretária atualizada
     */
    async update(id: string, name: string, email: string, phone: string) {
        const secretary = await db('secretarys').where('id', id).update({ name, email, phone });
        return secretary;
    }

    /**
     * Remove uma secretária pelo id.
     * @param id Id da secretária
     * @returns Resultado da operação
     */
    async delete(id: string) {
        const secretary = await db('secretarys').where('id', id).delete();
        return secretary;
    }
}

export default SecretaryService;
