import { ObjectId } from "mongodb";
import { RoleDetails } from "./Admin";

export class Address {
    constructor(
      public state: string,
      public city: string,
      public zipcode: number,
      public country: string
    ) {}
}

export class Review {
    constructor(
      public patientName: string,
      public comment: string,
      public rating: number,
      public createdAt: Date = new Date()
    ) {}
  }


export class Education {
    constructor(
      public degree: string,
      public institution: string,
      public year: string
    ) {}
  }

export class Availability {
    constructor(
      public dayOfWeek: string,
      public startTime: string,
      public endTime: string
    ) {}
}

class consultationFee{
  constructor(
    public type: 'video'|'chat'| 'clinic',
    public fee: number,
  ) {}
  }

class Doctor {
    constructor(
      public _id: string,
      public firstName: string,
      public lastName: string,
      public gender: 'Male'|'Female'|'Other',
      public dateOfBirth: Date,
      public email: string,
      public password:string,
      public phone: number,
      public address: Address,
      public specialization: string | ObjectId,
      public education: Education[],
      public experience: string,
      public certifications: string[],
      public languages: string[],
      public availability: Availability[],
      public profilePic: string,
      public bio: string,
      public isVerified:boolean,
      public typesOfConsultation: ('video' | 'chat' | 'clinic')[],
      public maxPatientsPerDay:number,
      public roles:string[] | RoleDetails[],
      public consultationFee: consultationFee[],
      public registrationStepsCompleted :number,
      public createdAt?: Date,
      public updatedAt?: Date,
      public followers?: string[],
      public rating ?: number,
      
      public isBlocked?:boolean,
      public reviews?: Review[],
      public isProfileComplete?: boolean,
      public resetToken ?:string | null,
    
    ) {}


    toJson(): any {
      return {
          _id: this._id,
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          dateOfBirth: this.dateOfBirth,
          email: this.email,
          password: this.password,
          phone: this.phone,
          address: {
              state: this.address.state,
              city: this.address.city,
              zipcode: this.address.zipcode,
              country: this.address.country
          },
          specialization: this.specialization,
          education: this.education.map(edu => ({
              degree: edu.degree,
              institution: edu.institution,
              year: edu.year
          })),
          experience: this.experience,
          certifications: this.certifications,
          languages: this.languages,
          consultationFee: this.consultationFee,
          availability: this.availability.map(avail => ({
              dayOfWeek: avail.dayOfWeek,
              startTime: avail.startTime,
              endTime: avail.endTime
          })),
          registrationStepsCompleted:this.registrationStepsCompleted,
          profilePic: this.profilePic,
          bio: this.bio,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
          followers: this.followers,
          isVerified: this.isVerified,
          typesOfConsultation: this.typesOfConsultation,
          maxPatientsPerDay: this.maxPatientsPerDay,
          rating: this.rating,
          isBlocked: this.isBlocked,
          reviews: this.reviews?.map(review => ({
              patientName: review.patientName,
              comment: review.comment,
              rating: review.rating,
              createdAt: review.createdAt
          })),
          isProfileComplete: this.isProfileComplete,
          resetToken: this.resetToken,
          roles: this.roles
      };
  }
  }

  
export default Doctor;