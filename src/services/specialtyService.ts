import { z } from 'zod';
import { SpecialtyDTO } from '../dtos/specialty.dto';
import { Specialty } from '../models/specialty';
import { SpecialtyRepository } from '../repository/specialtyRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const specialtyRepository = new SpecialtyRepository();

// Service responsável pelas operações de negócio relacionadas às especialidades
class SpecialtyService {
  /**
   * Cria uma nova especialidade.
   * @param name Nome da especialidade
   * @returns A especialidade criada ou erro de validação
   */
  async createSpecialty({ name }: z.infer<typeof SpecialtyDTO>): Promise<any> {
    try {
      // Verificar se já existe uma especialidade com o mesmo nome
      const specialties = await specialtyRepository.getAllSpecialties(1, 1, name);
      
      if (specialties.specialties.length > 0 && specialties.specialties[0].name.toLowerCase() === name.toLowerCase()) {
        return {
          success: false,
          data: {
            name: ['Nome já está em uso'],
          },
        };
      }

      // Criar a especialidade
      const specialty = await specialtyRepository.createSpecialty({ 
        name 
      } as Specialty);

      return {
        success: true,
        data: specialty,
      };
    } catch (error) {
      return new ErrorResponse('Erro ao criar especialidade', 500).log(error as Error);
    }
  }

  /**
   * Lista especialidades com filtros e paginação.
   * @param page Número da página
   * @param limit Tamanho da página
   * @param name Nome da especialidade (opcional)
   * @returns Lista paginada de especialidades
   */
  async getAllSpecialties(page: number = 1, limit: number = 10, name?: string) {
    try {
      return await specialtyRepository.getAllSpecialties(page, limit, name);
    } catch (error) {
      return new ErrorResponse('Erro ao buscar especialidades', 500).log(error as Error);
    }
  }

  /**
   * Busca uma especialidade pelo id.
   * @param id Id da especialidade
   * @returns A especialidade encontrada ou erro
   */
  async getSpecialtyById(id: number) {
    try {
      const specialty = await specialtyRepository.getSpecialtyById(id);

      if (!specialty) {
        return new ErrorResponse('Especialidade não encontrada', 404);
      }

      return specialty;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar especialidade', 500).log(error as Error);
    }
  }

  /**
   * Atualiza os dados de uma especialidade existente.
   * @param id Id da especialidade
   * @param name Nome atualizado da especialidade
   * @returns A especialidade atualizada ou erro
   */
  async updateSpecialty(id: number, { name }: { name: string }) {
    try {
      const specialty = await specialtyRepository.getSpecialtyById(id);

      if (!specialty) {
        return new ErrorResponse('Especialidade não encontrada', 404);
      }

      const updated = await specialtyRepository.updateSpecialty(id, { 
        name 
      } as Specialty);
      
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar especialidade', 500).log(error as Error);
    }
  }

  /**
   * Remove uma especialidade pelo id.
   * @param id Id da especialidade
   * @returns Resultado da operação ou erro
   */
  async deleteSpecialty(id: number) {
    try {
      const specialty = await specialtyRepository.getSpecialtyById(id);

      if (!specialty) {
        return new ErrorResponse('Especialidade não encontrada', 404);
      }

      await specialtyRepository.deleteSpecialty(id);
      return { success: true };
    } catch (error) {
      return new ErrorResponse('Erro ao excluir especialidade', 500).log(error as Error);
    }
  }
}

export default SpecialtyService;