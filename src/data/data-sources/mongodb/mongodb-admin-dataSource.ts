import mongoose from "mongoose";
import { CustomError } from "../../../../utils/CustomError";
import Admin, { RoleDetails } from "../../../domain/entities/Admin";
import { AdminModelInter } from "../../interfaces/data-sources/admin-data-source";
import AdminModel, { IAdmin } from "./models/admin-model";
import RoleModel from "./models/role-model";


export class AdminDataSource implements AdminModelInter{
    constructor(){}

   async create(admin: Admin): Promise<void> {
    try {

        const roles = await RoleModel.find({ _id: { $in: admin.roles } });
        if (roles.length !== admin.roles.length) {
            throw new Error('Some roles not found');
        }
        const newAdmin:IAdmin = new AdminModel({
            username: admin.username,
            email: admin.email,
            password: admin.password,
            roles:  roles.map(role => role._id.toString()),
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        });
        await newAdmin.save();
    } catch (error:any) {
        if (error.code === 11000) {
            throw new CustomError('Username or email already exists',409);
        } else {
            throw new CustomError(error.message || 'Failed to create admin',500);
        }
    }
    }

    async findByUsername(username: string): Promise<Admin | null> {
        try {
            const adminDocument = await AdminModel.findOne({ username });
            if (adminDocument) {
                const admin = Admin.fromJSON(adminDocument);
                console.log(admin,"Log from Amdin");
                return this.convertToDomain(admin);
            } else {
                return null;
            }
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByUsername',500);
            }
        }
    }
    async findByemail(email: string): Promise<Admin | null> {
        try {
        const adminDocument = await AdminModel.findOne({ email });
        if (adminDocument) {
            console.log(adminDocument,"Log from Amdin");
            const admin = Admin.fromJSON(adminDocument);
            console.log(admin,"Log from Amdin");
            return this.convertToDomain(admin);
        } else {
            return null;
        }
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }

   async findById(id: string): Promise<Admin | null> {
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError("Invalid id",400);
        const adminDocument = await AdminModel.findById(id);
        if (adminDocument) {
            const admin = Admin.fromJSON(adminDocument);
            console.log(admin,"Log from Amdin");
            return this.convertToDomain(admin);
        } else {
            return null;
        }
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }


    private async fetchRoleDetails(roleIds: string[]): Promise<RoleDetails[]> {
        try {
            const roles = await RoleModel.find({ _id: { $in: roleIds } });
            const roleDetails: RoleDetails[] = roles.map(role => ({
                roleId: role._id.toString(),
                roleName: role.name,
                permissions: role.permissions // Assuming your RoleModel has a 'permissions' field
            }));
            return roleDetails;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
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