import Doctor from "../domain/entities/Doctor"; 

export interface LoginResponse {
    doctor: Doctor;
    token: string;
  }
  