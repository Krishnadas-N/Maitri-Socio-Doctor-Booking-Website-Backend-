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


export interface EditProfileDto {
    firstName?: string;
    lastName?: string;
    username?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  }

export type userType = 'User'|'Doctor'