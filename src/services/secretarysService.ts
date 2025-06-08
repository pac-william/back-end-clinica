import { Secretary } from '../models/secretary';
import DoctorService from './doctorService';
import { SecretaryRepository } from '../repository/secretaryRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const secretaryRepository = new SecretaryRepository();
const doctorService = new DoctorService();

class SecretaryService {
    async getAllSecretaries(page: number = 1, limit: number = 10, name?: string, email?: string, phone?: string) {
        try {
            return await secretaryRepository.getAllSecretaries(page, limit, name, email, phone);
        } catch (error) {
            return new ErrorResponse('Erro ao buscar secretários', 500).log(error as Error);
        }
    }

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

    async create(secretary: Secretary) {
        try {
            const doctor = await doctorService.getDoctorById(String(secretary.doctor_id));

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
