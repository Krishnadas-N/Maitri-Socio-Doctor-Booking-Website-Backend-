import { CustomError } from "../../utils/customError";
import {
  EditProfileDto,
  UserLoginResponse,
  UserSocialRegister,
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
  async socalSignUp(user: UserSocialRegister): Promise<UserLoginResponse> {
    try {
      console.log("Social Signup ", user);
  
      if (!user) {
        throw new CustomError("Invalid User Details", 403);
      }
  
      const userIsExist = await this.userRepository.findByEmail(user.email);
  
      if (userIsExist) {
        if (userIsExist.isVerified) {
          if (userIsExist._id) {
            const refreshToken = refreshAccessToken({ _id: userIsExist._id.toString(), roles: userIsExist.roles || [] });
            const tokenData = issueJWT({ _id: userIsExist._id.toString(), roles: userIsExist.roles || [] });
            console.log(tokenData, refreshToken);
            await this.userRepository.saveRefreshToken(userIsExist.email, refreshToken);
            return { user: userIsExist, token: tokenData.token, revokeAcessToken: refreshToken };
          }
          throw new CustomError("User ID is missing", 404);
        }
      } else {
        const userData = await this.userRepository.socialRegister(user);
  
        if (userData && userData._id) {
          const refreshToken = refreshAccessToken({ _id: userData._id.toString(), roles: userData.roles || [] });
          const tokenData = issueJWT({ _id: userData._id.toString(), roles: userData.roles || [] });
          console.log(tokenData, refreshToken);
          await this.userRepository.saveRefreshToken(userData.email, refreshToken);
          return { user: userData, token: tokenData.token, revokeAcessToken: refreshToken };
        }
        throw new CustomError("Failed to create user", 500);
      }
  
      throw new CustomError("User is not verified", 403);
    } catch (error: unknown) {
      console.error('Unexpected error:', error);
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        throw new CustomError(castedError.message || 'Internal server error', 500);
      }
    }
  }
  
  async socialLogin(email: string): Promise<UserLoginResponse | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
  
      if (!user) {
        throw new CustomError("User Not found please Login", 404);
      }
      if (!user.isVerified) {
        throw new CustomError("User is not verified", 403);
      }
  
      if (user && user._id) {
        const refreshToken = refreshAccessToken({ _id: user._id.toString(), roles: user.roles || [] });
        const tokenData = issueJWT({ _id: user._id.toString(), roles: user.roles || [] });
        await this.userRepository.saveRefreshToken(email, refreshToken);
  
        return { user, token: tokenData.token, revokeAcessToken: refreshToken };
      }
      return null;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error('Unexpected error:', castedError);
        throw new CustomError(castedError.message || 'Internal server error', 500);
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

     async calculateRecommendedCategories(surveyData: any): Promise<{ recommendedCategories: string[], npsScore: number }> {
      const {
        sleepQuality,
        mood,
        anxietyLevel,
        crisis,
        supportSystem,
        physicalSymptoms,
        substanceUse
      } = surveyData;
    
      let npsScore = 0;
      
      // Scoring based on mood
      switch (mood) {
        case 'Nearly every day':
          npsScore += 10;
          break;
        case 'More than half the days':
          npsScore += 7;
          break;
        case 'Several days':
          npsScore += 5;
          break;
        case 'Not at all':
          npsScore += 2;
          break;
      }
    
      if (crisis === 'Yes') {
        npsScore = Math.max(npsScore, 10);
      }
    
    
      const recommendedCategories: string[] = [];
    
      if (sleepQuality === 'Very Poor' || mood === 'Nearly every day' || crisis === 'Yes') {
        recommendedCategories.push('Psychiatrist');
      }
    
      if (mood === 'More than half the days' || anxietyLevel === 'More than half the days') {
        recommendedCategories.push('Psychologist');
      }
    
      if (supportSystem === 'No' || physicalSymptoms === 'Nearly every day') {
        recommendedCategories.push('Counselor');
      }
    
      if (substanceUse === 'Daily') {
        recommendedCategories.push('Addiction Specialist');
      }
    
      return { recommendedCategories, npsScore };
    }
    
}
