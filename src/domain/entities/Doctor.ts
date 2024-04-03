import { ObjectId } from "mongodb";

class Address {
    constructor(
      public street: string,
      public city: string,
      public zipcode: number,
      public country: string
    ) {}
}

class Review {
    constructor(
      public patientName: string,
      public comment: string,
      public rating: number,
      public createdAt: Date = new Date()
    ) {}
  }


class Education {
    constructor(
      public degree: string,
      public institution: string,
      public year: string
    ) {}
  }

class Availability {
    constructor(
      public dayOfWeek: string,
      public startTime: string,
      public endTime: string
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
      public consultationFee: number[],
      public availability: Availability[],
      public profilePic: string,
      public bio: string,
      public createdAt: Date,
      public updatedAt: Date,
      public followers: string[],
      public isVerified:boolean,
      public typesOfConsultation: ('video' | 'chat' | 'clinic')[],
      public maxPatientsPerDay:number,
      public rating : number,
      public reviews?: Review[],
      public isProfileComplete?: boolean,
      public resetToken ?:string | null,
    ) {}
  }

  
export default Doctor;