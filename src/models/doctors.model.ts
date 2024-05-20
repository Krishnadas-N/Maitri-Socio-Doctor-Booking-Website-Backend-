import Doctor from "../domain/entities/Doctor";

export interface DashboardData {
    [key: string]: {
        totalAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
    };
}
export interface TypeOfAppointmentData {
    _id: string;
    count: number;
}
export interface DashBoardDataResponse {
    dashboardData:DashboardData;
    totalPatients?: number; 
    typeOfAppointments: Record<string, number>;
  }
  
export interface DoctorResponse {
    doctors: Doctor[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}