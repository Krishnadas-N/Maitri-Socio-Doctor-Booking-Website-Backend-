import { CustomError } from "../../../../utils/CustomError";
import {
  EditProfileDto,
  UsersWithTotalCount,
} from "../../../models/users.model";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-IRepository";
import { userUseCase } from "../../interfaces/use-cases/UserService/User-usecase";

export class UserUseCaseImpl implements userUseCase {
  constructor(private UserRepo: UserRepository) {}
  profile(id: string): Promise<User> {
    const user = this.UserRepo.getUser(id);
    if (!user) {
      throw new CustomError("User doesnot Exist", 401);
    }
    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      if (!email) {
        throw new CustomError("Email is Not Found", 404);
      }
      return this.UserRepo.setResetToken(email);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(error.message || "Error In forgotPassword", 500);
    }
  }

  async setResetPassword(token: string, password: string): Promise<void> {
    try {
      if (!token || !password) {
        throw new CustomError("Token or Password  is not provided", 400);
      }
      await this.UserRepo.findResetTokenAndSavePassword(token, password);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(error.message || "Error In forgotPassword", 500);
    }
  }

  async getAllUsers(
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<UsersWithTotalCount> {
    try {
      return await this.UserRepo.getAllUsers(page, pageSize, searchQuery);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error.message || "Error In Fetching all Users",
        500
      );
    }
  }
  async BlockOrUnblockUser(id: string): Promise<User> {
    try {
      return await this.UserRepo.toggleBlockUser(id);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error.message || "Error In While Changing the status of the User",
        500
      );
    }
  }

  async editUserProfile(userId: string, data: EditProfileDto): Promise<User> {
    try {
      return await this.UserRepo.updateUserProfile(userId, data);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error.message || "Error In While Changing the status of the User",
        500
      );
    }
  }

  async changeProfilePic(userId: string, image: string): Promise<void> {
    try {
      if (!userId) {
        throw new CustomError("User Id is not Defined", 404);
      }
      if (image.trim().length === 0) {
        throw new CustomError("Image Is Not Provided", 422);
      }
      return await this.UserRepo.changeUserProfilePic(userId, image);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error.message || "Error In While Changing the status of the User",
        500
      );
    }
  }

  async changeUserPassword(userId: string): Promise<void> {
    try {
      if (!userId) {
        throw new CustomError("Invalid UserId ", 403);
      }
      await this.UserRepo.sendUserChangePasswordLink(userId);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error.message || "Error In While Changing the status of the User",
        500
      );
    }
  }
}
