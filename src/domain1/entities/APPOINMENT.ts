 // Appointment entity
 export class Appointment {
    _id?: string;
    doctorId: string; 
    patientId: string;
    datetime: Date;
    status: AppointmentStatus;
  
    constructor(doctorId: string, patientId: string, datetime: Date, status: AppointmentStatus) {
      this.doctorId = doctorId;
      this.patientId = patientId;
      this.datetime = datetime;
      this.status = status;
    }
  }

  // Enum for appointment status
  enum AppointmentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
  }
  