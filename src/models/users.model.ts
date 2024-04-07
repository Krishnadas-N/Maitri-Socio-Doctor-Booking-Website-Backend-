import { ObjectId } from "mongoose";
import { User } from "../domain/entities/User";

export interface UsersWithTotalCount {
    users: User[];
    totalCount: number;
}

export type objectId = ObjectId;