import { CategorizedDoctorsResult } from "../../../models/common.models";
import { EditProfileDto, UserLoginResponse, UserSocialRegister, UsersWithTotalCount } from "../../../models/users.model";
import { IMedicalRecord, User } from "../../entities/User";

export interface IUserUseCase{
    signUp(user:Omit<User,'_id'>): Promise<string | null>;
    login(email: string, password: string): Promise<UserLoginResponse | null>;
    socialLogin(email: string): Promise<UserLoginResponse | null>;
    profile(id:string):Promise<User>;
    forgotPassword(email:string):Promise<void>;
    socalSignUp(user: UserSocialRegister): Promise<UserLoginResponse>;
    setResetPassword(token:string,password:string):Promise<void>;
    BlockOrUnblockUser(id:string):Promise<User>;
    editUserProfile(userId: string, data: EditProfileDto):Promise<User>;
    changeProfilePic(userId:string,image:string):Promise<void>;
    changeUserPassword(userId:string):Promise<void>;
    addMedicalRecord(userId: string, fileUrl: string, title: string, description: string): Promise<IMedicalRecord | null>;
    getUserMedicalRecords(userId: string): Promise<IMedicalRecord>;
    getUserByRefreshToken( refreshToken: string): Promise<string>;
    deleteMedicalRecord(recordId: string, userId: string): Promise<void> ;
    calculateRecommendedCategories(surveyData: any): Promise<{ recommendedCategories: string[], npsScore: number }>;
    getCategorizedDoctors():Promise<CategorizedDoctorsResult>
}