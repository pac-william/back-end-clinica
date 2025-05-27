import { Doctor, DoctorPaginatedResponse } from "models/doctor";
import db from "../database/connection";

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
        const specialties = await db('specialty_doctor')
            .join('specialties', 'specialties.id', 'specialty_doctor.specialty_id')
            .whereIn('doctor_id', doctors.map(doctor => doctor.id))
            .select('specialty_doctor.doctor_id', 'specialty_doctor.specialty_id', 'specialties.name as specialty_name');
            
        return {
            doctors: doctors.map(doctor => ({
                ...doctor,
                specialties: specialties.filter(specialty => specialty.doctor_id === doctor.id).map(specialty => specialty.specialty_id)
            })),
            meta: {
                total: total,
                page: page,
                size: size,
            }
        };
    }

    async getFirstWhere(crm?: string, email?: string) {
        return db('doctors').where('crm', crm).orWhere('email', email).first();
    }

    async getDoctorById(id: string) {
        return db('doctors').where('id', id).first();
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
