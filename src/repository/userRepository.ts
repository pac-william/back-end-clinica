import { userDTO } from "dtos/user.dto";
import { z } from "zod";
import db from "../database/connection";
import { User } from "../models/user";
import { MetaBuilder } from "../utils/MetaBuilder";

export class UserRepository {
    async getAllUsers(page: number, limit: number, email?: string, role?: string) {
        const offset = (page - 1) * limit;

        let query = db('users').select(['id', 'email', 'role', 'created_at', 'updated_at']);

        if (email) {
            query = query.whereRaw('LOWER(email) LIKE LOWER(?)', [`%${email}%`]);
        }

        if (role) {
            query = query.whereRaw('LOWER(role) = LOWER(?)', [role]);
        }

        const countResult = await query.clone().count('id as count').first();
        const total = countResult ? Number(countResult.count) : 0;

        const users = await query.offset(offset).limit(limit);

        return {
            data: users,
            meta: new MetaBuilder(total, page, limit).build()
        };
    }

    async getUserById(id: number) {
        return db('users')
            .where('id', id)
            .select(['id', 'email', 'role', 'created_at', 'updated_at'])
            .first();
    }

    async getUserByEmail(email: string) {
        return db('users')
            .where('email', email)
            .first();
    }

    async createUser(userData: z.infer<typeof userDTO>) {
        const [user] = await db('users')
            .insert({
                email: userData.email,
                password: userData.password,
                role: userData.role,
            })
            .returning(['id', 'email', 'role']);

        return user;
    }

    async updateUser(id: number, userData: Partial<User>) {
        const [user] = await db('users')
            .where('id', id)
            .update(userData)
            .returning(['id', 'email', 'role', 'created_at', 'updated_at']);

        return user;
    }

    async deleteUser(id: number) {
        return db('users').where('id', id).delete();
    }
} 