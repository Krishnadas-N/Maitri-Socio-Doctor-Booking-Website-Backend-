import { User } from "../../../entities/User";

export interface UserSignup{
    execute(user:Omit<User,'_id'>): Promise<string | null>;
}