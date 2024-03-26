import { User } from "../../../entities/User";

export interface userUseCase{
    profile(id:string):Promise<User>
}