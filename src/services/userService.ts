import bcrypt from 'bcrypt';
import { z } from 'zod';
import db from '../database/connection';
import { loginSchema, userSchema } from '../schemas/user.schema';

class UserService {
  async createUser({ email, password, role, role_id }: z.infer<typeof userSchema>): Promise<any> {
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

  async login({ email, password }: z.infer<typeof loginSchema>): Promise<any> {
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

    return {
      success: true,
      data: user,
    };
  }
}

export default UserService;