import { ObjectId } from "mongoose";
import Doctor from "../domain/entities/Doctor";
import { User } from "../domain/entities/User";

export type objectId = ObjectId;


export interface doctorsResponseModel{
    doctors: Doctor[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }

  export interface usersResponseModel{
    users: User[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }

export interface TransactionDetailsByWeek {
    startDate: string;
    credit: number;
    debit: number;
}
