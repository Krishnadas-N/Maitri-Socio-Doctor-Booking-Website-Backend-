import mongoose from "mongoose";
import { CustomError } from "../../../utils/customError"; 
import { RoleDetails } from "../../../domain/entities/Admin";
import { IMedicalRecord, User } from "../../../domain/entities/User";
import { EditProfileDto, UserSocialRegister, UsersWithTotalCount } from "../../../models/users.model";
import { userModelIDataSource } from "../../interfaces/data-sources/userIDataSource";
import { medicalRecordModel  } from "./models/userMedicalRecordModel";
import { roleModel} from "./models/roleModel";
import { userModel } from "./models/userModel"; 
import { doctorModel } from "./models/doctorModel";
import { ReviewModel } from "./models/ReviewAndRatingModel";
import { CategorizedDoctorsResult } from "../../../models/common.models";


export class MongoDbUserDataSource implements userModelIDataSource {
   
    constructor() { }

    static async isUserExists(id?: string, email?: string): Promise<User | null> {
        if (id) {
            return userModel.findById(id);
        } else if (email) {
            return userModel.findOne({ email: email });
        } else {
            throw new Error("Invalid arguments. Please provide either ID or email.");
        }
    }

    async create(user: Omit<User, '_id'>): Promise<User> {
        try {
            console.log("Log from user create data source")
            const createdUser = await userModel.create(user);
            console.log(createdUser);
            return createdUser.toObject() as User;
        } catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    async socialRegister(user: UserSocialRegister): Promise<User> {
        try {
          console.log("Log from user create data source");
      
          const createdUser = await userModel.create({ ...user, isVerified: true });
      
          if (createdUser) {
            const user = User.fromJSON(createdUser);
            const domainUser = this.convertToDomain(user);
            
            if (!domainUser) {
              throw new CustomError("Failed to convert created user to domain user", 500);
            }
            
            console.log(domainUser, "Log from user");
            return domainUser as unknown as User;
          }
      
          throw new CustomError("Failed to create user", 500);
        } catch (error: unknown) {
          console.error("Error creating user:", error);
          if (error instanceof CustomError) {
            throw error;
          } else {
            throw new CustomError(`Error creating user: ${(error as Error).message}`, 500);
          }
        }
      }
      
      
    async getAll(skip?: number, limit?: number): Promise<User[]> {
        try {
            let query = userModel.find();
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
            const userDocument = await userModel.findOne({ email })
            if (userDocument) {
                console.log(userDocument,"Log from user");
                const user = User.fromJSON(userDocument);
                console.log(user,"Log from user");
                return this.convertToDomain(user);
            } else {
                return null;
            }
        } catch (error) {
            throw new Error(`Error finding user by email: ${error}`);
        }
    }

    async findById(userId: string): Promise<User | null> {
        try {
            const user = await userModel.findById(userId).exec();
            console.log(user,"user from databse")
            return user ? user.toObject() as User : null;
        } catch (error) {
            throw new Error(`Error finding user by ID: ${error}`);
        }
    }

    async updateOne(id: string, data: object): Promise<User | null> {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true }).exec();
            return updatedUser ? updatedUser.toObject() as User : null;
        } catch (error) {
            throw new Error(`Error updating user: ${error}`);
        }
    }

    async deleteOne(id: string): Promise<boolean> {
        try {
            const result = await userModel.findByIdAndDelete(id).exec();
            return !!result;
        } catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
    async verifyUser(email:string):Promise<void>{
        try {
           await userModel.updateOne({email},{$set:{
            isVerified:true
           }});
        } catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }

   async findResetTokenAndSavePassword(token: string,password:string): Promise<void> {
    try {
        const user = await userModel.findOne({resetToken: token}).exec();
        if (!user) {
            throw new CustomError('User not found or unauthorized', 404);
          }
        user.password = password;
        user.resetToken = null;
        await user.save();
    } catch (error:unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            const castedError = error as Error
      console.error('Unexpected error:', error);
      throw new CustomError(castedError.message || 'Internal server error',500);
        }
    }
    }

   async saveResetToken(email: string, token: string): Promise<void> {
    try {
        console.log(token ,email,'///////////////////////////');
        const user = await userModel.findOne({email}); 
        if (!user) {
            throw new CustomError('User not found or unauthorized', 404);
          }
        if(!user.isVerified){
            throw new CustomError('User Crenditals is Not Verified', 403);
        }
        user.resetToken = token;
         await user.save()
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
        
    }
   
    async toggleBlockUser(id:string): Promise<User>{
        const user = await userModel.findById(id);
        if (!user) {
            throw new CustomError('User not found', 404);
        }
        user.isBlocked = !user.isBlocked;

            await user.save();
            return user.toObject() as User;
    }

    async editProfile(userId: string, data: EditProfileDto): Promise<User> {
        const updatedUser = await userModel.findByIdAndUpdate(userId, data, { new: true }) as User;
        if (!updatedUser) {
          throw new CustomError('User Not Found', 404);
        }
        return updatedUser ;
      }

      async changeProfilePic(userId:string,image:string):Promise<void>{
        await userModel.updateOne({_id:userId}, {$set:{profilePic:image}}); 
      }
      


   
    private async convertToDomain(user: User | null): Promise<User | null> {
        if (!user) return null;
        console.log("Log from convertToDomain", user);
        const roleIds: string[] = user.roles?.map(role => role.toString()) || [];
        const roleDetails: RoleDetails[] = await this.fetchRoleDetails(roleIds);
        return new User(
            user.email,
            user.password,
            user.username,
            user.firstName,
            user.lastName,
            user.gender,
            user.dateOfBirth,
            user._id,
            user.profilePic,
            user.isVerified,
            user.resetToken,
            roleDetails,
        ).toJson();
    }

    private async fetchRoleDetails(roleIds: string[]): Promise<RoleDetails[]> {
        try {
            const roles = await roleModel.find({ _id: { $in: roleIds } });
            const roleDetails: RoleDetails[] = roles.map(role => ({
                roleId: role._id.toString(),
                roleName: role.name,
                permissions: role.permissions // Assuming your RoleModel has a 'permissions' field
            }));
            return roleDetails;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }


    async addMedicalRecord(userId: string, fileUrl: string, title: string, description: string): Promise<IMedicalRecord | null> {
        try {
          if (!userId || !fileUrl || !title || !description) {
            throw new CustomError('All fields are required',404);
          }
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new CustomError('Invalid userId format',400);
          }
          const newRecord = new medicalRecordModel({
            userId,
            fileUrl,
            title,
            description
          });
      
          // Save the new record to the database
          const savedRecord = await newRecord.save();
      
          return savedRecord as unknown as IMedicalRecord;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
      }
      
      async getMedicalRecords(userId: string): Promise<IMedicalRecord>{
        try {
            const userMedicalRecords = await medicalRecordModel.find({userId});
            return userMedicalRecords as unknown as IMedicalRecord;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
      }

   

      async deleteMedicalRecord(recordId: string, userId: string): Promise<void> {
        try {
           await medicalRecordModel.findOneAndDelete({ userId, _id: recordId });
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error('Unexpected error:', error);
                throw new CustomError((error as Error).message || 'Internal server error', 500);
            }
        }
    }
    

      async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
        try {
            const user = await userModel.findOneAndUpdate(
                { email: email },
                { $set: { refreshToken: refreshToken } }
            );
            if (!user) {
                throw new CustomError('User Not Found', 404);
            }
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error; // Type assertion
                throw new CustomError(castedError.message || 'Failed to findByEmail', 500);
            }
        }}
        async getUserByRefreshToken( refreshToken: string): Promise<User> {
            try {
                const user = await userModel.findOne({refreshToken})
                
                if (!user) {
                    throw new CustomError('User Not Found', 404);
                }
                console.log("getting user by refresh token",user)
                return user as unknown as User;
            } catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error; // Type assertion
                    throw new CustomError(castedError.message || 'Failed to findByEmail', 500);
                }
            }
        }

        async getCategorizedDoctors():Promise<CategorizedDoctorsResult>{
            try {
                const averageRatings = await ReviewModel.aggregate([
                    {
                        $group: {
                            _id: "$doctor",
                            averageRating: { $avg: "$rating" }
                        }
                    }
                ]);
        
                const averageRatingsMap = new Map<string, number>();
                averageRatings.forEach((rating: any) => {
                    averageRatingsMap.set(String(rating._id), rating.averageRating);
                });
        
                const categorizedDoctors = await doctorModel.aggregate([
                    {
                        $group: {
                            _id: "$specialization",
                            doctors: {
                                $push: {
                                    _id: "$_id",
                                    profilePic: "$profilePic",
                                    fullName: { $concat: ["$firstName", " ", "$lastName"] },
                                    specialty: "$specialization",
                                    rating: { $ifNull: [{ $arrayElemAt: [averageRatingsMap.get(String('$_id')), 0] }, 0] }
                                }
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "doctorcategories",
                            localField: "_id",
                            foreignField: "_id",
                            as: "category"
                        }
                    },
                    {
                        $unwind: "$category" // Unwind to access fields inside the category array
                    },
                    {
                        $project: {
                            _id: 0,
                            category: "$category.name", // Get the name of the specialization
                            doctors: 1
                        }
                    }
                ]);
        
                // Aggregate most rated doctors separately
                const mostRatedDoctors = await doctorModel.aggregate([
                    { $sort: { averageRating: -1 } },
                    { $limit: 10 },
                    {
                        $lookup: {
                            from: "doctorcategories",
                            localField: "specialization",
                            foreignField: "_id",
                            as: "specialization"
                        }
                    },
                    {
                        $unwind: "$specialization" // Unwind to access fields inside the specialization array
                    },
                    {
                        $project: {
                            _id: "$_id",
                            profilePic: "$profilePic",
                            fullName: { $concat: ["$firstName", " ", "$lastName"] },
                            specialty: "$specialization.name", 
                            rating: "$averageRating"
                        }
                    }
                ]);
                
        
            console.log("categorizedDoctors.concat",categorizedDoctors)
            const result = categorizedDoctors.concat({ category: "Most Rated", doctors: mostRatedDoctors });
    
           console.log("Results fetched from Categorizd doctors",result)
                return result; 
            } catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error
                    console.error("Error in getDoctorDashboardDetails:", error);
                    throw new CustomError(castedError.message || "Error fetching doctor dashboard details", 500);
                }
            }
            }
}
