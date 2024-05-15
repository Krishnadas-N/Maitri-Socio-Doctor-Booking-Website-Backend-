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
  