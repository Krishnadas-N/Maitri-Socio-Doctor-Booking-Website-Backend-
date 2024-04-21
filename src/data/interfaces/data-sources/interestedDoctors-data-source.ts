import { InterestedDoctor } from "../../../domain/entities/InterestedDoctors";

export interface IInterstedDoctors{
    addToInterest(userId: string, doctorId: string): Promise<InterestedDoctor>;
    removeInterest(userId: string, doctorId: string): Promise<void>;
    getInterests(userId: string): Promise<InterestedDoctor>;
}