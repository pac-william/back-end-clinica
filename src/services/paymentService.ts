import { PaymentDTO } from '../dtos/payment.dto';
import { AppointmentRepository } from '../repository/appointmentRepository';
import { InsuranceRepository } from '../repository/insuranceRepository';
import { PaymentRepository } from '../repository/paymentRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const paymentRepository = new PaymentRepository();
const appointmentRepository = new AppointmentRepository();
const insuranceRepository = new InsuranceRepository();

class PaymentService {
  /**
   * Lista todos os pagamentos com filtros opcionais.
   * @param filters Filtros de busca
   */
  async getAllPayments(filters: {
    page: number;
    size: number;
    appointmentId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      const { page, size, appointmentId, status, startDate, endDate } = filters;

      // Converte datas se fornecidas
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      const payments = await paymentRepository.getAllPayments(
        page,
        size,
        appointmentId,
        status,
        parsedStartDate,
        parsedEndDate
      );

      return payments;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar pagamentos', 500).log(error as Error);
    }
  }

  /**
   * Busca um pagamento específico pelo ID.
   * @param id ID do pagamento
   */
  async getPaymentById(id: string) {
    try {
      const payment = await paymentRepository.getPaymentById(id);

      if (!payment) {
        return new ErrorResponse('Pagamento não encontrado', 404);
      }

      return payment;
    } catch (error) {
      return new ErrorResponse('Erro ao buscar pagamento', 500).log(error as Error);
    }
  }

  /**
   * Busca pagamentos por ID de consulta.
   * @param appointmentId ID da consulta
   */
  async getPaymentsByAppointmentId(appointmentId: number) {
    try {
      // Verificar se a consulta existe
      const appointment = await appointmentRepository.getAppointmentById(appointmentId.toString());
      if (!appointment) {
        return new ErrorResponse('Consulta não encontrada', 404);
      }

      const payments = await paymentRepository.getPaymentsByAppointmentId(appointmentId);
      return { payments };
    } catch (error) {
      return new ErrorResponse('Erro ao buscar pagamentos da consulta', 500).log(error as Error);
    }
  }

  /**
   * Cria um novo pagamento.
   * @param paymentData Dados do pagamento
   */
  async createPayment(paymentData: PaymentDTO) {
    try {
      // Verificar se a consulta existe
      const appointment = await appointmentRepository.getAppointmentById(paymentData.appointmentId.toString());
      if (!appointment) {
        return new ErrorResponse('Consulta não encontrada', 404);
      }

      // Se for pagamento por convênio, verificar se o convênio existe
      if (paymentData.paymentMethod === 'CONVENIO' && paymentData.insuranceId) {
        const insurance = await insuranceRepository.getInsuranceById(paymentData.insuranceId.toString());
        if (!insurance) {
          return new ErrorResponse('Convênio não encontrado', 404);
        }
      }

      const payment = await paymentRepository.createPayment(paymentData);
      return payment;
    } catch (error) {
      return new ErrorResponse('Erro ao criar pagamento', 500).log(error as Error);
    }
  }

  /**
   * Atualiza um pagamento existente.
   * @param id ID do pagamento
   * @param paymentData Novos dados do pagamento
   */
  async updatePayment(id: string, paymentData: Partial<PaymentDTO>) {
    try {
      // Verificar se o pagamento existe
      const existingPayment = await paymentRepository.getPaymentById(id);
      if (!existingPayment) {
        return new ErrorResponse('Pagamento não encontrado', 404);
      }

      // Se estiver alterando o convênio, verificar se existe
      if (paymentData.paymentMethod === 'CONVENIO' && paymentData.insuranceId) {
        const insurance = await insuranceRepository.getInsuranceById(paymentData.insuranceId.toString());
        if (!insurance) {
          return new ErrorResponse('Convênio não encontrado', 404);
        }
      }

      const updated = await paymentRepository.updatePayment(id, paymentData);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar pagamento', 500).log(error as Error);
    }
  }

  /**
   * Atualiza o status de um pagamento.
   * @param id ID do pagamento
   * @param status Novo status
   */
  async updatePaymentStatus(id: string, status: string) {
    try {
      // Verificar se o pagamento existe
      const existingPayment = await paymentRepository.getPaymentById(id);
      if (!existingPayment) {
        return new ErrorResponse('Pagamento não encontrado', 404);
      }

      // Validar o status
      const validStatuses = ['PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO'];
      if (!validStatuses.includes(status)) {
        return new ErrorResponse('Status inválido', 400);
      }

      const updated = await paymentRepository.updatePaymentStatus(id, status);
      return updated;
    } catch (error) {
      return new ErrorResponse('Erro ao atualizar status do pagamento', 500).log(error as Error);
    }
  }

  /**
   * Remove um pagamento (soft delete).
   * @param id ID do pagamento
   */
  async deletePayment(id: string) {
    try {
      // Verificar se o pagamento existe
      const existingPayment = await paymentRepository.getPaymentById(id);
      if (!existingPayment) {
        return new ErrorResponse('Pagamento não encontrado', 404);
      }

      await paymentRepository.deletePayment(id);
      return { success: true };
    } catch (error) {
      return new ErrorResponse('Erro ao estornar pagamento', 500).log(error as Error);
    }
  }
}

export default PaymentService;
