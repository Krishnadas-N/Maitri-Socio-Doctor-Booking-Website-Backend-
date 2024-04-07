import Doctor from "../../../entities/Doctor";

export interface IDoctorUsecase{
    GetDoctors(page:number,searchQuery:string,itemsPerPage: number):Promise<Doctor[]>;
}