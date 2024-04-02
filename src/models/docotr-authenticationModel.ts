import Doctor from "../domain1/entities/Doctor";

export interface LoginResponse {
    doctor: Doctor;
    token: string;
  }
  