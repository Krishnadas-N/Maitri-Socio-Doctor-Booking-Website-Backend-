import { RoleDetails } from "./Admin";
import { objectId } from "../../models/users.model";

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
      public appointmentId:string | objectId,
      public doctor :string | objectId,
      public patientName: string | objectId,
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
      public endTime: string,
      public isAvailable: boolean,
    ) {}
}

class consultationFee{
  constructor(
    public type: 'video'|'chat'| 'clinic',
    public fee: number,
  ) {}
  }

 export interface Follower {
    userId: objectId | string;
    userModel: 'User' | 'Doctor';
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
      public specialization: string | objectId,
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
      public followers?: Follower[],
      public isBlocked?:boolean,
      public isProfileComplete?: boolean,
      public resetToken ?:string | null,
      public selectedSlots?:[{
        date: Date,
        slots: string[], 
      }],
    
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
          isBlocked: this.isBlocked,
          isProfileComplete: this.isProfileComplete,
          resetToken: this.resetToken,
          selectedSlots:this.selectedSlots,
          roles: this.roles,
          
      };
  }
  }

  
export default Doctor;