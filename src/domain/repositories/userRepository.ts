import mongoose from "mongoose";
import MailService from "../../config/node-mailer";
import { CustomError } from "../../utils/customError";
import { generateRandomToken } from "../../utils/tokenizeDataHelper";
import { userModelIDataSource } from "../../data/interfaces/data-sources/userIDataSource"; 
import { IMedicalRecord, User } from "../entities/User";
import { IUserRepository } from "../interfaces/repositoryInterfaces/userIRepository";
import dotenv from "dotenv";
import { EditProfileDto, UserSocialRegister, UsersWithTotalCount } from "../../models/users.model";
import resetPasswordLink from "../../templates/changePasswordTemplate";
dotenv.config();

export class UserRepository implements IUserRepository {
  private dataSource: userModelIDataSource;
  constructor(userData: userModelIDataSource) {
    this.dataSource = userData;
  }

  private async sendResetPasswordLinkEmail(
    email: string,
    resetLink: string
  ): Promise<void> {
    // Updated function name
    const emailTemplate = resetPasswordLink(resetLink);
    const mailService = MailService.getInstance();
    try {
      await mailService.createConnection();
      await mailService.sendMail("X-Request-Id-Value", {
        to: email,
        subject: "Reset Password",
        html: emailTemplate.html,
      });
    } catch (error) {
      console.error("Error sending reset password link:", error);
      throw new CustomError("Error sending reset password link", 500);
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    console.log("Log from UserAuth Repo findBy email");
    const user = await this.dataSource.findByEmail(email);
    return user;
  }
  async getUser(userId: string): Promise<User> {
    console.log("Log from UserAuth Repo getUser");
    const user = await this.dataSource.findById(userId);
    if (!user) {
      throw new CustomError(`User with ID ${userId} not found`, 404); // Update status to 404 for not found
    }
    return user;
  }
 
 async socialRegister(user: UserSocialRegister): Promise<User> {
      return this.dataSource.socialRegister(user)
  }
  


  async save(user: User): Promise<User> {
    console.log("Log from UserAuth Repo save");
    return await this.dataSource.create(user);
  }
  async markAsVerified(email: string): Promise<void> {
    await this.dataSource.verifyUser(email);
  }

  async setResetToken(email: string): Promise<void> {
    const user = await this.dataSource.findByEmail(email);
    if (!user) {
      throw new CustomError("User is Not Found", 404);
    }
    const resetToken = await generateRandomToken();
    await this.dataSource.saveResetToken( resetToken,email);
    const resetPasswordLink = `${process.env.UserResetPasswordLink}${resetToken}`;
    await this.sendResetPasswordLinkEmail(email, resetPasswordLink); // Updated function name
  }

  async findResetTokenAndSavePassword(
    token: string,
    password: string
  ): Promise<void> {
    await this.dataSource.findResetTokenAndSavePassword(token, password);
  }


  async toggleBlockUser(id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Inavlid User Id", 400);
    }
    return await this.dataSource.toggleBlockUser(id);
  }

  

  async findById(id: string): Promise<User | null> {
    try {
      if (!id) {
        throw new CustomError("Id is Not FOund", 404);
      }
      return await this.dataSource.findById(id);
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
  async updateUserProfile(userId: string, data: EditProfileDto): Promise<User> {
    try {
      if (!userId) {
        throw new CustomError("User Id is Not FOund", 404);
      }
      return await this.dataSource.editProfile(userId, data);
    }catch (error:unknown) {
      if (error instanceof CustomError) {
          throw error;
      } else {
          const castedError = error as Error
    console.error('Unexpected error:', error);
    throw new CustomError(castedError.message || 'Internal server error',500);
      }
  }
  }

  async changeUserProfilePic(userId: string, image: string): Promise<void> {
    try {
        await this.dataSource.changeProfilePic(userId,image);
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

  async sendUserChangePasswordLink(userId: string): Promise<void> {
    try {
      const user = await this.dataSource.findById(userId); 
  
      if (!user) {
        throw new CustomError("User is Not Found", 404);
      }
      console.log("user From Change password",user);
  
      const resetToken = await generateRandomToken();
      await this.dataSource.saveResetToken(user.email, resetToken);
  
      const resetPasswordLink = `${process.env.UserResetPasswordLink}${resetToken}`;
      await this.sendResetPasswordLinkEmail(user.email, resetPasswordLink);
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
      return this.dataSource.addMedicalRecord(userId,fileUrl,title,description)
  }
  
    async getMedicalRecords(userId: string): Promise<IMedicalRecord> {
          return this.dataSource.getMedicalRecords(userId);
      }

    async getUserByRefreshToken(refreshToken: string): Promise<User> {
          return this.dataSource.getUserByRefreshToken(refreshToken)
      }
     async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
          return this.dataSource.saveRefreshToken(email,refreshToken)
      }

     async deleteMedicalRecord(recordId: string, userId: string): Promise<void> {
          return this.dataSource.deleteMedicalRecord(recordId,userId)
      }
}
