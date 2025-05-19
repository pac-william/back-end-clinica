import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import db from '../database/connection';
import { loginDTO, userDTO } from '../dtos/user.dto';

const SECRET_KEY = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
const TOKEN_EXPIRATION = '1d'; // Token expira em 1 dia

class UserService {
  async getAllUsers(page: number = 1, limit: number = 10, email?: string, role?: string) {
    const offset = (page - 1) * limit;
    
    let query = db('users').select(['id', 'email', 'role', 'role_id', 'created_at', 'updated_at']);
    
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
      meta: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async createUser({ email, password, role, role_id }: z.infer<typeof userDTO>): Promise<any> {
    const existing = await db('users').where('email', email).first();

    if (existing) {
      return {
        success: false,
        data: {
          email: ['Email already in use'],
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db('users')
      .insert({
        email,
        password: hashedPassword,
        role,
        role_id,
      })
      .returning(['id', 'email', 'role', 'role_id']);

    return {
      success: true,
      data: user,
    };
  }

  async login({ email, password }: z.infer<typeof loginDTO>): Promise<any> {
    const user = await db('users').where('email', email).first();

    if (!user) {
      return {
        success: false,
        data: {
          email: ['User not found'],
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        data: {
          password: ['Invalid password'],
        },
      };
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      SECRET_KEY,
      {
        expiresIn: TOKEN_EXPIRATION
      }
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          role_id: user.role_id
        },
        token
      },
    };
  }
}

export default UserService;