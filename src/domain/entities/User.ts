import { objectId } from "../../models/users.model";
import { RoleDetails } from "./Admin";

export class User {
    constructor(
        
        public email: string,
        public password: string,
        public username: string,
        public firstName?: string,
        public lastName?: string,
        public gender?: string,
        public dateOfBirth?: Date,
        public _id?: string | null,
        public profilePic?: string | null,
        public isVerified?:boolean,
        public resetToken ?:string | null,
        public roles?:string[] | RoleDetails[],
        public refreshToken?:string
    ) {}
    toJson(): any {
        return {
            email: this.email,
            password: this.password,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            dateOfBirth: this.dateOfBirth,
            _id: this._id,
            profilePic: this.profilePic,
            isVerified: this.isVerified,
            resetToken: this.resetToken,
            roles: this.roles,
        };
    }
    static fromJSON(json: any): User {
        return new User(
            json.email,
            json.password,
            json.username,
            json.firstName,
            json.lastName,
            json.gender,
            json.dateOfBirth,
            json._id,
            json.profilePic,
            json.isVerified,
            json.resetToken,
            json.roles
        );
    }
}


export interface IMedicalRecord extends Document {
    _id?:string;
    userId:string;
    fileUrl: string;
    title: string;
    description: string;
    createdAt: Date;
}


