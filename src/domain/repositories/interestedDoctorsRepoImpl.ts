import { IInterstedDoctors } from "../../data/interfaces/data-sources/interestedDoctors-data-source";
import { InterestedDoctor } from "../entities/InterestedDoctors";
import { IIntersetedDoctorsRepo } from "../interfaces/repositories/InterstedDoctor-Repository";

export class InterestedDoctorsRepoImpl implements IIntersetedDoctorsRepo{
    constructor(private readonly dataSource:IInterstedDoctors){}
    async addInterest(userId: string, doctorId: string): Promise<InterestedDoctor> {
            return await this.dataSource.addToInterest(userId,doctorId);
    }
    async getUserInterests(userId: string): Promise<InterestedDoctor> {
        return await this.dataSource.getInterests(userId)
    }

    async removeInterest(userId: string, doctorId: string): Promise<void> {
         await this.dataSource.removeInterest(userId,doctorId)
    }
}