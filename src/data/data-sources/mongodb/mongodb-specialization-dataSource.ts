import mongoose from "mongoose";
import { CustomError } from "../../../../utils/CustomError";
import { DoctorSpecializtion } from "../../../domain/entities/Specialization";
import { SpecilaizationInter } from "../../interfaces/data-sources/specialization-data-source";
import DoctorCategoryModel from "./models/Doctor-Specialization-model";


export class MongoDbDoctorSpecializtionDataSource implements SpecilaizationInter{
  constructor() {}

  async create(
    specData: Pick<DoctorSpecializtion, "name" | "description">
  ): Promise<void> {
    const specialization = new DoctorCategoryModel({ ...specData });
    await specialization.save();
  }
  async findAll(): Promise<DoctorSpecializtion[] | null> {
    const specializations = await DoctorCategoryModel.find().exec();
    return specializations || null;
  }

  async updateSpec(
    id: string,
    specData: Pick<DoctorSpecializtion, "name" | "description">
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid ID parameter', 403);
  }
    const result = await DoctorCategoryModel.updateOne({ _id: id }, specData, {
      upsert: true,
    });
    console.log(result);
    if (!result || result?.modifiedCount === 0)
      throw new CustomError("The Specialization is Not Found", 404);
  }

  async blockSpec(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError('Invalid ID parameter', 403);
    }
      const doctorCategory = await DoctorCategoryModel.findById(id);
      if (!doctorCategory) {
        throw new CustomError("DoctorCategory not found", 404);
      }
      doctorCategory.isBlocked = !doctorCategory.isBlocked;
      await doctorCategory.save();
      return true;
    } catch (err: any) {
      throw new CustomError(
        err.message || "Error while Block the Specilalization in the databse",
        404
      );
    }
  }
  async findOne(id: string): Promise<DoctorSpecializtion | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid ID parameter', 403);
  }
    const specialization = await DoctorCategoryModel.findById(id).exec();
    return specialization || null;
  }
  async getByName(name: string): Promise<DoctorSpecializtion | null> {
    const regexPattern = new RegExp(name, 'i');
      
    try {
      return await DoctorCategoryModel.findOne({ name: regexPattern }).exec();
  } catch (error:any) {
      // Handle errors
      console.error("Error while searching specialization by name:", error);
      throw new CustomError(error.message || 'Error while searching specialization by name',500);
  }
  }
}