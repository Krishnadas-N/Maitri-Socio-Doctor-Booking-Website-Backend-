import { EditProfileDto, UsersWithTotalCount } from "../../../../models/users.model";
import { User } from "../../../entities/User";

export interface userUseCase{
    profile(id:string):Promise<User>;
    forgotPassword(email:string):Promise<void>;
    setResetPassword(token:string,password:string):Promise<void>;
    getAllUsers(page: number, pageSize: number, searchQuery: string): Promise<UsersWithTotalCount>;
    BlockOrUnblockUser(id:string):Promise<User>;
    editUserProfile(userId: string, data: EditProfileDto):Promise<User>;
    changeProfilePic(userId:string,image:string):Promise<void>;
    changeUserPassword(userId:string):Promise<void>;
    
}