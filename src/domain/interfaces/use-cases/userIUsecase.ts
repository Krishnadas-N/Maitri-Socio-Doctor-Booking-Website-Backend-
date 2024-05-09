import { EditProfileDto, UserLoginResponse, UsersWithTotalCount } from "../../../models/users.model";
import { IMedicalRecord, User } from "../../entities/User";

export interface IUserUseCase{
    signUp(user:Omit<User,'_id'>): Promise<string | null>;
    login(email: string, password: string): Promise<UserLoginResponse | null>;
    profile(id:string):Promise<User>;
    forgotPassword(email:string):Promise<void>;
    setResetPassword(token:string,password:string):Promise<void>;
    getAllUsers(page: number, pageSize: number, searchQuery: string): Promise<UsersWithTotalCount>;
    BlockOrUnblockUser(id:string):Promise<User>;
    editUserProfile(userId: string, data: EditProfileDto):Promise<User>;
    changeProfilePic(userId:string,image:string):Promise<void>;
    changeUserPassword(userId:string):Promise<void>;
    addMedicalRecord(userId: string, fileUrl: string, title: string, description: string): Promise<IMedicalRecord | null>;
    getUserMedicalRecords(userId: string): Promise<IMedicalRecord>;
    getUserByRefreshToken( refreshToken: string): Promise<string>;
}