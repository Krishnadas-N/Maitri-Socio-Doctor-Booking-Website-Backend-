import Doctor from "../../../entities/Doctor";

export interface IDoctorUsecase{
    GetDoctors(page:number,searchQuery:string,itemsPerPage: number):Promise<Doctor[]>;
    changeDoctorStatus(id: string): Promise<Doctor> ;
    getDoctorById(id:string):Promise<Doctor | null> ;
}