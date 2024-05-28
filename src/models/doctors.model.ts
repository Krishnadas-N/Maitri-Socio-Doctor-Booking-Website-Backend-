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

export interface LatestAppointment {
    patient: {
        _id: string;
        name: string;
        profilePic?: string;
    };
    typeOfAppointment: 'video' | 'chat' | 'clinic';
    date: Date;
    slot: string;
}

export interface LatestReview {
    patientName: {
        _id: string;
        name: string;
        profilePic?: string;
    };
    rating: number;
    comment: string;
    createdAt: Date;
}
export interface DashBoardDataResponse {
    dashboardData:DashboardData;
    totalPatients?: number; 
    typeOfAppointments: Record<string, number>;
    latestAppointments: LatestAppointment[];
    latestReviews: LatestReview[];
  }
  
export interface DoctorResponse {
    doctors: Doctor[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}