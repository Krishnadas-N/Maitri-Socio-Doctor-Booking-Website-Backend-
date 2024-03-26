import { CustomError } from "../../../utils/CustomError";
import { User_Data } from "../../data1/interfaces/data-sources/user-data-source";
import { User } from "../entities/User";
import { UserRepository } from "../interfaces/repositories/user-Authentication";

export class  UserAuthenticationRepoImpl implements UserRepository{
    private dataSource: User_Data;
    constructor(userData: User_Data) {
        this.dataSource = userData;
    }
    async findByEmail(email: string): Promise<User | null> {
            console.log("Log from UserAuth Repo findBy email");
            const user = await this.dataSource.findByEmail(email);
            return user;
    }
    async getUser(userId: string): Promise<User> {
            console.log("Log from UserAuth Repo getUser");
            const user = await this.dataSource.findById(userId);
            if (!user) {
                throw new CustomError(`User with ID ${userId} not found`, 404); // Update status to 404 for not found
            }
            return user;
    }

    async save(user: User): Promise<User> {
            console.log("Log from UserAuth Repo save");
            return await this.dataSource.create(user);
    }
    async markAsVerified(email: string): Promise<void> {
        await this.dataSource.verifyUser(email);
    }
}