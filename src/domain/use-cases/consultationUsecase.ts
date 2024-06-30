import { CustomError } from "../../utils/customError"; 
import { PaymentModel, allowedStatuses, doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../models/consultation.model";
import { doctorsResponseModel } from "../../models/common.models";
import { Appointment } from "../entities/APPOINMENT";
import { IConsultationRepository } from "../interfaces/repositoryInterfaces/consultationIRepository"; 
import { IConsultationUsecase } from "../interfaces/use-cases/consultationIUsecase";
import { INotificationRepository } from "../interfaces/repositoryInterfaces/notificationRepository";
import dotenv from 'dotenv';
import { pulse } from "../../config/cron-pulse-config";
dotenv.config();

export class ConsultationUseCaseImpl implements IConsultationUsecase {
  constructor(
    private readonly consultationRepo: IConsultationRepository,
    private readonly notificationRepo :INotificationRepository

  ) {}

  async makeDoctorAppoinment(
    userId: string,
    doctorId: string,
    appoinmentData: makeAppoinmentReqModel
  ): Promise<string> {
    try {
      if (!userId || !doctorId) {
        throw new CustomError("UserId or DoctorId is not Provided", 403);
      }
      if (
        !appoinmentData.typeofConsultaion ||
        !["video", "chat", "clinic"].includes(appoinmentData.typeofConsultaion)
      ) {
        throw new CustomError("Invalid type of consultation", 400);
      }
      const parsedBookingDate = new Date(appoinmentData.bookingDate);
      if (isNaN(parsedBookingDate.getTime())) {
        throw new CustomError("Invalid booking date", 400);
      }

      if (
        !appoinmentData.slotTime ||
        typeof appoinmentData.slotTime !== "string" ||
        appoinmentData.slotTime.trim() === ""
      ) {
        throw new CustomError("Invalid slot time", 400);
      }

      return this.consultationRepo.makeDoctorAppoinment(
        userId,
        doctorId,
        appoinmentData
      );
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        throw err;
      } else {
        const castedError = err as Error;
        throw new CustomError(
          castedError.message || "Error while make an appoinment",
          500
        );
      }
    }
  }

  async getAppoinmentDetails(appointmentId: string): Promise<Appointment> {
    try {
      if (!appointmentId) {
        throw new CustomError("No Appoinment Id is Provided", 400);
      }
      return this.consultationRepo.getAppoinment(appointmentId);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async createOrder(
    appointmentId: string,
    paymentMethod: PaymentModel,
    token?: any
  ): Promise<{ responseId: string; keyId: string; amount: number }> {
    try {
      if (!appointmentId) {
        throw new CustomError("No Appointment Id is Provided", 400);
      }
      return await this.consultationRepo.createBookingPayment(
        appointmentId,
        paymentMethod,
        token
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async verifyWebhook(
    orderId: string,
    paymentId: string,
    razorpaySignature: string
  ): Promise<{ appoinmentId: string; notificationId: string }> {
    try {
      if (!orderId || !paymentId || !razorpaySignature) {
        throw new CustomError(
          "No Appointment Id, Payment Id, or Razorpay Signature is Provided",
          400
        );
      }
      return await this.consultationRepo.verifyPayment(
        orderId,
        paymentId,
        razorpaySignature
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }
  async getUsersAppoinments(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<userAppoinmentsResponseModel> {
    try {
      if (!userId) {
        throw new CustomError("User Id is Not Provided", 400);
      }
      return this.consultationRepo.getAppoinmentsOfUsers(
        userId,
        page,
        pageSize
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async getDoctorsAppoinments(
    doctorId: string,
    page: number,
    pageSize: number,
    searchQuery:string
  ): Promise<doctorAppoinmentsResponseModel> {
    try {
      if (!doctorId) {
        throw new CustomError("Doctor Id is Not Provided", 400);
      }
      return this.consultationRepo.getAppoinmentsOfDoctors(
        doctorId,
        page,
        pageSize,
        searchQuery
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async changeAppoinmentStatus(
    appoinmentId: string,
    status: string,
    userId: string,
    userType: string
  ): Promise<{ appointment: Appointment; notificationId: string }> {
    try {
      await pulse.start();
      if (!appoinmentId) {
        throw new CustomError("Appoinment Id is Not Provided", 400);
      }
      if (!allowedStatuses.includes(status)) {
        throw new CustomError("Invalid appointment status", 400);
      }
      const result =await  this.consultationRepo.changeAppoinmentStatus(
        appoinmentId,
        status,
        userId,
        userType
      );
      const appointmentDetails = result.appointment;
      const jobData = {
            to: appointmentDetails.patientDetails.email,
            subject: 'Appointment Status Update',
            text: `Hello ${appointmentDetails.patientDetails.firstName}  ${appointmentDetails.patientDetails.lastName}, your appointment status is updated.`,
            patientName: appointmentDetails.patientDetails.firstName,
            status: appointmentDetails.status,
            doctorName: appointmentDetails.doctorDetails.firstName,
            date: appointmentDetails.date,
            slot: appointmentDetails.slot,
          };

     const job =  await pulse.create('send email', jobData).save();
     const slotTime = new Date();
     const fiveMinutesLater = new Date(slotTime.getTime() + 5 * 60 * 1000);
      await job.schedule(new Date(fiveMinutesLater)).save();

      return result;
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async getDoctorAvailableSlots(
    doctorId: string,
    date: Date
  ): Promise<string[]> {
    try {
      if (!doctorId) {
        throw new CustomError("Doctor Id is Not Provided", 400);
      }
      if (!(date instanceof Date && !isNaN(date.getTime()))) {
        throw new CustomError("Invalid Date", 400);
      }
      return this.consultationRepo.getAvailableSlots(doctorId, date);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async getAllDoctors(
    queryData: findDoctorsQueryParams
  ): Promise<doctorsResponseModel> {
    try {
      return this.consultationRepo.getDoctors(queryData);
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async userAppoinmentCancellation(
    appoinmentId: string,
    status: string,
    userId: string
  ): Promise<Appointment> {
    try {
      if (!appoinmentId || !status || !userId) {
        throw new CustomError("Invalid arguments", 400);
      }
      return await  this.consultationRepo.userAppoinmentCancellation(
        appoinmentId,
        status,
        userId
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async savePrescriptionOfPatient(
    appoinmentId: string,
    prescriptionFile: string,
    title: string,
    doctorId: string
  ): Promise<void> {
    try {
      if (!appoinmentId || !prescriptionFile || !title || !doctorId) {
        throw new CustomError("Invalid arguments", 400);
      }
      await this.consultationRepo.savePrescriptionOfPatient(
        appoinmentId,
        prescriptionFile,
        title,
        doctorId
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }

  async userRequestToCancelAppoinment(appointmentId: string, userId: string,reason: string): Promise<{ appointment: Appointment; notificationId: string }> {
    try {
      if (!appointmentId || !userId || !reason) {
        throw new CustomError(
          "Invalid arguments. Please provide appointmentId, userId, and reason.",
          400
        );
      }
      return await this.consultationRepo.requestToCancelAppoinment(
        appointmentId,
        userId,
        reason
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        const castedError = error as Error;
        console.error("Unexpected error:", error);
        throw new CustomError(
          castedError.message || "Internal server error",
          500
        );
      }
    }
  }


  async ChangeStatusOfappoinmentCancellationRequest(appoinmentId: string, status: string, doctorId: string): Promise<{ appointment: Appointment; adminNotificationId: string; userNotificationId: string }> {
    try {
        if (!appoinmentId && !doctorId) {
            throw new CustomError("Appointment Id or doctor Id is Not Provided", 400);
        }
        const adminId = process.env.Admin_Id as string;

        // Update appointment status and create notifications
        const appointment = await this.consultationRepo.appoinmentCancellationRequestStatus(appoinmentId, status, doctorId);

        // Prepare notification data
        const adminNotificationData = {
            sender: adminId,
            senderModel: 'Admin',
            receivers: [{ receiverId: adminId, receiverModel: 'Admin' }],
            title: 'Appointment Cancellation',
            message: `The appointment with user ${appointment.patient.toString()} has been cancelled.`
        };

        const userNotificationData = {
            sender: doctorId,
            senderModel: 'Doctor',
            receivers: [{ receiverId: appointment.patient.toString(), receiverModel: 'User' }],
            title: 'Appointment Cancellation',
            message: `Your appointment has been cancelled. 70% Refund amount of ${appointment.amount} has been credited to your Wallet.`
        };

        // Create notifications and collect IDs
        const [adminNotification, userNotification] = await Promise.all([
            this.notificationRepo.createNotification(adminNotificationData.sender, adminNotificationData.senderModel, adminNotificationData.title, adminNotificationData.receivers, adminNotificationData.message),
            this.notificationRepo.createNotification(userNotificationData.sender, userNotificationData.senderModel, userNotificationData.title, userNotificationData.receivers, userNotificationData.message)
        ]);

        return { 
          appointment, 
          adminNotificationId: adminNotification?._id?.toString() ?? 'N/A', 
          userNotificationId: userNotification?._id?.toString() ?? 'N/A' 
          };

       } catch (error: unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            console.error("Unexpected error:", error);
            throw new CustomError(error instanceof Error ? error.message : "Internal server error", 500);
        }
    }
}

  async getAppointmentsWithPrescriptions(userId: string): Promise<Appointment[]> {
    try {
      if(!userId){
        throw new CustomError("userId is not defined",404)
      }
      return this.consultationRepo.getAppointmentsWithPrescriptions(userId);
  } catch (error: unknown) {
    if (error instanceof CustomError) {
        throw error;
    } else {
        console.error("Unexpected error:", error);
        throw new CustomError(error instanceof Error ? error.message : "Internal server error", 500);
    }
}
    }


}   

// export const consultationService = (