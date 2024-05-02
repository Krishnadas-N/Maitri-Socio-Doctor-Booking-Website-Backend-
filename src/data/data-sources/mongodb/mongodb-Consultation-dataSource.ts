import mongoose, { FilterQuery, Types } from "mongoose";
import { CustomError } from "../../../../utils/CustomError";
import { doctorAppoinmentsResponseModel, findDoctorsQueryParams, makeAppoinmentReqModel, userAppoinmentsResponseModel } from "../../../models/Consultation.model";
import { AppointmentModel } from "./models/Appoinment-Model";
import DoctorModel from "./models/Doctor-model";
import { IConsultationModel } from "../../interfaces/data-sources/consultation-data-source";
import { Appointment } from "../../../domain/entities/APPOINMENT";
import Doctor from "../../../domain/entities/Doctor";
import { doctorsResponseModel } from "../../../models/common-models";

export class ConsultaionModel implements IConsultationModel {
  constructor() {}
  async makeAppoinment(
    userId: string,
    doctorId: string,
    appoinmentData: makeAppoinmentReqModel
  ): Promise<string> {
    try {
      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(doctorId)
      ) {
        throw new CustomError("Invalid User or Doctor ID", 400);
      }

      const doctorDetails = await DoctorModel.findOne({
        _id: doctorId,
        isBlocked: false,
      });
      if (!doctorDetails) {
        throw new CustomError(
          "Doctor not found or Doctor is currently blocked. Please try again later.",
          404
        );
      }

      const consultationFee = doctorDetails.consultationFee.find(
        (data) => data.type === appoinmentData.typeofConsultaion
      );
      if (!consultationFee) {
        throw new CustomError("Consultation type fee not found.", 404);
      }

      const appointment = new AppointmentModel({
        patient: userId,
        doctor: doctorDetails._id,
        typeOfAppointment: appoinmentData.typeofConsultaion,
        date: appoinmentData.bookingDate,
        slot: appoinmentData.slotTime,
        amount: consultationFee.fee,
      });

      await appointment.save();
      return appointment._id;
    } catch (err: any) {
      if (err instanceof CustomError) {
        throw err;
      } else {
        throw new CustomError(
          err.message || "Error while making an appointment",
          500
        );
      }
    }
  }

  async getAppoinment(appointmentId: string): Promise<Appointment> {
    try {
      if (!Types.ObjectId.isValid(appointmentId)) {
        throw new CustomError("Invalid Appoinment ID", 400);
      }
      const [appointment] = await AppointmentModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(appointmentId),
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        {
          $lookup: {
            from: "doctorcategories",
            localField: "doctorInfo.specialization",
            foreignField: "_id",
            as: "doctorSpecialization",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "patient",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);
      if (!appointment) {
        throw new CustomError("Appoinment is not Found", 404);
      }
      return appointment;
    } catch (err: any) {
      if (err instanceof CustomError) {
        throw err;
      } else {
        throw new CustomError(
          err.message || "Error while making an appointment",
          500
        );
      }
    }
  }
  async findAppoinmentById(id: string): Promise<Appointment> {
    try {
      const appointment = (await AppointmentModel.findOne({
        _id: id,
      })) as Appointment | null;

      if (!appointment) {
        throw new CustomError("No Appointment found with the given ID", 404);
      }
      return appointment;
    } catch (err: any) {
      if (err instanceof CustomError) {
        throw err;
      } else {
        throw new CustomError(
          err.message || "Error while making an appointment",
          500
        );
      }
    }
  }

  async savePaymentDetails(
    appointmentId: string,
    appoinmentAmount: number,
    paymentMethod:
      | "Credit Card"
      | "Debit Card"
      | "PayPal"
      | "Stripe"
      | "Razorpay",
    responseId: string
  ): Promise<void> {
    try {
      const appointment = await AppointmentModel.findOne({
        _id: appointmentId,
      });
      if (!appointment) {
        throw new CustomError("No Appointment found with the given ID", 404);
      }

      appointment.payment = {
        amount: appoinmentAmount,
        method: paymentMethod,
        transactionId: responseId,
        status: "Success",
      };
      await appointment.save();
    } catch (err: any) {
      if (err instanceof CustomError) {
        throw err;
      } else {
        throw new CustomError(
          err.message || "Error while making an appointment",
          500
        );
      }
    }
  }
  async updatePaymentToSuccess(orderId: string): Promise<string> {
    try {
      const appoinment = await AppointmentModel.findOneAndUpdate(
        { "payment.transactionId": orderId },
        { $set: { paymentStatus: "Paid" } },
        { new: true }
      );
      if (!appoinment) {
        throw new CustomError("Appoinment Not Found Caused an error ", 422);
      }
      return appoinment._id;
    } catch (err: any) {
      console.error('Error updating payment status to "Paid":', err);
      throw new CustomError(
        err.message || "Error while making an appointment",
        500
      );
    }
  }

  async getAppoinmentsOfDoctors(doctorId: string,page:number,pageSize:number): Promise<doctorAppoinmentsResponseModel> {
    try {
      const offset = (page - 1) * pageSize;
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new CustomError("Invalid Doctor ID", 400);
      }
      const [appointments] = await AppointmentModel.aggregate([
        {
          $match: {
            doctor: new mongoose.Types.ObjectId(doctorId),
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        {
          $lookup: {
            from: "doctorcategories",
            localField: "doctorInfo.specialization",
            foreignField: "_id",
            as: "doctorSpecialization",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "patient",
            foreignField: "_id",
            as: "user",
          },
        },   
        {
          $facet: {
            appointments: [
              {$sort:{ createdAt: -1 }},
              { $skip: offset },
              { $limit: pageSize },
             
             ], // retrieve all appointments
            counts: [
              {
                $group: {
                  _id: null,
                  pendingCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] },
                  },
                  scheduledCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Scheduled"] }, 1, 0] },
                  },
                  completedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
                  },
                  cancelledCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
                  },
                  rejectedCount: {
                    $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  counts: {
                    Pending: "$pendingCount",
                    Scheduled: "$scheduledCount",
                    Completed: "$completedCount",
                    Cancelled: "$cancelledCount",
                    Rejected: "$rejectedCount",
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            appointments: 1,
            counts: { $arrayElemAt: ["$counts", 0] },
          },
        },
      ]);
      const totalCount = await AppointmentModel.countDocuments({ doctor: doctorId });
      const totalPages = Math.ceil(totalCount / pageSize);
      console.log("Docotr Appoinments", appointments);
      return {
        appointments:appointments,
        page,
        pageSize,
        totalCount,
        totalPages,
      };
    } catch (err: any) {
      console.error('Error updating payment status to "Paid":', err);
      throw new CustomError(
        err.message || "Error while making an appointment",
        500
      );
    }
  }

  async getAppoinmentsOfUsers(userId: string,page:number,pageSize:number): Promise<userAppoinmentsResponseModel> {
    try {
      const offset = (page - 1) * pageSize;
      if (!Types.ObjectId.isValid(userId)) {
        throw new CustomError("Invalid User ID", 400);
      }
     
      const appointments = await AppointmentModel.aggregate([
        {
          $match: {
            patient: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "doctor",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        {
          $lookup: {
            from: "doctorcategories",
            localField: "doctorInfo.specialization",
            foreignField: "_id",
            as: "doctorSpecialization",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "patient",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $sort:{ createdAt: -1 }
        },
        {
          $skip:offset,
        },
        {
          $limit: pageSize,
        },
       
      ]);
      
      const totalCount = await AppointmentModel.countDocuments({ patient: userId });
      const totalPages = Math.ceil(totalCount / pageSize);
      return {
        appointments:appointments,
        page,
        pageSize,
        totalCount,
        totalPages,
      };
    } catch (err: any) {
      console.error('Error updating payment status to "Paid":', err);
      throw new CustomError(
        err.message || "Error while making an appointment",
        500
      );
    }
  }

  async changeAppoinmentStatus(
    appoinmentId: string,
    status: string
  ): Promise<Appointment> {
    try {
      const appointment = (await AppointmentModel.findOneAndUpdate(
        { _id: appoinmentId },
        { $set: { status: status } },
        { new: true }
      )) as Appointment;

      if (!appointment) {
        throw new CustomError("Appoinment Not Found Caused an error ", 422);
      }
      return appointment;
    } catch (err: any) {
      console.error('Error updating payment status to "Paid":', err);
      throw new CustomError(
        err.message || "Error while making an appointment",
        500
      );
    }
  }

  async getAvailableSlots(doctorId: string, date: Date): Promise<string[]> {
    try {
      console.log("Log form available slots", date);
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new CustomError("Invalid Doctor ID", 400);
      }
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointments = await AppointmentModel.find({
        doctor: doctorId,
        date: { $gte: startOfDay, $lte: endOfDay },
        paymentStatus: { $ne: "Paid" }
    });

    const slots: string[] = [];
    for (let appointment of appointments) {
        slots.push(appointment.slot);
    }
    console.log("Slots Booked ",slots)
    return slots;
    } catch (err: any) {
      console.error('Error updating payment status to "Paid":', err);
      throw new CustomError(
        err.message || "Error while making an appointment",
        500
      );
    }
  }

  async getAllDoctors(filters:findDoctorsQueryParams): Promise<doctorsResponseModel> {
    const query: FilterQuery<Doctor> = {};
  
    // Filter by gender (if provided)
    if (filters.gender) {
      query.gender = { $in: filters.gender.split(",") };
      console.log("Filtering by gender:", filters.gender);
    }
  
    if (filters.availability) {
      const dayOfWeek = new Date().getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ...)
      const availabilityArray = filters.availability.split(",");
      let slotRanges = [];
    
      // Define time ranges for each availability slot
      switch (dayOfWeek) {
        case 0: // Sunday
        case 6: // Saturday
          slotRanges = [
            { name: "morning", start: 8, end: 12 },
            { name: "afternoon", start: 13, end: 18 },
            { name: "evening", start: 19, end: 23 }
          ];
          break;
        default: // Weekdays
          slotRanges = [
            { name: "morning", start: 9, end: 12 },
            { name: "afternoon", start: 13, end: 17 },
            { name: "evening", start: 18, end: 22 }
          ];
          break;
      }
    
      // Construct slots array based on availabilityArray and slotRanges
      const slots = availabilityArray.reduce((acc:any, slot) => {
        const matchingRange = slotRanges.find(range => range.name === slot);
        if (matchingRange) {
          for (let i = matchingRange.start; i <= matchingRange.end; i++) {
            // Adjust the formatting for hours greater than 12
            const formattedHour: string = (i > 12 ? i - 12 : i).toString();
            // Determine whether it's AM or PM
            const period = i >= 12 ? 'pm' : 'am';
            acc.push(`${formattedHour} ${period}`);
          }
        }
        return acc;
      }, []);
    
      // Construct a query for matching the day of the week and available slots
      query.selectedSlots = {
        $elemMatch: {
          date: { $eq: new Date().setHours(0, 0, 0, 0) }, // Match the current day
          slots: { $in: slots }
        }
      };
      
      console.log("Filtering by availability:", filters.availability,JSON.stringify(slots),query.selectedSlots);
    }
    
    
  
  
    // Filter by other criteria (modify as needed)
    if (filters.speciality) {
      query.specialization = { $in: filters.speciality.split(",") }; // Assuming speciality IDs are comma-separated
      console.log("Filtering by speciality:", filters.speciality);
    }
  
    if (filters.experience) {
      const experienceRange = filters.experience.split("-");
      if (experienceRange.length === 2) {
        query.experience = { $gte: parseInt(experienceRange[0]), $lte: parseInt(experienceRange[1]) };
        console.log("Filtering by experience:", filters.experience);
      }
    }
  
    // Filter by consultation type (if provided)
    if (filters.consultation) {
      query.typesOfConsultation = { $in: filters.consultation.split(",") };
      console.log("Filtering by consultation type:", filters.consultation);
    }
  
    // Filter by rating (if provided)
    if (filters.rating) {
      const ratingArray = filters.rating.split(",").map(Number); // Convert ratings to numbers
      query.rating = { $in: ratingArray };
      console.log("Filtering by rating:", filters.rating);
    }
  
    // Filter by languages (if provided)
    if (filters.languages) {
      query.languages = { $in: filters.languages.split(",") };
      console.log("Filtering by languages:", filters.languages);
    }
  
    if (filters.searchQuery) {
      const searchRegex = new RegExp(filters.searchQuery, 'i'); // Case-insensitive search
      query.$text = { $search: searchRegex.toString() }; // Convert RegExp to string before assigning
      console.log("Filtering by search query:", filters.searchQuery, searchRegex);
    }

  
    // Pagination (assuming using Mongoose pagination plugin)
    const currentPage = parseInt(filters.currentPage) || 1;
    const pageSize = parseInt(filters.pageSize) || 6;
    const skip = (currentPage - 1) * pageSize;
    const totalCount = await DoctorModel.countDocuments(query); // Count documents based on the query
    const totalPages = Math.ceil(totalCount / pageSize);
    console.log("Pagination: currentPage", currentPage, "pageSize", pageSize, "skip", skip);
  
   // Sorting (assuming using Mongoose sorting plugin)
      const sortOption = filters.sortOption || 'Newest'; // Default to Newest if not specified
        let sortQuery = {};

        if (sortOption === 'Newest') {
          sortQuery = { createdAt: -1 }; // Sort by creation date descending
        } else if (sortOption === 'Oldest') {
          sortQuery = { createdAt: 1 }; // Sort by creation date ascending
        } else if (sortOption === 'Rating') {
          sortQuery = { rating: -1 }; // Sort by rating descending
        } else if (sortOption === 'Price: Low to High') {
          sortQuery = { 'consultationFee.fee': 1 }; // Sort by consultation fee ascending
        } else if (sortOption === 'Price: High to Low') {
          sortQuery = { 'consultationFee.fee': -1 }; // Sort by consultation fee descending
        }

        console.log("Sorting:", sortOption, sortQuery);

    // Combine filters and pagination/sorting
    const doctors = await DoctorModel.find(query).skip(skip).limit(pageSize).sort(sortQuery);

  console.log("Combined query:", doctors.toString()); // Log the final query string
  return {
    doctors,
    currentPage,
    pageSize,
    totalCount,
    totalPages,
  };
  }
  
  
  
}
