import { User } from "../../../domain1/entities/User";
import { User_Data } from "../../interfaces/data-sources/user-data-source";
import { UserModel } from "./models/user-model";



export class MongoDbUserDataSource implements User_Data {
    constructor() { }

    async create(user: Omit<User, '_id'>): Promise<User> {
        try {
            console.log("Log from user create data source")
            const createdUser = await UserModel.create(user);
            console.log(createdUser);
            return createdUser.toObject() as User;
        } catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }

    async getAll(skip?: number, limit?: number): Promise<User[]> {
        try {
            let query = UserModel.find();
            if (skip) query = query.skip(skip);
            if (limit) query = query.limit(limit);
            const users = await query.exec();
            return users.map(user => user.toObject() as User);
        } catch (error) {
            throw new Error(`Error getting all users: ${error}`);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            return user ? user.toObject() as User : null;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error}`);
        }
    }

    async findById(userId: string): Promise<User | null> {
        try {
            const user = await UserModel.findById(userId).exec();
            return user ? user.toObject() as User : null;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error}`);
        }
    }

    async updateOne(id: string, data: object): Promise<User | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
            return updatedUser ? updatedUser.toObject() as User : null;
        } catch (error) {
            throw new Error(`Error updating user: ${error}`);
        }
    }

    async deleteOne(id: string): Promise<boolean> {
        try {
            const result = await UserModel.findByIdAndDelete(id).exec();
            return !!result;
        } catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
    async verifyUser(email:string):Promise<void>{
        try {
           await UserModel.updateOne({email},{$set:{
            isVerified:true
           }});
        } catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
}
