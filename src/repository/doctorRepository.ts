import { Doctor, DoctorPaginatedResponse } from "models/doctor";
import db from "../database/connection";
import { MetaBuilder } from "../utils/MetaBuilder";

export class DoctorRepository {
    async getAllDoctors(page: number, size: number, specialty?: number[], name?: string): Promise<DoctorPaginatedResponse> {
        const offset = (page - 1) * size;
        let queryDoctor = db('doctors');
        let querySpecialty = db('specialty_doctor');

        if (specialty && specialty.length > 0) {
            const specialtyIds = specialty.map(Number);
            querySpecialty = querySpecialty.whereIn('specialty_id', specialtyIds);

            const doctorIds = db('specialty_doctor')
                .whereIn('specialty_id', specialtyIds)
                .select('doctor_id');

            queryDoctor = queryDoctor.whereIn('id', doctorIds);
        }

        if (name) {
            queryDoctor = queryDoctor.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
        }

        const countResult = await queryDoctor.clone().count('id as count').first();
        const total = countResult ? Number(countResult.count) : 0;

        const doctors = await queryDoctor.offset(offset).limit(size);

        const specialties = await db('doctor_specialties')
            .join('specialty', 'specialty.id', 'doctor_specialties.specialty_id')
            .whereIn('doctor_id', doctors.map(doctor => doctor.id))
            .select('doctor_specialties.doctor_id', 'doctor_specialties.specialty_id', 'specialty.name as specialty_name');

        return {
            doctors: doctors.map(doctor => ({
                ...doctor,
                specialties: specialties.filter(specialty => specialty.doctor_id === doctor.id).map(specialty => specialty.specialty_id)
            })),
            meta: new MetaBuilder(total, page, size).build()
        };
    }

    async getFirstWhere(crm?: string, email?: string) {
        return db('doctors').where('crm', crm).orWhere('email', email).first();
    }

    async getDoctorById(id: string) {
        try {
            const doctor = await db('doctors').where('id', id).first();
            const specialties = await db('doctor_specialties')
                .join('specialty', 'specialty.id', 'doctor_specialties.specialty_id')
                .where('doctor_id', id)
                .select('doctor_specialties.doctor_id', 'doctor_specialties.specialty_id', 'specialty.name as specialty_name');

            return {
                ...doctor,
                specialties: specialties.map(specialty => specialty.specialty_id)
            };
        } catch (error) {
            console.error("Erro ao buscar médico:", error);
            return {
                message: "Erro ao buscar informações do médico",
                error: {
                    errorType: error instanceof Error ? error.name : "Erro desconhecido",
                    errorMessage: error instanceof Error ? error.message : String(error),
                    errorLocation: "DoctorRepository.getDoctorById",
                    doctorId: id
                }
            };
        }
    }

    async createDoctor(doctor: Doctor) {
        return db('doctors').insert(doctor);
    }

    async updateDoctor(id: string, doctor: Doctor) {
        return db('doctors').where('id', id).update(doctor).returning('*');
    }

    async deleteDoctor(id: string) {
        return db('doctors').where('id', id).delete();
    }
}
