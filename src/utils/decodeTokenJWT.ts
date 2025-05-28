import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const getUserRoleFromToken = (token: string): string => {
    try {
        if (!SECRET_KEY) {
            throw new Error('Chave secreta não configurada');
        }
        const decoded = jwt.verify(token, SECRET_KEY) as { role: string };
        return decoded.role;
    } catch (error) {
        throw new Error('Token inválido');
    }
}