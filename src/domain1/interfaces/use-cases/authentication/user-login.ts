import { User } from "../../../entities/User";

export interface UserLogin{
    execute(email: string, password: string): Promise< Omit<User,'password'> | null>;
}