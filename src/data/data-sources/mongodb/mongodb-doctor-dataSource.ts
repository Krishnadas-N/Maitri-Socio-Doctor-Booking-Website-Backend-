import mongoose from "mongoose";
import { CustomError } from "../../../../utils/CustomError";
import Doctor, { Address, Availability, Education, Review } from "../../../domain/entities/Doctor";
import { DoctorModelInter } from "../../interfaces/data-sources/doctor-data-source";
import DoctorModel from "./models/Doctor-model";
import RoleModel from "./models/role-model";
import { RoleDetails } from "../../../domain/entities/Admin";
export class MongoDbDoctorDataSourceImpl implements DoctorModelInter{
    constructor(){}

    async findByEmail(email: string): Promise<Doctor | null> {
        const DoctorDetails = await  DoctorModel.findOne({ email });
        return  DoctorDetails ?this.convertToDomain(DoctorDetails) : null;
    }

    async DbsaveBasicInfo(doctor: Partial<Doctor>): Promise<string> {
        try {
          const newDoctor = new DoctorModel(doctor);
          const savedDoctor = await newDoctor.save();
        console.log(savedDoctor)
          const doctorId = savedDoctor._id; // Adjust this according to your schema
      
          if (!doctorId) {
            throw new Error('doctor ID not generated after saving');
          }
      
          return doctorId;
        } catch (err:any) {
          throw new CustomError(err.message || 'Error on saving Doctor basic info to database', 500);
        }
      }
      

    async DbsaveProfessionalInfo(doctor: Partial<Doctor>,doctorId:string): Promise<Partial<Doctor> | null> {
        console.log(doctorId,"email from  db save professional")
        const { address, specialization, education, experience, languages, certifications } = doctor;
        const existingDoctor = await DoctorModel.findOne({ _id:doctorId});
        if (!existingDoctor) {
            throw new CustomError("No Such Doctor Found", 404);
        }
        if (!existingDoctor.isVerified) {
            throw new CustomError("Doctor account has not been verified yet. Please complete the verification process.", 403);
        }
        
        if (address) {
            existingDoctor.address = { ...existingDoctor.address, ...address };
        }
        if (specialization) {
            existingDoctor.specialization = specialization;
        }
        if (education) {
            existingDoctor.education=education
        }
        if (experience) {
            existingDoctor.experience = experience;
        }
        if (languages) {
            existingDoctor.languages=languages
        }
        if (certifications) {
            existingDoctor.certifications=certifications
        }
        existingDoctor.registrationStepsCompleted = existingDoctor.registrationStepsCompleted+1
        await existingDoctor.save();
        return existingDoctor;
    }

    async DbsaveAdditionalInfo(doctor: Partial<Doctor>, doctorId: string): Promise<Partial<Doctor> | null> {
            console.log(doctor);
        // const { consultationFee, profilePic, availability, typesOfConsultation, maxPatientsPerDay } = doctor;
        const existingDoctor = await DoctorModel.findOne({ _id:doctorId});
          
        if (!existingDoctor) {
            throw new CustomError("No Such Doctor Found", 404);
        }
        if (!existingDoctor.isVerified) {
            throw new CustomError("Doctor account has not been verified yet. Please complete the verification process.", 403);
        }
        console.log(doctor.consultationFee, "Consultation Fee");
        console.log(doctor.availability);
        const { consultationFee, typesOfConsultation, availability, maxPatientsPerDay } = doctor;
        
        if(consultationFee){
        existingDoctor.consultationFee = consultationFee;
        }
        if(typesOfConsultation){
            const consultationTypes = typesOfConsultation.map((item:any) => item.type);
        existingDoctor.typesOfConsultation = consultationTypes;
        }
        if(availability){
            existingDoctor.availability = availability;
        }
      
        if(maxPatientsPerDay){
        existingDoctor.maxPatientsPerDay = maxPatientsPerDay;
        }
        existingDoctor.registrationStepsCompleted= existingDoctor.registrationStepsCompleted+1
        return await existingDoctor.save();
    }
    

    async verifyDoctor(email:string):Promise<void>{
        try {
            await DoctorModel.updateOne({ email }, {
                $set: { isVerified: true },
                $inc: { registrationStepsCompleted: 1 }
              });
              
        } catch (error) {
            throw new Error(`Error deleting doctor: ${error}`);
        }
    }

    async findById(id: string): Promise<Doctor|null> {
        return DoctorModel.findById(id).populate({
            path: 'specialization',
            select: 'name', // Select the name field from DoctorCategory
            model: 'DoctorCategory',
            options: { // Specify a custom alias for the field
            as: 'psycharitst'
            }
        }).exec() as Promise<Doctor>;
      }

      async findResetTokenAndSavePassword(token: string,password:string): Promise<void> {
        try {
            const doctor = await DoctorModel.findOne({resetToken: token}).exec();
            if (!doctor) {
                throw new CustomError('doctor not found or unauthorized', 404);
              }
            doctor.password = password;
            doctor.resetToken = null;
            await doctor.save();
        } catch (error:any) {
        if (error instanceof CustomError) {
            throw error;
          }
      
          console.error('Unexpected error:', error);
          throw new Error(error.message || 'Internal server error');
        }
        }
    
       async saveResetToken(token: string, email: string): Promise<void> {
        try {
            const doctor = await DoctorModel.findOne({email}); 
            if (!doctor) {
                throw new CustomError('doctor not found or unauthorized', 404);
              }
            if(!doctor.isVerified){
                throw new CustomError('doctor Crenditals is Not Verified', 403);
            }
            doctor.resetToken = token;
             await doctor.save()
            } catch (error:any) {
                if (error instanceof CustomError) {
                    throw error;
                  }
              
                  console.error('Unexpected error:', error);
                  throw new Error(error.message || 'Internal server error');
                }
            
        }
    
    async AcceptprofileComplete(id:string):Promise<Doctor>{
        try {
            if(!mongoose.Types.ObjectId.isValid(id)){
                throw new CustomError('Invalid doctor ID',400)
            }
            const doctor = await DoctorModel.findByIdAndUpdate(id, { isProfileComplete: true }, { new: true }).populate({
                path: 'specialization',
                select: 'name', // Select the name field from DoctorCategory
                model: 'DoctorCategory',
                options: { // Specify a custom alias for the field
                as: 'psycharitst'
                }
            }).exec();
            return doctor?.toObject() as Doctor;
          } catch (error) {
            throw new Error(`Error updating profile completion for doctor ${id}: ${error}`);
          }
    }

    async findDoctors(page?: number, searchQuery?: string,itemsPerPage?:number): Promise<Doctor[]> {
        try{
            const pageNum = page || 1
            const perPage = itemsPerPage || 10; // Number of items per page
            const skip = (pageNum - 1) * perPage;
            let query: any = {};
            if(searchQuery){
                query = {
                    $or: [
                      { firstName: { $regex: searchQuery, $options: 'i' } }, 
                      { lastName: { $regex: searchQuery, $options: 'i' } }, 
                    ],
                };
            }
            const doctors = await DoctorModel.find(query)
                            .populate({
                                path: 'specialization',
                                select: 'name', // Select the name field from DoctorCategory
                                model: 'DoctorCategory',
                                options: { // Specify a custom alias for the field
                                as: 'psycharitst'
                                }
                            })
                            .skip(skip)
                            .limit(perPage)
                            .exec();

            return doctors;
        }catch(error:any){
            if (error instanceof CustomError) {
                throw error;
              }
          
              console.error('Unexpected error:', error);
              throw new Error(error.message || 'Internal server error');
            }
        }
    
   async changeStatusofDoctor(id: string): Promise<Doctor> {
    try{
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new CustomError("Invalid id format", 400);
        }
        const doctor = await DoctorModel.findById(id).populate({
            path: 'specialization',
            select: 'name', // Select the name field from DoctorCategory
            model: 'DoctorCategory',
            options: { // Specify a custom alias for the field
            as: 'psycharitst'
            }
        }).exec();
        
        if (!doctor) {
            throw new CustomError("Doctor not found", 404);
        }
        doctor.isBlocked = !doctor.isBlocked;
        await doctor.save();
         return  doctor
    }catch(error:any){
        if (error instanceof CustomError) {
            throw error;
          }
      
          console.error('Unexpected error:', error);
          throw new Error(error.message || 'Internal server error');
        }
    }
    async changeProfilePic(doctorId:string,image:string):Promise<void>{
        await DoctorModel.updateOne({_id:doctorId}, {$set:{profilePic:image}}); 
      }
      
      async saveSelectedSlots(doctorId: string, selectedSlots: { date: Date; slots: string[]; }[]): Promise<Doctor> {
        try {
            const doctor = await DoctorModel.findOneAndUpdate({_id:doctorId},{selectedSlots:selectedSlots},{new:true});
            if (!doctor) {
                throw new CustomError('Doctor not found', 403);
            }
            return doctor;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to save selected slots', 500);
            }
        }
    }
    private async fetchRoleDetails(roleIds: string[]): Promise<RoleDetails[]> {
        try {
            const roles = await RoleModel.find({ _id: { $in: roleIds } });
            const roleDetails: RoleDetails[] = roles.map(role => ({
                roleId: role._id.toString(),
                roleName: role.name,
                permissions: role.permissions // Assuming your RoleModel has a 'permissions' field
            }));
            return roleDetails;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }

    private async convertToDomain(doctorData: Doctor | null): Promise<Doctor | null> {
        if (!doctorData) return null;
    
        const roleIds: string[] = doctorData?.roles?.map(role => role.toString()) || [];
        const roleDetails: RoleDetails[] = await this.fetchRoleDetails(roleIds);
    
        const address = doctorData.address ? new Address(doctorData.address.state, doctorData.address.city, doctorData.address.zipcode, doctorData.address.country) : doctorData.address;
        const education = doctorData.education ? doctorData.education.map(edu => new Education(edu.degree, edu.institution, edu.year)) : [];
        const availability = doctorData.availability ? doctorData.availability.map(avail => new Availability(avail.dayOfWeek, avail.startTime, avail.endTime, avail.isAvailable)) : [];
        const reviews = doctorData.reviews ? doctorData.reviews.map(review => new Review(review.patientName, review.comment, review.rating, review.createdAt)) : [];
    
        const doctor = new Doctor(
            doctorData._id,
            doctorData.firstName,
            doctorData.lastName,
            doctorData.gender,
            doctorData.dateOfBirth,
            doctorData.email,
            doctorData.password,
            doctorData.phone,
            address,
            doctorData.specialization,
            education,
            doctorData.experience,
            doctorData.certifications,
            doctorData.languages,
            availability,
            doctorData.profilePic,
            doctorData.bio,
            doctorData.isVerified,
            doctorData.typesOfConsultation,
            doctorData.maxPatientsPerDay,
            roleDetails,
            doctorData.consultationFee,
            doctorData.registrationStepsCompleted,
            doctorData.createdAt,
            doctorData.updatedAt,
            doctorData.followers,
            doctorData.rating,
            doctorData.isBlocked,
            reviews,
            doctorData.isProfileComplete,
            doctorData.resetToken,
            doctorData.selectedSlots
        );
    
        return doctor.toJson(); // Assuming toJSON() method is defined in Doctor class
    }
    
   
    
      
}