import { User } from "../../../domain/entities/User";

export interface User_Data{
    create(user:Omit<User,'_id'>):Promise<User>;
    getAll(skip?:number,limit?:number):Promise<Array<User>>;
    findByEmail(email:string):Promise<User | null>;
    findById(userId:string):Promise<User | null>;
    updateOne(id:string,data:object):Promise<User | null> ;
    deleteOne(id:string): Promise<boolean>; 
    verifyUser(email:string):Promise<void>;
    saveResetToken(token:string,email:string):Promise<void>;
    findResetTokenAndSavePassword(token:string,password:string):Promise<void>;
    getAllUsers(searchQuery:string, page:number, pageSize:number):Promise<UsersWithTotalCount>;
    toggleBlockUser(id:string):Promise<User>;
}