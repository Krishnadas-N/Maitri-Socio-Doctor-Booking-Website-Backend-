import mongoose from "mongoose";
import { InterestedDoctor } from "../../../domain/entities/InterestedDoctors";
import { IInterstedDoctors } from "../../interfaces/data-sources/interestedDoctors-data-source";

import {InterestedDoctorModel} from './models/interestedDoctor-model'
import { CustomError } from "../../../../utils/CustomError";

export class InterestedDoctorsDataSource implements IInterstedDoctors{
    constructor(){}
   
    async addToInterest(userId: string, doctorId: string): Promise<InterestedDoctor> {
        try {
            if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)){
                throw new CustomError('Invalid  User or Doctor ID', 400);
            }
            const interestedDoctor = new InterestedDoctorModel({
                userId: userId,
                doctorIds: [{ doctorId: doctorId, dateAdded: new Date() }]
            });
            await interestedDoctor.save();
            return interestedDoctor.toObject();
        } catch (error:any) {
            throw new CustomError(error.message||"Failed to add doctor to interests",500);
        }
    }

    async getInterests(userId: string): Promise<InterestedDoctor> {
        try {
            if(!mongoose.Types.ObjectId.isValid(userId)){
                throw new CustomError('Invalid  User ID', 400);
            }
            const [interests] = await InterestedDoctorModel.aggregate([
                {
                    $match:{
                        userId:new mongoose.Types.ObjectId(userId),
                    }
                },{
                    $lookup:{
                        from:'users',
                        let :{"userId":'$userId'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{$eq:["$_id", "$$userId"]}
                                }
                            },
                            {
                                $lookup:{
                                    from:'doctors',
                                    let:{'doctorId':'$doctorIds.doctorId' },
                                    pipeline:[
                                        {
                                            $match:{
                                                $expr:{
                                                    $eq:["$_id","$$doctorId"]
                                                }
                                            }
                                        }
                                    ],
                                    as:'doctorInfo'
                                }
                            }
                        ],
                        as:"userInfo"
                    }
                },
            ])

            console.log(interests,"Log from Interests database");
            return interests.map((interest: any) => interest.toObject());
        } catch (error:any) {
            throw new CustomError(error.message||"Failed to get interests",500);
        }
    }

    async removeInterest(userId: string, doctorId: string): Promise<void> {
        try {
            if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(doctorId)){
                throw new CustomError('Invalid  User or Doctor ID', 400);
            }
            const interest = await InterestedDoctorModel.findOneAndUpdate(
                { userId: userId },
                { $pull: { doctorIds: { doctorId: doctorId } } },
                { new: true }
            ).exec();
            if (!interest) {
                throw new CustomError("Interest not found",404);
            }
        } catch (error:any) {
            throw new CustomError(error.message||"Failed to remove interest",500);
        }
    }
}