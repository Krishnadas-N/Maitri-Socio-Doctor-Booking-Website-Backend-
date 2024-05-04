import { adminModelIDataSource } from "../../data/interfaces/data-sources/adminIDataSource";
import { Admin } from "../entities/Admin";
import { IAdminRepository } from "../interfaces/repositoryInterfaces/adminIRepository"; 


export class AdminRepository implements IAdminRepository{
    constructor(private adminDatasource:adminModelIDataSource){}

    async create(admin: Admin): Promise<void> {
        await this.adminDatasource.create(admin)
    }
    async findByEmail(email: string): Promise<Admin | null> {
            return await this.adminDatasource.findByemail(email);
    }
    async findById(id: string): Promise<Admin | null> {
        return await this.adminDatasource.findById(id);
    }
    async findByUsername(username: string): Promise<Admin | null> {
        return await this.adminDatasource.findByUsername(username);
    }
}