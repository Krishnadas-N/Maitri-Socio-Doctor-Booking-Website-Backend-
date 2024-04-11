import { UserLoginResponse } from "../../../../models/users.model";
import { User } from "../../../entities/User";

export interface UserLogin{
    execute(email: string, password: string): Promise<UserLoginResponse | null>;
}