import { makeAppoinmentReqModel } from "../../../models/consultation.model";
import { EditProfileDto, UsersWithTotalCount } from "../../../models/users.model";
import { IMedicalRecord, User } from "../../entities/User";

export interface IUserRepository {
    findByEmail(email:string):Promise <User | null>;
    findById(id: string): Promise<User | null>;
    save(user:User): Promise<User> ;
    getUser(userId:string):Promise<User>;
    markAsVerified(email:string):Promise<void>;
    setResetToken(email: string): Promise<void>;
    findResetTokenAndSavePassword(token: string, password: string): Promise<void>;
    getAllUsers(page: number, pageSize: number, searchQuery: string): Promise<UsersWithTotalCount>;
    toggleBlockUser(id:string): Promise<User>;
    updateUserProfile(userId: string, data: EditProfileDto):Promise<User>;
    changeUserProfilePic(userId:string,image:string):Promise<void>;
    sendUserChangePasswordLink(userId:string):Promise<void>;
    addMedicalRecord(userId: string, fileUrl: string, title: string, description: string): Promise<IMedicalRecord | null>;
    getMedicalRecords(userId: string): Promise<IMedicalRecord>
}