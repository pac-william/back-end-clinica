import { Secretary } from '../models/secretary';
import { SecretaryRepository } from '../repository/secretaryRepository';
import { ErrorResponse } from '../utils/ErrorResponse';
import DoctorService from './doctorService';

const secretaryRepository = new SecretaryRepository();
const doctorService = new DoctorService();

// Service responsável pelas operações de negócio relacionadas às secretárias
class SecretaryService {
    async getAllSecretaries(page: number = 1, size: number = 10, name?: string, email?: string, phone?: string) {
        try {
            return await secretaryRepository.getAllSecretaries(page, size, name, email, phone);
        } catch (error) {
            return new ErrorResponse('Erro ao buscar secretários', 500).log(error as Error);
        }
    }

    /**
     * Busca uma secretária pelo id.
     * @param id Id da secretária
     * @returns A secretária encontrada ou null
     */
    async getById(id: string) {
        try {
            const secretary = await secretaryRepository.getById(id);
            
            if (!secretary) {
                return new ErrorResponse('Secretário não encontrado', 404);
            }
            
            return secretary;
        } catch (error) {
            return new ErrorResponse('Erro ao buscar secretário', 500).log(error as Error);
        }
    }

    /**
     * Cria uma nova secretária.
     * @param secretary Dados da secretária
     * @returns A secretária criada ou erro de validação
     */
    async create(secretary: Secretary) {
        try {
            const doctor = await doctorService.getDoctorById(String(secretary.user_id));

            if (!doctor || doctor instanceof ErrorResponse) {
                return {
                    message: "Médico não encontrado",
                    success: false
                };
            }

            const secretarySaved = await secretaryRepository.create(secretary);
            
            return {
                success: true,
                data: secretarySaved
            };
        } catch (error) {
            return new ErrorResponse('Erro ao criar secretário', 500).log(error as Error);
        }
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
        try {
            const secretary = await secretaryRepository.getById(id);
            
            if (!secretary) {
                return new ErrorResponse('Secretário não encontrado', 404);
            }
            
            const updatedSecretary = await secretaryRepository.update(id, name, email, phone);
            return updatedSecretary;
        } catch (error) {
            return new ErrorResponse('Erro ao atualizar secretário', 500).log(error as Error);
        }
    }

    /**
     * Remove uma secretária pelo id.
     * @param id Id da secretária
     * @returns Resultado da operação
     */
    async delete(id: string) {
        try {
            const secretary = await secretaryRepository.getById(id);
            
            if (!secretary) {
                return new ErrorResponse('Secretário não encontrado', 404);
            }
            
            await secretaryRepository.delete(id);
            return { success: true, message: 'Secretário removido com sucesso' };
        } catch (error) {
            return new ErrorResponse('Erro ao excluir secretário', 500).log(error as Error);
        }
    }
}

export default SecretaryService;
