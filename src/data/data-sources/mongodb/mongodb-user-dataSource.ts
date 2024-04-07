import { CustomError } from "../../../../utils/CustomError";
import { User } from "../../../domain/entities/User";
import { UsersWithTotalCount } from "../../../models/users.model";
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
            console.log(user,"user from databse")
            return user ? user.toObject() as User : null;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error}`);
        }
    }

    async findById(userId: string): Promise<User | null> {
        try {
            const user = await UserModel.findById(userId).exec();
            console.log(user,"user from databse")
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

   async findResetTokenAndSavePassword(token: string,password:string): Promise<void> {
    try {
        const user = await UserModel.findOne({resetToken: token}).exec();
        if (!user) {
            throw new CustomError('User not found or unauthorized', 404);
          }
        user.password = password;
        user.resetToken = null;
        await user.save();
    } catch (error:any) {
    if (error instanceof CustomError) {
        throw error;
      }
  
      console.error('Unexpected error:', error);
      throw new Error(error.message || 'Internal server error');
    }
    }

   async saveResetToken(token: string, email: string): Promise<void> {
    try {
        const user = await UserModel.findOne({email}); 
        if (!user) {
            throw new CustomError('User not found or unauthorized', 404);
          }
        if(!user.isVerified){
            throw new CustomError('User Crenditals is Not Verified', 403);
        }
        user.resetToken = token;
         await user.save()
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
              }
          
              console.error('Unexpected error:', error);
              throw new Error(error.message || 'Internal server error');
            }
        
    }
    async getAllUsers(searchQuery: string, page: number, pageSize: number): Promise<UsersWithTotalCount> {
        try {
            const regex = new RegExp(searchQuery, 'i');
            const offset = (page - 1) * pageSize;
            const users =await UserModel.find({
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { username: { $regex: regex } }
                ]
            }).skip(offset).limit(pageSize)
           const totalCount = await UserModel.countDocuments({
                $or: [
                    { firstname: { $regex: regex } },
                    { lastname: { $regex: regex } },
                    { username: { $regex: regex } }
                ]
            });
            return {
                users: users.map(user => user.toObject() as User),
                totalCount
            };
        } catch (error) {
            throw new Error(`Error getting users: ${error}`);
        }
    }
    async toggleBlockUser(id:string): Promise<User>{
        const user = await UserModel.findById(id);
        if (!user) {
            throw new CustomError('User not found', 404);
        }
        user.isBlocked = !user.isBlocked;

            await user.save();
            return user.toObject() as User;
    }
}
