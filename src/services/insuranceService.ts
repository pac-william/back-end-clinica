import { InsuranceDTO } from '../dtos/insurance.dto';
import { InsuranceRepository } from '../repository/insuranceRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const insuranceRepository = new InsuranceRepository();

class InsuranceService {
  /**
   * Lista todos os convênios com filtro opcional por nome.
   * @param filters Filtros de busca
   */
  async getAllInsurances(filters: {
    page: number;
    size: number;
    name?: string;
  }) {
    try {
      const { page, size, name } = filters;
      
      const insurances = await insuranceRepository.getAllInsurances(
        page,
        size,
        name
      );
      
      return insurances;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar convênios', 500).log(error as Error);
    }
  }

  /**
   * Busca todos os convênios sem paginação.
   */
  async getAllInsurancesWithoutPagination() {
    try {
      const insurances = await insuranceRepository.getAllInsurancesWithoutPagination();
      return { insurances };
    } catch (error) {
      return new ErrorResponse('Erro ao buscar convênios', 500).log(error as Error);
    }
  }

  /**
   * Busca um convênio específico pelo ID.
   * @param id ID do convênio
   */
  async getInsuranceById(id: string) {
    try {
      const insurance = await insuranceRepository.getInsuranceById(id);
      
      if (!insurance) {
        return new ErrorResponse('Convênio não encontrado', 404);
      }
      
      return insurance;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar convênio', 500).log(error as Error);
    }
  }

  /**
   * Cria um novo convênio.
   * @param insuranceData Dados do convênio
   */
  async createInsurance(insuranceData: InsuranceDTO) {
    try {
      // Verificar se já existe um convênio com o mesmo nome
      const existingInsurance = await insuranceRepository.getInsuranceByName(insuranceData.name);
      if (existingInsurance) {
        return new ErrorResponse('Já existe um convênio com este nome', 400);
      }

      const insurance = await insuranceRepository.createInsurance(insuranceData);
      return insurance;
    } catch (error) {
      return new ErrorResponse('Erro ao criar convênio', 500).log(error as Error);
    }
  }

  /**
   * Atualiza um convênio existente.
   * @param id ID do convênio
   * @param insuranceData Novos dados do convênio
   */
  async updateInsurance(id: string, insuranceData: Partial<InsuranceDTO>) {
    try {
      // Verificar se o convênio existe
      const existingInsurance = await insuranceRepository.getInsuranceById(id);
      if (!existingInsurance) {
        return new ErrorResponse('Convênio não encontrado', 404);
      }

      // Se estiver alterando o nome, verificar se não conflita com outro
      if (insuranceData.name && insuranceData.name !== existingInsurance.name) {
        const nameExists = await insuranceRepository.getInsuranceByName(insuranceData.name);
        if (nameExists) {
          return new ErrorResponse('Já existe um convênio com este nome', 400);
        }
      }

      const updated = await insuranceRepository.updateInsurance(id, insuranceData);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar convênio', 500).log(error as Error);
    }
  }

  /**
   * Remove um convênio (soft delete).
   * @param id ID do convênio
   */
  async deleteInsurance(id: string) {
    try {
      // Verificar se o convênio existe
      const existingInsurance = await insuranceRepository.getInsuranceById(id);
      if (!existingInsurance) {
        return new ErrorResponse('Convênio não encontrado', 404);
      }

      // Verificar se há pagamentos associados (implementação futura)
      // const paymentsWithInsurance = await paymentRepository.getPaymentsByInsuranceId(parseInt(id));
      // if (paymentsWithInsurance.length > 0) {
      //   return new ErrorResponse('Não é possível remover um convênio que possui pagamentos associados', 400);
      // }

      await insuranceRepository.deleteInsurance(id);
      return { success: true };
    } catch (error) {
      return new ErrorResponse('Erro ao remover convênio', 500).log(error as Error);
    }
  }
}

export default InsuranceService; 