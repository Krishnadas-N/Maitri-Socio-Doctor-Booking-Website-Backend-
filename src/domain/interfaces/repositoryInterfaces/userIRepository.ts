import { CategorizedDoctorsResult } from "../../../models/common.models";
import { makeAppoinmentReqModel } from "../../../models/consultation.model";
import { EditProfileDto, UserSocialRegister, UsersWithTotalCount } from "../../../models/users.model";
import { IMedicalRecord, User } from "../../entities/User";

export interface IUserRepository {
    findByEmail(email:string):Promise <User | null>;
    findById(id: string): Promise<User | null>;
    save(user:User): Promise<User> ;
    getUser(userId:string):Promise<User>;
    markAsVerified(email:string):Promise<void>;
    setResetToken(email: string): Promise<void>;
    findResetTokenAndSavePassword(token: string, password: string): Promise<void>;
    toggleBlockUser(id:string): Promise<User>;
    updateUserProfile(userId: string, data: EditProfileDto):Promise<User>;
    changeUserProfilePic(userId:string,image:string):Promise<void>;
    sendUserChangePasswordLink(userId:string):Promise<void>;
    addMedicalRecord(userId: string, fileUrl: string, title: string, description: string): Promise<IMedicalRecord | null>;
    getMedicalRecords(userId: string): Promise<IMedicalRecord>;
    saveRefreshToken(email:string,refreshToken:string):Promise<void>;
    getUserByRefreshToken( refreshToken: string): Promise<User> ;
    deleteMedicalRecord(recordId: string, userId: string): Promise<void> ;
    socialRegister(user:UserSocialRegister): Promise<User>;
    getCategorizedDoctors():Promise<CategorizedDoctorsResult>
}