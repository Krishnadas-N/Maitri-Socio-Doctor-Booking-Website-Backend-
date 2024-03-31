import { CustomError } from "../../../../utils/CustomError";
import Doctor from "../../../domain1/entities/Doctor";
import { DoctorModelInter } from "../../interfaces/data-sources/doctor-data-source";
import DoctorModel from "./models/Doctor-model";

export class MongoDbDoctorDataSourceImpl implements DoctorModelInter{
    constructor(){}

    async findByEmail(email: string): Promise<Doctor | null> {
        const DoctorDetails = await  DoctorModel.findOne({ email });
        return  DoctorDetails ?DoctorDetails : null;
    }

    async DbsaveBasicInfo(doctor: Partial<Doctor>): Promise<string> {
        try {
          const newDoctor = new DoctorModel(doctor);
          const savedDoctor = await newDoctor.save();
        console.log(savedDoctor)
          const userId = savedDoctor._id; // Adjust this according to your schema
      
          if (!userId) {
            throw new Error('User ID not generated after saving');
          }
      
          return userId;
        } catch (err:any) {
          throw new CustomError(err.message || 'Error on saving Doctor basic info to database', 500);
        }
      }
      

    async DbsaveProfessionalInfo(doctor: Partial<Doctor>,email:string): Promise<void> {
        console.log(email,"email from  db save professional")
        const { address, specialization, education, experience, languages, certifications } = doctor;
        const existingDoctor = await DoctorModel.findOne({ email });
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
            existingDoctor.education.push(...education);
        }
        if (experience) {
            existingDoctor.experience = experience;
        }
        if (languages) {
            existingDoctor.languages.push(...languages);
        }
        if (certifications) {
            existingDoctor.certifications.push(...certifications);
        }
        await existingDoctor.save();
    }

    async DbsaveAdditionalInfo(doctor: Partial<Doctor>, email: string): Promise<void> {
        const { consultationFee, profilePic, availability, typesOfConsultation, maxPatientsPerDay } = doctor;
        const existingDoctor = await DoctorModel.findOne({ email });
        if (!existingDoctor) {
            throw new CustomError("No Such Doctor Found", 404);
        }
        if (!existingDoctor.isVerified) {
            throw new CustomError("Doctor account has not been verified yet. Please complete the verification process.", 403);
        }
        
        if (consultationFee) {
            existingDoctor.consultationFee = consultationFee;
        }
    
        if (profilePic) {
            existingDoctor.profilePic = profilePic;
        }
    
        if (availability) {
            existingDoctor.availability = availability;
        }
    
        if (typesOfConsultation !== undefined) {
            existingDoctor.typesOfConsultation = typesOfConsultation;
        }
    
        if (maxPatientsPerDay !== undefined) {
            existingDoctor.maxPatientsPerDay = maxPatientsPerDay;
        }
    
        await existingDoctor.save();
    }
    

    async verifyDoctor(email:string):Promise<void>{
        try {
           await DoctorModel.updateOne({email},{$set:{
            isVerified:true
           }});
        } catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }

    async findById(id: string): Promise<Doctor|null> {
        return DoctorModel.findById(id).exec() as Promise<Doctor>;
      }
  
}