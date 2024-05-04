import { InterestedDoctorsModelIDataSource } from "../../data/interfaces/data-sources/interestedDoctorsIDataSource";
import { InterestedDoctor } from "../entities/InterestedDoctors";
import { IIntersetedDoctorsRepository } from "../interfaces/repositoryInterfaces/InterstedDoctorIRepository";

export class InterestedDoctorsRepoImpl implements IIntersetedDoctorsRepository{
    constructor(private readonly dataSource:InterestedDoctorsModelIDataSource){}
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