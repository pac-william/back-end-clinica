import { Doctor, DoctorPaginatedResponse } from "models/doctor";
import db from "../database/connection";

export class DoctorRepository {
    async getAllDoctors(page: number, size: number, specialty?: number[], name?: string): Promise<DoctorPaginatedResponse> {
        const offset = (page - 1) * size;
        let query = db('doctors');

        if (specialty && specialty.length > 0) {
            const specialtyIds = specialty.map(Number);
            query = query.whereRaw('specialties_ids && ?::int[]', [specialtyIds]);
        }

        if (name) {
            query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
        }

        const countResult = await query.clone().count('id as count').first();
        const total = countResult ? Number(countResult.count) : 0;

        const doctors = await query.offset(offset).limit(size);

        return {
            doctors: doctors,
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
        return db('doctors').where('id', id).update(doctor);
    }

    async deleteDoctor(id: string) {
        return db('doctors').where('id', id).delete();
    }
}
