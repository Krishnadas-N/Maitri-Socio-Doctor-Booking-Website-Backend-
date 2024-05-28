import mongoose from "mongoose";
import { CustomError } from "../../../utils/customError"; 
import Doctor, { Address, Availability, Education, Follower, Review } from "../../../domain/entities/Doctor";
import { IDoctorModelIDataSource } from "../../interfaces/data-sources/doctorIDataSources";
import {doctorModel} from "./models/doctorModel";
import {roleModel} from "./models/roleModel";
import { RoleDetails } from "../../../domain/entities/Admin";
import { ReviewModel } from "./models/ReviewAndRatingModel";
import { appointmentModel } from "./models/appoinmentModel";
import { DashBoardDataResponse, DashboardData, LatestAppointment, LatestReview, TypeOfAppointmentData } from "../../../models/doctors.model";
import { CategorizedDoctorsResult } from "../../../models/common.models";

export class MongoDbDoctorDataSourceImpl implements IDoctorModelIDataSource{
    constructor(){}

    async findByEmail(email: string): Promise<Doctor | null> {
        const DoctorDetails = await  doctorModel.findOne({ email });
        return  DoctorDetails ?this.convertToDomain(DoctorDetails) : null;
    }

    async DbsaveBasicInfo(doctor: Partial<Doctor>): Promise<string> {
        try {
          const newDoctor = new doctorModel(doctor);
          const savedDoctor = await newDoctor.save();
          console.log(savedDoctor)
          const doctorId = savedDoctor._id; // Adjust this according to your schema
      
          if (!doctorId) {
            throw new Error('doctor ID not generated after saving');
          }
      
          return doctorId;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          throw new CustomError(castedError.message || 'Error on saving Doctor basic info to database', 500);
        }
       }
      }
      

    async DbsaveProfessionalInfo(doctor: Partial<Doctor>,doctorId:string): Promise<Partial<Doctor> | null> {
        console.log(doctorId,"email from  db save professional")
        const { address, specialization, education, experience, languages, certifications } = doctor;
        const existingDoctor = await doctorModel.findOne({ _id:doctorId});
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
        const existingDoctor = await doctorModel.findOne({ _id:doctorId});
          
        if (!existingDoctor) {
            throw new CustomError("No Such Doctor Found", 404);
        }
        if (!existingDoctor.isVerified) {
            throw new CustomError("Doctor account has not been verified yet. Please complete the verification process.", 403);
        }
        console.log(doctor.consultationFee, "Consultation Fee");
        console.log(doctor.availability);
        const { consultationFee, typesOfConsultation, availability, maxPatientsPerDay,bio } = doctor;
        
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
        if(bio){
            existingDoctor.bio = bio;
        }
        if(maxPatientsPerDay){
        existingDoctor.maxPatientsPerDay = maxPatientsPerDay;
        }
        existingDoctor.registrationStepsCompleted= existingDoctor.registrationStepsCompleted+1
        return await existingDoctor.save();
    }
    

    async verifyDoctor(email:string):Promise<void>{
        try {
            await doctorModel.updateOne({ email }, {
                $set: { isVerified: true },
                $inc: { registrationStepsCompleted: 1 }
              });
              
        } catch (error) {
            throw new Error(`Error deleting doctor: ${error}`);
        }
    }

    async findById(id: string): Promise<Doctor|null> {
        return doctorModel.findById(id).populate({
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
            const doctor = await doctorModel.findOne({resetToken: token}).exec();
            if (!doctor) {
                throw new CustomError('doctor not found or unauthorized', 404);
              }
            doctor.password = password;
            doctor.resetToken = null;
            await doctor.save();
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new Error(castedError.message || 'Internal server error');
            }
        }
        }
    
       async saveResetToken(token: string, email: string): Promise<void> {
        try {
            const doctor = await doctorModel.findOne({email}); 
            if (!doctor) {
                throw new CustomError('doctor not found or unauthorized', 404);
              }
            if(!doctor.isVerified){
                throw new CustomError('doctor Crenditals is Not Verified', 403);
            }
            doctor.resetToken = token;
             await doctor.save()
            }  catch (error:unknown) {
                if (error instanceof CustomError) {
                    throw error;
                } else {
                    const castedError = error as Error
              console.error('Unexpected error:', error);
              throw new Error(castedError.message || 'Internal server error');
                }
            }
            
        }
    
    async AcceptprofileComplete(id:string):Promise<Doctor>{
        try {
            if(!mongoose.Types.ObjectId.isValid(id)){
                throw new CustomError('Invalid doctor ID',400)
            }
            const doctor = await doctorModel.findByIdAndUpdate(id, { isProfileComplete: true }, { new: true }).populate({
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
            const doctors = await doctorModel.find(query)
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
    
        async changeProfilePic(doctorId:string,image:string):Promise<void>{
            await doctorModel.updateOne({_id:doctorId}, {$set:{profilePic:image}}); 
          }
          
   
      async saveSelectedSlots(doctorId: string, selectedSlots: { date: Date; slots: string[]; }[]): Promise<Doctor> {
        try {
            const doctor = await doctorModel.findOneAndUpdate({_id:doctorId},{selectedSlots:selectedSlots},{new:true});
            if (!doctor) {
                throw new CustomError('Doctor not found', 403);
            }
            return doctor;
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

    async getDoctorCurrentStatus(doctorId:string): Promise<Doctor> {
        try {
            const doctor = await doctorModel.findById(doctorId);
            if (!doctor) {
                throw new CustomError('Doctor not found', 403);
            }
            return doctor;
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
    private async fetchRoleDetails(roleIds: string[]): Promise<RoleDetails[]> {
        try {
            const roles = await roleModel.find({ _id: { $in: roleIds } });
            const roleDetails: RoleDetails[] = roles.map(role => ({
                roleId: role._id.toString(),
                roleName: role.name,
                permissions: role.permissions // Assuming your roleModel has a 'permissions' field
            }));
            return roleDetails;
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

    private async convertToDomain(doctorData: Doctor | null): Promise<Doctor | null> {
        if (!doctorData) return null;
    
        const roleIds: string[] = doctorData?.roles?.map(role => role.toString()) || [];
        const roleDetails: RoleDetails[] = await this.fetchRoleDetails(roleIds);
    
        const address = doctorData.address ? new Address(doctorData.address.state, doctorData.address.city, doctorData.address.zipcode, doctorData.address.country) : doctorData.address;
        const education = doctorData.education ? doctorData.education.map(edu => new Education(edu.degree, edu.institution, edu.year)) : [];
        const availability = doctorData.availability ? doctorData.availability.map(avail => new Availability(avail.dayOfWeek, avail.startTime, avail.endTime, avail.isAvailable)) : [];
    
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
            doctorData.isBlocked,
            doctorData.isProfileComplete,
            doctorData.resetToken,
            doctorData.selectedSlots
        );
    
        return doctor.toJson(); // Assuming toJSON() method is defined in Doctor class
    }
    
   
    async getSimilarProfiles(specializationId:string):Promise<Doctor[]>{
        try{
          const doctors = await doctorModel.find({specialization:specializationId}).populate('specialization').select('firstName lastName specialization profilePic followers');
          console.log("Doctors from similar profiles",doctors);
          return doctors
        } catch (error: unknown) {
          if (error instanceof CustomError) {
              throw error;
          } else {
              const castedError = error as Error;
              console.error("Error in getSimilarProfiles:", castedError);
              throw new CustomError(
                  castedError.message || "Error while getting similar profiles",
                  500
              );
          }
      }
      }

      async followOrUnfollowDoctors(doctorId: string, userId: string,userType:'Doctor'|'User'): Promise<Follower[]> {
        try {
            const doctor = await doctorModel.findById(doctorId);
            
            if (!doctor) {
                throw new CustomError("Invalid DoctorId", 400);
            }
            if(!doctor?.followers){
                doctor.followers =[]  
            }
            const index = doctor?.followers.findIndex((follower:Follower) => follower.userId.toString() === userId) || -1
    
            if (index === -1) {
                doctor.followers.push({ userId, userModel: userType });
            } else {
                doctor.followers.splice(index, 1);
            }
            await doctor.save();
            return  doctor.followers;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                console.error("Error in followOrUnfollowDoctors:", error);
                throw new CustomError("Error while following/unfollowing doctor", 500);
            }
        }
    }
    
    async addReview(appoinmentId: string, userId: string, rating: number, comment: string): Promise<Review> {
        try {
            console.log(appoinmentId,userId,rating,comment);
            const appointment = await appointmentModel.findOne({ _id: appoinmentId, patient: userId,status:'Completed' });
            if (!appointment) {
                throw new CustomError("No appointment found for this user with the doctor", 400);
            }
                console.log(appointment)
            const review = new ReviewModel({
                appointmentId:appoinmentId,
                doctor: appointment.doctor,
                patientName: userId,
                rating,
                comment
            });
    
            const savedReview = await review.save();
    
            return savedReview;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                console.error("Error in followOrUnfollowDoctors:", castedError);
                throw new CustomError(castedError.message || "Error adding review: ", 500);
            }
        }
    }

    async getReviewsOfDoctor(doctorId: string): Promise<Review[]> {
        try {
            if (!doctorId) {
                throw new CustomError("No doctorId found for this user with the doctor", 400);
            }
    
            const doctorReviews = await ReviewModel.find({ doctor: doctorId })
            .populate('appointmentId')
            .populate('patientName')
            .exec();

             console.log('😊🤣😊🤣', doctorReviews);

            return doctorReviews;
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                console.error("Error in followOrUnfollowDoctors:", castedError);
                throw new CustomError(castedError.message || "Error adding review: ", 500);
            }
        }
    }
    

    async  getDoctorDashboardDetails(doctorId: string):Promise<DashBoardDataResponse> {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); // Include current month

            const statistics = await appointmentModel.aggregate([
            {
                $match: {
                doctor: new mongoose.Types.ObjectId(doctorId),
                date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                _id: { month: { $month: '$date' } },
                totalAppointments: { $sum: 1 },
                completedAppointments: {
                    $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
                },
                cancelledAppointments: {
                    $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
                },
                distinctPatients: { $addToSet: '$patient' } ,
                }
            },
            {
                $project: {
                _id: 0,
                month: '$_id.month',
                totalAppointments: 1,
                completedAppointments: 1,
                cancelledAppointments: 1,
                totalPatients: { $size: '$distinctPatients' } 
                }
            },
            ]);
            const typeOfAppointmentData= await appointmentModel.aggregate([
                {
                    $match: {
                    doctor: new mongoose.Types.ObjectId(doctorId),
                    date: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                  $group: {
                    _id: "$typeOfAppointment",
                    count: { $sum: 1 }
                  }
                },
                {
                  $sort: { _id: 1 } 
                }
              ])
              const typeOfAppointments: Record<string, number> = {};
              typeOfAppointmentData.forEach((item: TypeOfAppointmentData) => {
                typeOfAppointments[item._id] = item.count;
            });
            const allAppointmentTypes = ["video", "chat", "clinic"]; 
            allAppointmentTypes.forEach(appointmentType => {
                if (!Object.prototype.hasOwnProperty.call(typeOfAppointments, appointmentType)) {
                    typeOfAppointments[appointmentType] = 0; 
                }
            });

             // Fetching latest 7 appointments
        const latestAppointments = await appointmentModel.find({
            doctor: doctorId
        })
        .sort({ date: -1 })
        .limit(7)
        .populate('patient', 'fullName profilePic')
        .select('patient typeOfAppointment date slot');

        // Fetching latest 7 reviews
        const latestReviews = await ReviewModel.find({
            doctor: doctorId
        })
        .sort({ createdAt: -1 })
        .limit(7)
        .populate('patientName', 'fullName profilePic')
        .select('patientName rating comment createdAt');

        console.log("latestReviews",latestReviews,"latestAppointments",latestAppointments)
                        console.log("statistics",statistics)
            const  totalPatients = statistics[0]?.totalPatients || 0;
            const dashboardData: DashboardData = {};
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

         
            for (let i = 1; i <= 12; i++) {
            const monthName = monthNames[i - 1];
            const matchingStat = statistics.find(stat => stat.month === i);

            dashboardData[monthName] = {
               
                totalAppointments: matchingStat ? matchingStat.totalAppointments : 0,
                completedAppointments: matchingStat ? matchingStat.completedAppointments : 0,
                cancelledAppointments: matchingStat ? matchingStat.cancelledAppointments : 0
            };
            }
            console.log("dashboardData",dashboardData,"totalPatients",totalPatients)
            return {dashboardData:dashboardData,
                totalPatients, 
                typeOfAppointments: typeOfAppointments,
                latestAppointments: latestAppointments as unknown as LatestAppointment[],
                latestReviews: latestReviews as unknown as LatestReview[] };
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                console.error("Error in getDoctorDashboardDetails:", error);
                throw new CustomError(castedError.message || "Error fetching doctor dashboard details", 500);
            }
        }
    }


    async editDoctorData(doctorId:string,doctor: Partial<Doctor>): Promise<Doctor> {
        try {
          const savedDoctor = await doctorModel.findByIdAndUpdate(doctorId,doctor)
          console.log(savedDoctor)
      
          if (!savedDoctor) {
            throw new CustomError('Unauthorized Doctor or Please Try again Later',404);
          }
      
          return savedDoctor;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          throw new CustomError(castedError.message || 'Error on saving Doctor basic info to database', 500);
        }
       }
      }
      

   
   
}