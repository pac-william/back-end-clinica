import db from "../database/connection";
import { Specialty } from "../models/specialty";
import { MetaBuilder } from "../utils/MetaBuilder";
export class SpecialtyRepository {
    async getAllSpecialties(page: number, size: number, name?: string) {
        const offset = (page - 1) * size;
        let query = db('specialties');

        if (name) {
            query = query.whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]);
        }

        const countResult = await query.clone().count('id as count').first();
        const total = countResult ? Number(countResult.count) : 0;

        const specialties = await query.offset(offset).limit(size);

        return {
            specialties: specialties,
            meta: new MetaBuilder(total, page, size).build()
        };
    }

    async getSpecialtyById(id: number) {
        return db('specialties').where('id', id).first();
    }

    async getSpecialtiesByIds(ids: number[]) {
        return db('specialties').whereIn('id', ids).returning('*');
    }

    async createSpecialty(specialty: Specialty) {
        return db('specialties').insert(specialty);
    }

    async updateSpecialty(id: number, specialty: Specialty) {
        return db('specialties').where('id', id).update(specialty);
    }

    async deleteSpecialty(id: number) {
        return db('specialties').where('id', id).delete();
    }
}
