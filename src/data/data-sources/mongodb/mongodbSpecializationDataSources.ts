import mongoose from "mongoose";
import { CustomError } from "../../../utils/customError"; 
import { DoctorSpecializtion } from "../../../domain/entities/Specialization";
import { SpecilaizationModelIDataSource } from "../../interfaces/data-sources/doctorSpecializationIDataSource";
import {doctorCategoryModel} from "./models/doctorSpecializationModel";
import {doctorModel} from "./models/doctorModel";

export class MongoDbDoctorSpecializtionDataSource implements SpecilaizationModelIDataSource{
  constructor() {}

  async create(
    specData: Pick<DoctorSpecializtion, "name" | "description">
  ): Promise<DoctorSpecializtion> {
    const specialization = new doctorCategoryModel({ ...specData });
    return  await specialization.save();
  }
  async findAll(): Promise<DoctorSpecializtion[] | null> {
    const specializations = await doctorCategoryModel.find().exec();
    return specializations || null;
  }

      async updateSpec(
        id: string,
        specData: Pick<DoctorSpecializtion, "name" | "description">
      ): Promise<DoctorSpecializtion> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new CustomError('Invalid ID parameter', 403);
      }
  
      const result = await doctorCategoryModel.findOneAndUpdate({ _id: id }, specData, { upsert: true, new: true  });
      
      console.log(result);
  
      if (!result) {
          throw new CustomError("The Specialization is Not Found", 404);
      }
  
      return result;
      }

  async blockSpec(id: string): Promise<DoctorSpecializtion> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError('Invalid ID parameter', 403);
    }
      const doctorCategory = await doctorCategoryModel.findById(id);
      if (!doctorCategory) {
        throw new CustomError("DoctorCategory not found", 404);
      }
      doctorCategory.isBlocked = !doctorCategory.isBlocked;
      await doctorCategory.save();
      if (doctorCategory.isBlocked) {
        await doctorModel.updateMany({ specialization: doctorCategory._id }, { isBlocked: true });
    }
      return doctorCategory;
    } catch (error:unknown) {
      if (error instanceof CustomError) {
          throw error;
      } else {
          const castedError = error as Error
    console.error('Unexpected error:', error);
    throw new CustomError(castedError.message || 'Internal server error',500);
      }
  }
  }
  async findOne(id: string): Promise<DoctorSpecializtion | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid ID parameter', 403);
  }
    const specialization = await doctorCategoryModel.findById(id).exec();
    return specialization || null;
  }
  async getByName(name: string): Promise<DoctorSpecializtion | null> {
    const regexPattern = new RegExp(name, 'i');
      
    try {
      return await doctorCategoryModel.findOne({ name: regexPattern }).exec();
  }catch (error:unknown) {
    if (error instanceof CustomError) {
        throw error;
    } else {
        const castedError = error as Error
  console.error('Unexpected error:', error);
  throw new CustomError(castedError.message || 'Internal server error',500);
    }
}
  }
}