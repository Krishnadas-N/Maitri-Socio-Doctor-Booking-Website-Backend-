import { InterestedDoctor } from "../../../entities/InterestedDoctors"; 

export interface IInterestedDoctorsUseCase {
    addInterestForUser(userId: string, doctorId: string): Promise<InterestedDoctor>;
    removeInterestForUser(userId: string, doctorId: string): Promise<void>;
    getUserInterestsForUser(userId: string): Promise<InterestedDoctor>;
}
