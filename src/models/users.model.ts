import { ObjectId } from "mongoose";
import { User } from "../domain/entities/User";

export interface UsersWithTotalCount {
    users: User[];
    totalCount: number;
}

export type objectId = ObjectId;

export interface UserLoginResponse{
    user:User,
    token:string
    revokeAcessToken:string;
}

export interface GoogleCredentials {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string
  isAnonymous: boolean
  photoURL: string
  providerData: ProviderDaum[]
  stsTokenManager: StsTokenManager
  createdAt: string
  lastLoginAt: string
  apiKey: string
  appName: string
}

export interface ProviderDaum {
  providerId: string
  uid: string
  displayName: string
  email: string
  phoneNumber: any
  photoURL: string
}

export interface StsTokenManager {
  refreshToken: string
  accessToken: string
  expirationTime: number
}


export interface UserSocialRegister{
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    gender?:string,
    dateOfBirth?:string,
    profilePic?:string
  }

export interface EditProfileDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }

export type userType = 'User'|'Doctor'