import Doctor from "../../../entities/Doctor";

export interface IDoctorUsecase{
    GetDoctors(page:number,searchQuery:string,itemsPerPage: number):Promise<Doctor[]>;
    changeDoctorStatus(id: string): Promise<Doctor> ;
    getDoctorById(id:string):Promise<Doctor | null> ;
    changeProfilePic(doctorId:string,image:string):Promise<void>;
    saveSelectedSlots(doctorId: string, selectedSlots: { date: Date, slots: string[] }[]): Promise<Doctor>;
}