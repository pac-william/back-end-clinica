import Utils from '../utils/utils';
import { PatientDTO } from '../dtos/patient.dto';
import { Patient, PatientPaginatedResponse } from '../models/patient';
import { PatientRepository } from '../repository/patientRepository';
import { ErrorResponse } from '../utils/ErrorResponse';

const patientRepository = new PatientRepository();

class PatientService {
    async getAllPatients(page: number, size: number, name?: string, email?: string, phone?: string): Promise<PatientPaginatedResponse | ErrorResponse> {
        try {
            return await patientRepository.getAllPatients(page, size, name, email, phone);
        } catch (error) {
            return new ErrorResponse('Erro ao buscar pacientes', 500).log(error as Error);
        }
    }

    async getPatientById(id: string) {
        try {
            const patient = await patientRepository.getPatientById(id);
            
            if (!patient) {
                return new ErrorResponse('Paciente não encontrado', 404);
            }
            
            return patient;
        } catch (error) {
            return new ErrorResponse('Erro ao buscar paciente', 500).log(error as Error);
        }
    }

    async createPatient(patient: Patient) {
        try {
            if(!Utils.checkCPF(patient.cpf)) {
                return {
                    success: false,
                    message: 'CPF inválido'
                };
            }

            patient.cpf = patient.cpf.length > 11 ? Utils.removeMask(patient.cpf) : patient.cpf;
            
            const existingPatient = await patientRepository.getByCpf(patient.cpf);
            if(existingPatient) {
                return {
                    message: "Paciente com este CPF já existe",
                    success: false
                };
            }

            const patientResult = await patientRepository.createPatient(patient);
            return {
                success: true,
                data: patientResult
            };
        } catch (error) {
            return new ErrorResponse('Erro ao criar paciente', 500).log(error as Error);
        }
    }

    async updatePatient(id: string, patient: PatientDTO) {
        try {
            const existingPatient = await patientRepository.getPatientById(id);
            
            if (!existingPatient) {
                return new ErrorResponse('Paciente não encontrado', 404);
            }
            
            const patientResult = await patientRepository.updatePatient(id, patient);
            return patientResult;
        } catch (error) {
            return new ErrorResponse('Erro ao atualizar paciente', 500).log(error as Error);
        }
    }

    async deletePatient(id: string) {
        try {
            const existingPatient = await patientRepository.getPatientById(id);
            
            if (!existingPatient) {
                return new ErrorResponse('Paciente não encontrado', 404);
            }
            
            await patientRepository.deletePatient(id);
            return { success: true, message: 'Paciente removido com sucesso' };
        } catch (error) {
            return new ErrorResponse('Erro ao excluir paciente', 500).log(error as Error);
        }
    }

    async getByCpf(cpf: string) {
        try {
            return await patientRepository.getByCpf(cpf);
        } catch (error) {
            return new ErrorResponse('Erro ao buscar paciente por CPF', 500).log(error as Error);
        }
    }
}

export default PatientService;
