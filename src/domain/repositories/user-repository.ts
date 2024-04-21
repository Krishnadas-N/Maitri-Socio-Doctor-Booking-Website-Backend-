import mongoose from "mongoose";
import MailService from "../../../config/node-mailer";
import { CustomError } from "../../../utils/CustomError";
import { generateRandomToken } from "../../../utils/tokenizeData-Helper";
import { User_Data } from "../../data/interfaces/data-sources/user-data-source";
import { User } from "../entities/User";
import { UserRepository } from "../interfaces/repositories/user-IRepository";
import dotenv from "dotenv";
import { EditProfileDto, UsersWithTotalCount } from "../../models/users.model";
import resetPasswordLink from "../../../templates/changePasswordTemplate";
dotenv.config();
export class UserAuthenticationRepoImpl implements UserRepository {
  private dataSource: User_Data;
  constructor(userData: User_Data) {
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

  async getAllUsers(
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<UsersWithTotalCount> {
    return await this.dataSource.getAllUsers(searchQuery, page, pageSize);
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
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Unexpected error:", error);
      throw new Error(error.message || "Internal server error");
    }
  }
  async updateUserProfile(userId: string, data: EditProfileDto): Promise<User> {
    try {
      if (!userId) {
        throw new CustomError("User Id is Not FOund", 404);
      }
      return await this.dataSource.editProfile(userId, data);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Unexpected error:", error);
      throw new Error(error.message || "Internal server error");
    }
  }

  async changeUserProfilePic(userId: string, image: string): Promise<void> {
    try {
        await this.dataSource.changeProfilePic(userId,image);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Unexpected error:", error);
      throw new Error(error.message || "Internal server error");
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
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
  
      console.error("Unexpected error:", error);
      throw new Error(error.message || "Internal server error");
    }
  }
  
}
