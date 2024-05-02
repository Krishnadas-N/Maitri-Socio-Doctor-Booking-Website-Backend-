import { ObjectId } from "mongoose";
import Doctor from "../domain/entities/Doctor";

export type objectId = ObjectId;


export interface doctorsResponseModel{
    doctors: Doctor[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }