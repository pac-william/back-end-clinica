import db from "../database/connection";
import { PaymentDTO } from "../dtos/payment.dto";
import { MetaBuilder } from "../utils/MetaBuilder";

export class PaymentRepository {
  /**
   * Retorna uma lista paginada de pagamentos com filtros opcionais.
   * @param page Página atual
   * @param size Quantidade de itens por página
   * @param appointmentId Filtro por ID de consulta
   * @param status Filtro por status
   * @param startDate Data inicial para filtro
   * @param endDate Data final para filtro
   */
  async getAllPayments(
    page: number,
    size: number,
    appointmentId?: number,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const offset = (page - 1) * size;
    let query = db('payments');

    if (appointmentId) {
      query = query.where('appointment_id', appointmentId);
    }

    if (status) {
      query = query.where('status', status);
    }

    if (startDate && endDate) {
      query = query.whereBetween('payment_date', [startDate, endDate]);
    } else if (startDate) {
      query = query.where('payment_date', '>=', startDate);
    } else if (endDate) {
      query = query.where('payment_date', '<=', endDate);
    }

    const countResult = await query.clone().count('id as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    const payments = await query.offset(offset).limit(size);

    // Carrega informações adicionais das consultas
    const appointmentIds = payments.map(p => p.appointment_id);
    const appointments = await db('appointments')
      .whereIn('id', appointmentIds)
      .select('id', 'patient_id', 'doctor_id', 'date');

    return {
      payments: payments.map(payment => ({
        ...payment,
        appointment: appointments.find(a => a.id === payment.appointment_id) || null
      })),
      meta: new MetaBuilder(total, page, size).build()
    };
  }

  /**
   * Busca um pagamento pelo seu ID.
   * @param id ID do pagamento
   */
  async getPaymentById(id: string) {
    const payment = await db('payments').where('id', id).first();
    
    if (!payment) {
      return null;
    }

    // Busca informações da consulta relacionada
    const appointment = await db('appointments')
      .where('id', payment.appointment_id)
      .first();

    return {
      ...payment,
      appointment: appointment || null
    };
  }

  /**
   * Busca pagamentos por ID de consulta.
   * @param appointmentId ID da consulta
   */
  async getPaymentsByAppointmentId(appointmentId: number) {
    return db('payments').where('appointment_id', appointmentId);
  }

  /**
   * Cria um novo pagamento.
   * @param payment Dados do pagamento
   */
  async createPayment(payment: PaymentDTO) {
    const [result] = await db('payments').insert({
      appointment_id: payment.appointmentId,
      amount: payment.amount,
      payment_method: payment.paymentMethod,
      payment_date: payment.paymentDate || new Date(),
      status: payment.status,
      insurance_id: payment.insuranceId
    }).returning('*');

    return result;
  }

  /**
   * Atualiza um pagamento existente.
   * @param id ID do pagamento
   * @param payment Dados atualizados
   */
  async updatePayment(id: string, payment: Partial<PaymentDTO>) {
    const [result] = await db('payments')
      .where('id', id)
      .update({
        ...(payment.amount !== undefined && { amount: payment.amount }),
        ...(payment.paymentMethod && { payment_method: payment.paymentMethod }),
        ...(payment.paymentDate && { payment_date: payment.paymentDate }),
        ...(payment.status && { status: payment.status }),
        ...(payment.insuranceId !== undefined && { insurance_id: payment.insuranceId })
      })
      .returning('*');

    return result;
  }

  /**
   * Atualiza o status de um pagamento.
   * @param id ID do pagamento
   * @param status Novo status
   */
  async updatePaymentStatus(id: string, status: string) {
    const [result] = await db('payments')
      .where('id', id)
      .update({ status })
      .returning('*');

    return result;
  }

  /**
   * Remove um pagamento (soft delete marcando como ESTORNADO).
   * @param id ID do pagamento
   */
  async deletePayment(id: string) {
    return db('payments')
      .where('id', id)
      .update({ status: 'ESTORNADO' });
  }
} 