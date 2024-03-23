import bcrypt from 'bcryptjs';

export class PasswordUtil{
    static async HashPassword(password:string):Promise<string>{
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    static async ComparePasswords(password:string, passwordHash: string): Promise<boolean> {
        const passwordMatches  = await bcrypt.compare(password, passwordHash);
        return passwordMatches; 
    }
}