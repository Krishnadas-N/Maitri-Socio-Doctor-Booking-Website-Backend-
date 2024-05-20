export interface MonthlyStats {
    year: number;
    month: number;
    stats: {
      [key: string]: number;
    };
  }
  
 export  interface MonthlyRevenue {
    year: number;
    month: number;
    monthlyRevenue: number;
  }
  
  export interface AdminDashboardDetails {
    doctorsCount: number;
    patientsCount: number;
    totalCompleted: number;
    monthlyStats: MonthlyStats[];
    totalRevenue: number;
    monthlyRevenue:  MonthlyRevenue[]
  }
  

  export interface UserDetails {
    _id: string;
    fullName: string;
    profilePic: string;
    lastAppointmentDate: Date;
    totalPaid: number;
  }
  
 export interface DoctorDetails {
    _id: string;
    fullName: string;
    profilePic: string;
    totalEarnings: number;
    averageRating: number;
    specialization:string
  }
  
 export interface AdminDashboardUserandDoctorDetails {
    patients: UserDetails[];
    doctors: DoctorDetails[];
  }

  export interface AppointmentListResponse {
    appointments: {
      doctorName: string;
      doctorProfilePic: string;
      speciality: string;
      patientName: string;
      patientProfilePic: string;
      appointmentTime: string;
      status: string;
      paymentStatus: string;
      amount: number;
    }[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }


 export interface AdminAppointmentDetails {
  typeOfAppointment: string;
  date: Date;
  slot: string;
  amount: number;
  duration: number;
  status: string;
  paymentStatus: string;
  prescription: {
    file: string;
    title: string;
  } | null; // Prescription can be null if not provided
  cancellationRequests: {
    status: string;
    reason: string;
    createdAt: Date;
  } | null; // Cancellation request can be null if not requested
  doctorDetails: {
    _id:string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    profilePic: string;
  };
  patientDetails: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    profilePic: string;
  };
  medicalRecords: {
    title: string;
    fileUrl: string;
  }[];
  doctorReviews: number; 
  }
  

 export interface ReviewDetails {
  _id:string;
    patientName: string;
    doctorName: string;
    rating: number;
    comment: string;
    createdAt: Date;
    patientId:string;
    doctorId:string;
    patientProfilePic:string;
    doctorProfilePic:string
}


export interface PaginatedReviewResult {
  reviews: ReviewDetails[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

