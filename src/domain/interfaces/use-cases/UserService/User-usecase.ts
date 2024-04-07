import { UsersWithTotalCount } from "../../../../models/users.model";
import { User } from "../../../entities/User";

export interface userUseCase{
    profile(id:string):Promise<User>;
    forgotPassword(email:string):Promise<void>;
    setResetPassword(token:string,password:string):Promise<void>;
    getAllUsers(page: number, pageSize: number, searchQuery: string): Promise<UsersWithTotalCount>;
    BlockOrUnblockUser(id:string):Promise<User>;
}