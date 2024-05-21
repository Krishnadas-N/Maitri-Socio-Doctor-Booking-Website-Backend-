import { IMedicalRecord, User } from "../../../domain/entities/User";
import { CategorizedDoctorsResult } from "../../../models/common.models";
import { EditProfileDto, UserSocialRegister, UsersWithTotalCount } from "../../../models/users.model";

export interface userModelIDataSource{
    create(user:Omit<User,'_id'>):Promise<User>;
    getAll(skip?:number,limit?:number):Promise<Array<User>>;
    findByEmail(email:string):Promise<User | null>;
    findById(userId:string):Promise<User | null>;
    updateOne(id:string,data:object):Promise<User | null> ;
    deleteOne(id:string): Promise<boolean>; 
    verifyUser(email:string):Promise<void>;
    saveResetToken(email:string,token:string,):Promise<void>;
    findResetTokenAndSavePassword(token:string,password:string):Promise<void>;
    toggleBlockUser(id:string):Promise<User>;
    editProfile(userId: string, data: EditProfileDto):Promise<User>;
    changeProfilePic(userId:string,image:string):Promise<void>;
    addMedicalRecord(userId: string, fileUrl: string, title: string, description: string): Promise<IMedicalRecord | null>;
    getMedicalRecords(userId: string): Promise<IMedicalRecord>;
    saveRefreshToken(email:string,refreshToken:string):Promise<void>;
    getUserByRefreshToken( refreshToken: string): Promise<User> ;
    deleteMedicalRecord(recordId: string, userId: string): Promise<void>;
    socialRegister(user:UserSocialRegister): Promise<User>;
    getCategorizedDoctors():Promise<CategorizedDoctorsResult>;

}