import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.TokenHelper || 'default_secret';

export function generateToken(data: any): string {
    const payload = typeof data === 'object' ? data : { data };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}

export function verifyToken(token: string): any | null {
    try {
        const decodedData = jwt.verify(token, secret);
        return decodedData;
    } catch (error) {
        return null;
    }
}
