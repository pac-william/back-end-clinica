import Utils from '../utils/utils';
import db from '../database/connection';
import { PatientDTO } from '../dtos/patient.dto';
import { Patient, PatientPaginatedResponse } from '../models/patient';

// Service responsável pelas operações de negócio relacionadas aos pacientes
class PatientService {
    /**
     * Lista pacientes com filtros e paginação.
     * @param page Número da página
     * @param size Tamanho da página
     * @param name Nome do paciente (opcional)
     * @param email Email do paciente (opcional)
     * @param phone Telefone do paciente (opcional)
     * @returns Lista paginada de pacientes
     */
    async getAllPatients(page: number, size: number, name?: string, email?: string, phone?: string): Promise<PatientPaginatedResponse> {
        const offset = (page - 1) * size;

        let query = db('patients');

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

        const patients = await query.select('*').offset(offset).limit(size);

        return {
            patients: patients,
            meta: {
                total: total,
                page: page,
                size: size,
            }
        };
    }

    /**
     * Busca um paciente pelo id.
     * @param id Id do paciente
     * @returns O paciente encontrado ou null
     */
    async getPatientById(id: string) {
        const patient = await db('patients').where('id', id).first();
        return patient;
    }

    /**
     * Cria um novo paciente.
     * @param patient Dados do paciente
     * @returns O paciente criado ou erro de validação
     */
    async createPatient(patient: Patient) {
        if(!Utils.checkCPF(patient.cpf)) {
            return {
                success:false,
                message: 'Invalid CPF'
            }
        };

        patient.cpf = patient.cpf.length > 11 ? Utils.removeMask(patient.cpf) : patient.cpf;
        if(await this.getByCpf(patient.cpf)) {
            return  {
                message: "Patient with this CPF already exists",
                success: false
            };
        }

        const [patientResult] = await db('patients').insert(patient).returning('*');
        return {
            success: true,
            data: patientResult
        };
    }

    /**
     * Atualiza os dados de um paciente existente.
     * @param id Id do paciente
     * @param patient Dados atualizados do paciente
     * @returns O paciente atualizado
     */
    async updatePatient(id: string, patient: PatientDTO) {
        const [patientResult] = await db('patients').where('id', id).update({ name: patient.name, address: patient.address, phone: patient.phone, cpf: patient.cpf }).returning('*');
        return patientResult;
    }

    /**
     * Remove um paciente pelo id.
     * @param id Id do paciente
     */
    async deletePatient(id: string) {
        await db('patients').where('id', id).delete();
    }

    /**
     * Busca um paciente pelo CPF.
     * @param cpf CPF do paciente
     * @returns O paciente encontrado ou null
     */
    async getByCpf(cpf: string) {
        const patient = await db('patients').where('cpf', cpf).first();
        return patient;
    }
}

export default PatientService;
