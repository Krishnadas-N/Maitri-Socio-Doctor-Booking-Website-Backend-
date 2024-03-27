import { User } from "../../../domain1/entities/User";

export interface User_Data{
    create(user:Omit<User,'_id'>):Promise<User>;
    getAll(skip?:number,limit?:number):Promise<Array<User>>;
    findByEmail(email:string):Promise<User | null>;
    findById(userId:string):Promise<User | null>;
    updateOne(id:string,data:object):Promise<User | null> ;
    deleteOne(id:string): Promise<boolean>; 
    verifyUser(email:string):Promise<void>;
}