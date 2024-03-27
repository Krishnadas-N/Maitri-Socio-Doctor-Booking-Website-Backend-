import { Request, Response, NextFunction } from 'express';
import { sendSuccessResponse } from '../../../utils/ReponseHandler';
import { CustomError } from '../../../utils/CustomError';
import { DoctorSpecService } from '../../domain1/interfaces/use-cases/Doctor-Service/SpecializationService/doctor-specialization';



export class SpecializationController {
    constructor(private readonly specializationService: DoctorSpecService) {}

    async addSpec(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const data = req.body;
            await this.specializationService.addSpec(data);
            sendSuccessResponse(res,{data: "Specialization added successfully"},"Specialization added successfully");
        } catch (error) {
            next(error)
        }
    }

    async blockSpec(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const id: string = req.params.id;
            const isBlocked = await this.specializationService.blockSpec(id);
            res.status(200).json({ blocked: isBlocked });
            sendSuccessResponse(res,isBlocked ,'specification has been successfully blocked');
        } catch (error) {
           next(error)
        }
    }

    async getAllSpec(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const specializations = await this.specializationService.getAllSpec();
            res.status(200).json(specializations);
            sendSuccessResponse(res,specializations, "all specializations have been fetched");
        } catch (error) {
           next(error)
        }
    }

    async updateSpec(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const id: string = req.params.id;
            const data = {...req.body.data, _id:id};
            
            await this.specializationService.updateSpec(data);
            res.status(200).send('Specialization updated successfully');
            sendSuccessResponse(res,{},"specialization has been successfully updated")
        } catch (error) {
           next(error)
        }
    }

    async findASpec(req: Request, res: Response ,next:NextFunction): Promise<void> {
        try {
            const id: string = req.params.id;
            const specialization = await this.specializationService.findASpec(id);
            if (!specialization) {
                throw new CustomError('Specialization not found',404);
            } else {
                sendSuccessResponse(res,specialization,"Specialization has been found");
            }
        } catch (error) {
           next(error)
        }
    }
}