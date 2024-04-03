import { User } from "../../../entities/User";

export interface userUseCase{
    profile(id:string):Promise<User>;
    forgotPassword(email:string):Promise<void>;
    setResetPassword(token:string,password:string):Promise<void>;
}