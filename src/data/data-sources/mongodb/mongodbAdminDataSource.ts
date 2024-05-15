import mongoose from "mongoose";
import { CustomError } from "../../../utils/customError";
import  { Admin, RoleDetails } from "../../../domain/entities/Admin";
import { adminModelIDataSource } from "../../interfaces/data-sources/adminIDataSource"; 
import {roleModel} from "./models/roleModel";
import { adminModel,IAdmin } from "./models/adminModel";

export class AdminDataSource implements adminModelIDataSource{
    constructor(){}

   async create(admin: Admin): Promise<void> {
    try {

        const roles = await roleModel.find({ _id: { $in: admin.roles } });
        if (roles.length !== admin.roles.length) {
            throw new Error('Some roles not found');
        }
        const newAdmin:IAdmin = new adminModel({
            username: admin.username,
            email: admin.email,
            password: admin.password,
            roles:  roles.map(role => role._id.toString()),
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        });
        await newAdmin.save();
    } catch (error:unknown) {
        const castedError = error as Error
        throw new CustomError(castedError.message || 'Failed to create admin',500);
    }
    }

    async findByUsername(username: string): Promise<Admin | null> {
        try {
            const adminDocument = await adminModel.findOne({ username });
            if (adminDocument) {
                const admin = Admin.fromJSON(adminDocument);
                console.log(admin,"Log from Amdin");
                return this.convertToDomain(admin);
            } else {
                return null;
            }
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByUsername',500);
            }
        }
    }
    async findByemail(email: string): Promise<Admin | null> {
        try {
        const adminDocument = await adminModel.findOne({ email });
        if (adminDocument) {
            console.log(adminDocument,"Log from Amdin");
            const admin = Admin.fromJSON(adminDocument);
            console.log(admin,"Log from Amdin");
            return this.convertToDomain(admin);
        } else {
            return null;
        }
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByemail',500);
            }
        }
    }

   async findById(id: string): Promise<Admin | null> {
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError("Invalid id",400);
        const adminDocument = await adminModel.findById(id);
        if (adminDocument) {
            const admin = Admin.fromJSON(adminDocument);
            console.log(admin,"Log from Amdin");
            return this.convertToDomain(admin);
        } else {
            return null;
        }
        }  catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByemail',500);
            }
        }
    }


    private async fetchRoleDetails(roleIds: string[]): Promise<RoleDetails[]> {
        try {
            const roles = await roleModel.find({ _id: { $in: roleIds } });
            const roleDetails: RoleDetails[] = roles.map(role => ({
                roleId: role._id.toString(),
                roleName: role.name,
                permissions: role.permissions // Assuming your roleModel has a 'permissions' field
            }));
            return roleDetails;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByemail',500);
            }
        }
    }

    private async convertToDomain(admin: Admin | null): Promise<Admin | null> {
        if (!admin) return null;
        console.log("log from converttodomain",admin);
        const roleIds: string[] = admin.roles.map(role => role.toString());
        const roleDetails:RoleDetails[] = await this.fetchRoleDetails(roleIds);
        return admin ? new Admin(
            admin.username,
            admin.password,
            admin.email,
            roleDetails as RoleDetails[],
            admin.createdAt,
            admin.updatedAt,
            admin._id // Convert ObjectId to string
        ).toJSON() : null;
    }

}