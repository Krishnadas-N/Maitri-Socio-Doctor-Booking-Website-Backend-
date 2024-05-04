import bcrypt from 'bcryptjs';

export class PasswordUtil{
    static async hashPassword(password:string):Promise<string>{
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    static async comparePasswords(password:string, passwordHash: string): Promise<boolean> {
        console.log(password,passwordHash)
        const passwordMatches  = await bcrypt.compare(password, passwordHash);
        console.log(passwordMatches);
        return passwordMatches; 
    }
}