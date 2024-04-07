import { AdminModelInter } from "../../data/interfaces/data-sources/admin-data-source";
import Admin from "../entities/Admin";
import { IAdminRepo } from "../interfaces/repositories/Admin-Repository";


export class AdminRepoImpl implements IAdminRepo{
    constructor(private adminDatasource:AdminModelInter){}

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