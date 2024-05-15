import { CustomError } from "../../utils/customError";
import {
  EditProfileDto,
  UserLoginResponse,
  UsersWithTotalCount,
} from "../../models/users.model";
import { IMedicalRecord, User } from "../entities/User";
import { IUserRepository } from "../interfaces/repositoryInterfaces/userIRepository";
import { IUserUseCase } from "../interfaces/use-cases/userIUsecase";
import { PasswordUtil } from "../../utils/passwordUtils";
import { issueJWT, refreshAccessToken } from "../../utils/passportUtils";
import { OtpRepository } from "../interfaces/repositoryInterfaces/otpIRepository";
import { generateToken } from "../../utils/tokenizeDataHelper";

export class UserUseCase implements IUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private readonly otpRepository: OtpRepository
  ) {}

  async login( email: string,password: string ): Promise<UserLoginResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError("No user Found", 404);
    }
    if (!user.isVerified) {
      throw new CustomError("User is Not Verified", 403);
    }
    const isValidPassword = await PasswordUtil.comparePasswords(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new CustomError("Invalid password", 409);
    }
    console.log(email, password);
      if (user && user._id) {
      console.log(email, password);
      const refreshToken  = refreshAccessToken({ _id: user._id.toString(), roles: user.roles || [],});
      const tokenData = issueJWT({ _id: user._id.toString(), roles: user.roles || [],});
      console.log(tokenData,refreshToken);
      this.userRepository.saveRefreshToken(email,refreshToken)
      return { user, token: tokenData.token ,revokeAcessToken:refreshToken };
    } else {
      throw new CustomError("Id is not found in User", 404);
    }
  }

  async signUp(user: Omit<User, "_id">): Promise<string | null> {
    const userIsExist = await this.userRepository.findByEmail(user.email);
    if (userIsExist && userIsExist.isVerified === true) {
      throw new CustomError("User Already Exists", 409);
    } else {
      if (!userIsExist) {
        await this.userRepository.save(user);
      }
      const otp = this.otpRepository.generateOTP();
      console.log(otp);
      const otpId = await this.otpRepository.sendOTP(user.email, otp);
      const token = await generateToken(otpId);
      console.log("Otp data Saved in datbase");
      return token;
    }
  }

  profile(id: string): Promise<User> {
    const user = this.userRepository.getUser(id);
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
      return this.userRepository.setResetToken(email);
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

  async setResetPassword(token: string, password: string): Promise<void> {
    try {
      if (!token || !password) {
        throw new CustomError("Token or Password  is not provided", 400);
      }
      await this.userRepository.findResetTokenAndSavePassword(token, password);
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

  async getAllUsers(
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<UsersWithTotalCount> {
    try {
      return await this.userRepository.getAllUsers(page, pageSize, searchQuery);
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
  async BlockOrUnblockUser(id: string): Promise<User> {
    try {
      return await this.userRepository.toggleBlockUser(id);
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

  async editUserProfile(userId: string, data: EditProfileDto): Promise<User> {
    try {
      return await this.userRepository.updateUserProfile(userId, data);
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

  async changeProfilePic(userId: string, image: string): Promise<void> {
    try {
      if (!userId) {
        throw new CustomError("User Id is not Defined", 404);
      }
      if (image.trim().length === 0) {
        throw new CustomError("Image Is Not Provided", 422);
      }
      return await this.userRepository.changeUserProfilePic(userId, image);
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

  async changeUserPassword(userId: string): Promise<void> {
    try {
      if (!userId) {
        throw new CustomError("Invalid UserId ", 403);
      }
      await this.userRepository.sendUserChangePasswordLink(userId);
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

  async addMedicalRecord(
    userId: string,
    fileUrl: string,
    title: string,
    description: string
  ): Promise<IMedicalRecord | null> {
    try {
      const medicalRecord = await this.userRepository.addMedicalRecord(
        userId,
        fileUrl,
        title,
        description
      );

      return medicalRecord;
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

  async getUserMedicalRecords(userId: string): Promise<IMedicalRecord> {
    try {
      const medicalRecords = await this.userRepository.getMedicalRecords(
        userId
      );
      return medicalRecords;
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

  async getUserByRefreshToken(refreshToken: string): Promise<string> {
    try {
        if (!refreshToken) {
            throw new CustomError("Invalid refresh Token", 400);
        }

        const user = await this.userRepository.getUserByRefreshToken(refreshToken);
        if (!user) {
            throw new CustomError('No User Found for this token', 403);
        }

        if (!user.isVerified) {
            throw new CustomError("User is Not Verified", 403);
        }

        if (user && user._id) {
            const tokenData = issueJWT({ _id: user._id.toString(), roles: user.roles || [] });
            return tokenData.token as string;
        }else{
          throw new CustomError('Unable to create the new token',400)
        }
       
     } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        const castedError = error as Error;
        throw new CustomError(
            castedError.message || "Error while retrieving user by refresh token",
            500
        );
    }
 }

    async deleteMedicalRecord(recordId: string, userId: string): Promise<void> {
      try {
        if(!recordId || !userId){
          throw new CustomError("invalid arguments",400);
        }
      await this.userRepository.deleteMedicalRecord(recordId,userId);
    } catch (error) {
      if (error instanceof CustomError) {
          throw error;
      }
      const castedError = error as Error;
      throw new CustomError(
          castedError.message || "Error while retrieving user by refresh token",
          500
      );
  }
    }

}
