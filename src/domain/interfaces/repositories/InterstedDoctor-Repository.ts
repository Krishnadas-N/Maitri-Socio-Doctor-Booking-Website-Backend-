import { InterestedDoctor } from "../../entities/InterestedDoctors";

export interface IIntersetedDoctorsRepo {
    addInterest(userId: string, doctorId: string): Promise<InterestedDoctor>;
    removeInterest(userId: string, doctorId: string): Promise<void>;
    getUserInterests(userId: string): Promise<InterestedDoctor>;
}