import mongoose, { Schema, Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import  { Admin, RoleDetails } from "../../../domain/entities/Admin";
import { adminModelIDataSource } from "../../interfaces/data-sources/adminIDataSource"; 
import {roleModel} from "./models/roleModel";
import { adminModel,IAdmin } from "./models/adminModel";
import { doctorModel } from "./models/doctorModel";
import Doctor from "../../../domain/entities/Doctor";
import { TransactionDetailsByWeek, doctorsResponseModel, usersResponseModel } from "../../../models/common.models";
import { userModel } from "./models/userModel";
import { User } from "../../../domain/entities/User";
import { appointmentModel } from "./models/appoinmentModel";
import { AdminAppointmentDetails, AdminDashboardDetails, AdminDashboardUserandDoctorDetails, AppointmentListResponse, DoctorDetails, MonthlyRevenue, MonthlyStats, PaginatedReviewResult, ReviewDetails, UserDetails } from "../../../models/admin.models";
import { walletModel } from "./models/walletModel";
import { Wallet } from "../../../domain/entities/Wallet";
import { ReviewModel } from "./models/ReviewAndRatingModel";


function getLast12Months() {
        const months = [];
        const currentDate = new Date();
        for (let i = 0; i < 12; i++) {
          const month = currentDate.getMonth() + 1;
          const year = currentDate.getFullYear();
          months.push({ year, month });
          currentDate.setMonth(currentDate.getMonth() - 1);
        }
        return months.reverse();
      }

function getWeekStartDate(date: Date): string {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay() + 1); // Adjust to the start of the week (Monday)
        const year = d.getFullYear();
        const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
        const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
        return `${year}-${month}-${day}`;
    }
    
export class AdminDataSource implements adminModelIDataSource{
    constructor(){}

   async create(admin: Admin): Promise<void> {
    try {

        const roles = await roleModel.find({ _id: { $in: admin.roles } });
        if (roles.length !== admin.roles.length) {
            throw new Error('Some roles not found');
        }
        const newAdmin:IAdmin = new adminModel({
            username: admin.username,
            email: admin.email,
            password: admin.password,
            roles:  roles.map(role => role._id.toString()),
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
        });
        await newAdmin.save();
    } catch (error:unknown) {
        const castedError = error as Error
        throw new CustomError(castedError.message || 'Failed to create admin',500);
    }
    }

    async findByUsername(username: string): Promise<Admin | null> {
        try {
            const adminDocument = await adminModel.findOne({ username });
            if (adminDocument) {
                const admin = Admin.fromJSON(adminDocument);
                console.log(admin,"Log from Amdin");
                return this.convertToDomain(admin);
            } else {
                return null;
            }
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByUsername',500);
            }
        }
    }
    async findByemail(email: string): Promise<Admin | null> {
        try {
        const adminDocument = await adminModel.findOne({ email });
        if (adminDocument) {
            console.log(adminDocument,"Log from Amdin");
            const admin = Admin.fromJSON(adminDocument);
            console.log(admin,"Log from Amdin");
            return this.convertToDomain(admin);
        } else {
            return null;
        }
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByemail',500);
            }
        }
    }

   async findById(id: string): Promise<Admin | null> {
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) throw new CustomError("Invalid id",400);
        const adminDocument = await adminModel.findById(id);
        if (adminDocument) {
            const admin = Admin.fromJSON(adminDocument);
            console.log(admin,"Log from Amdin");
            return this.convertToDomain(admin);
        } else {
            return null;
        }
        }  catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByemail',500);
            }
        }
    }

    async listDoctors( page?: number, searchQuery?: string,itemsPerPage?: number ): Promise<doctorsResponseModel> {
        try {
            const pageNum = page || 1;
            const perPage = itemsPerPage && itemsPerPage > 0 ? itemsPerPage : 10;
            const skip = (pageNum - 1) * perPage;
    
            let query: any = {};
            if (searchQuery) {
                query = {
                    $or: [
                        { firstName: { $regex: searchQuery, $options: 'i' } },
                        { lastName: { $regex: searchQuery, $options: 'i' } }
                    ]
                };
            }
    
            const doctors = await doctorModel.find(query)
                .populate({
                    path: 'specialization',
                    select: 'name',
                    model: 'DoctorCategory'
                })
                .skip(skip)
                .limit(perPage)
                .exec();
    
            const totalCount = await doctorModel.countDocuments(query);
            const totalPages = Math.ceil(totalCount / perPage);
    
            return {
                doctors,
                currentPage: pageNum,
                pageSize: perPage,
                totalCount,
                totalPages
            };
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error;
                console.error('Unexpected error:', castedError);
                throw new CustomError(castedError.message || 'Internal server error', 500);
            }
        }
    }
    
    async changeStatusofDoctor(id: string): Promise<Doctor> {
        try{
            if(!mongoose.Types.ObjectId.isValid(id)) {
                throw new CustomError("Invalid id format", 400);
            }
            const doctor = await doctorModel.findById(id).populate({
                path: 'specialization',
                select: 'name', // Select the name field from DoctorCategory
                model: 'DoctorCategory',
                options: { // Specify a custom alias for the field
                as: 'psycharitst'
                }
            }).exec();
            
            if (!doctor) {
                throw new CustomError("Doctor not found", 404);
            }
            doctor.isBlocked = !doctor.isBlocked;
            await doctor.save();
             return  doctor
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
        }

        async getAllUsers(searchQuery: string, page: number, pageSize: number): Promise<usersResponseModel> {
            try {
                const regex = new RegExp(searchQuery, 'i');
                const offset = (page - 1) * pageSize;
                const users =await userModel.find({
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { username: { $regex: regex } }
                    ]
                }).skip(offset).limit(pageSize)
               const totalCount = await userModel.countDocuments({
                    $or: [
                        { firstname: { $regex: regex } },
                        { lastname: { $regex: regex } },
                        { username: { $regex: regex } }
                    ]
                });
                const totalPages = Math.ceil(totalCount / pageSize);
                return {
                    users:users as unknown as  User[],
                    currentPage: page,
                    pageSize: pageSize,
                    totalCount,
                    totalPages
                };
            } catch (error) {
                throw new Error(`Error getting users: ${error}`);
            }
        }
      
    async toggleBlockUser(id:string): Promise<User>{
            const user = await userModel.findById(id);
            if (!user) {
                throw new CustomError('User not found', 404);
            }
            user.isBlocked = !user.isBlocked;
    
                await user.save();
                return user.toObject() as User;
    }

    async getSpecializedDoctors(specId:string,searchQuery:string):Promise<Doctor[]>{
        try {
            const searchRegex = new RegExp(searchQuery, 'i'); 
            const doctors=  await doctorModel.aggregate([
                {
                    $match:{
                        specialization: new mongoose.Types.ObjectId(specId) 
                    }
                },
                {
                    $match: {
                        $or: [
                            { firstName: { $regex: searchRegex } },
                            { lastName: { $regex: searchRegex } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'doctor',
                        as: 'reviews'
                    }
                },
                {
                    $addFields: {
                        averageRating: { $avg: '$reviews.rating' },
                        totalReviews: { $size: '$reviews' }
                    }
                },
                {
                    $lookup: {
                        from: 'appointments',
                        localField: '_id',
                        foreignField: 'doctor',
                        as: 'appointments'
                    }
                },
                {
                    $addFields: {
                        completedAppointments: {
                            $size: {
                                $filter: {
                                    input: '$appointments',
                                    as: 'appointment',
                                    cond: { $eq: ['$$appointment.status', 'Completed'] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        profilePic:1,
                        specialization: 1,
                        averageRating: 1,
                        totalReviews: 1,
                        completedAppointments: 1
                    }
                }

            ]);
            console.log("doctors from specialization",doctors);
            return doctors;
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
              throw new CustomError(castedError.message || "Internal Server Error", 500);
            }
          }  
    }

    async adminDashBoardDetails(adminId: string): Promise<AdminDashboardDetails> {
        try {
          // Aggregation for doctors, patients, and appointments
          const appointmentResult = await appointmentModel.aggregate([
            {
              $facet: {
                doctorsCount: [
                  { $lookup: { from: 'doctors', pipeline: [{ $count: 'total' }], as: 'doctors' } },
                  { $unwind: '$doctors' },
                  { $replaceRoot: { newRoot: '$doctors' } },
                  { $project: { total: '$total' } },
                ],
                patientsCount: [
                  { $lookup: { from: 'users', pipeline: [{ $count: 'total' }], as: 'patients' } },
                  { $unwind: '$patients' },
                  { $replaceRoot: { newRoot: '$patients' } },
                  { $project: { total: '$total' } },
                ],
                totalCompleted: [
                  { $match: { status: 'Completed' } },
                  { $count: 'count' },
                ],
                monthlyStats: [
                  {
                    $group: {
                      _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        status: '$status',
                      },
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $group: {
                      _id: {
                        year: '$_id.year',
                        month: '$_id.month',
                      },
                      stats: {
                        $push: {
                          status: '$_id.status',
                          count: '$count',
                        },
                      },
                    },
                  },
                  { $sort: { '_id.year': 1, '_id.month': 1 } },
                  {
                    $project: {
                      _id: 0,
                      year: '$_id.year',
                      month: '$_id.month',
                      stats: {
                        $arrayToObject: {
                          $map: {
                            input: '$stats',
                            as: 'stat',
                            in: { k: '$$stat.status', v: '$$stat.count' },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ]);
      
          // Aggregation for wallet transactions
          const walletResult = await walletModel.aggregate([
            {
              $match: {
                owner: new Types.ObjectId(adminId),
              },
            },
            { $unwind: '$transactions' },
            {
              $match: {
                'transactions.type': 'credit',
                'transactions.date': {
                  $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                },
              },
            },
            {
              $facet: {
                totalRevenue: [
                  {
                    $group: {
                      _id: null,
                      totalRevenue: { $sum: '$transactions.amount' },
                    },
                  },
                ],
                monthlyRevenue: [
                  {
                    $group: {
                      _id: {
                        year: { $year: '$transactions.date' },
                        month: { $month: '$transactions.date' },
                      },
                      monthlyRevenue: { $sum: '$transactions.amount' },
                    },
                  },
                  { $sort: { '_id.year': 1, '_id.month': 1 } },
                  {
                    $project: {
                      _id: 0,
                      year: '$_id.year',
                      month: '$_id.month',
                      monthlyRevenue: 1,
                    },
                  },
                ],
              },
            },
          ]);
          const doctorsCount = appointmentResult[0].doctorsCount.length > 0 ? appointmentResult[0].doctorsCount[0].total : 0;
          const patientsCount = appointmentResult[0].patientsCount.length > 0 ? appointmentResult[0].patientsCount[0].total : 0;
          const totalCompleted = appointmentResult[0].totalCompleted.length > 0 ? appointmentResult[0].totalCompleted[0].count : 0;
          const monthlyStats: MonthlyStats[] = appointmentResult[0].monthlyStats;
      
          const totalRevenue = walletResult[0].totalRevenue.length > 0 ? walletResult[0].totalRevenue[0].totalRevenue : 0;
          const monthlyRevenue = walletResult[0].monthlyRevenue;
      
          // Ensure the monthly data covers all 12 months with zeros where needed
          const last12Months = getLast12Months();
      
          const completedMonthlyStats = last12Months.map(({ year, month }) => {
            const stats = monthlyStats.find(stat => stat.year === year && stat.month === month);
            return stats || { year, month, stats: { Pending: 0, Scheduled: 0, Completed: 0, Cancelled: 0, Rejected: 0 } };
          });
      
          const completedMonthlyRevenue = last12Months.map(({ year, month }) => {
            const revenue = monthlyRevenue.find((rev:MonthlyRevenue) => rev.year === year && rev.month === month);
            return revenue || { year, month, monthlyRevenue: 0 };
          });
      
          console.log("Dash Board Details of Admin", doctorsCount, patientsCount, totalCompleted, completedMonthlyStats, totalRevenue, completedMonthlyRevenue);
      
          return {
            doctorsCount,
            patientsCount,
            totalCompleted,
            monthlyStats: completedMonthlyStats,
            totalRevenue,
            monthlyRevenue: completedMonthlyRevenue,
          };
        } catch (error: unknown) {
          if (error instanceof CustomError) {
            throw error;
          } else {
            const castedError = error as Error;
            throw new CustomError(castedError.message || 'Internal Server Error', 500);
          }
        }
      }
      

      async adminDashboardPatientandDoctorDetails(): Promise<AdminDashboardUserandDoctorDetails> {
        try {
          const users = await userModel.aggregate([
            {
              $lookup: {
                from: 'appointments',
                localField: '_id',
                foreignField: 'patient',
                as: 'patientDetails'
              }
            },
            {
              $unwind: {
                path: '$patientDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails'
              }
            },
            {
              $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $group: {
                _id: '$_id',
                fullName: { $first: { $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] } },
                profilePic: { $first: '$userDetails.profilePic' },
                lastAppointmentDate: { $max: '$patientDetails.date' },
                totalPaid: { $sum: '$patientDetails.payment.amount' }
              }
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                profilePic: 1,
                lastAppointmentDate: 1,
                totalPaid: 1
              }
            },
            {
              $limit: 10
            }
          ]);
          
          
          console.log("users fetched from admin dashboard",users);
          const doctors = await doctorModel.aggregate([
            {
              $lookup: {
                from: 'appointments',
                localField: '_id',
                foreignField: 'doctor',
                as: 'appointments'
              }
            },
            {
              $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'doctor',
                as: 'reviews'
              }
            },
            {
              $lookup: {
                from: 'doctorcategories',
                localField: 'specialization',
                foreignField: '_id',
                as: 'specialization'
              }
            },
            {
              $addFields: {
                totalEarnings: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: '$appointments',
                          as: 'appointment',
                          cond: { $eq: ['$$appointment.status', 'Completed'] }
                        }
                      },
                      as: 'completedAppointment',
                      in: '$$completedAppointment.payment.amount'
                    }
                  }
                },
                averageRating: {
                  $avg: '$reviews.rating'
                },
                fullName: {
                  $concat: ['$firstName', ' ', '$lastName']
                }
              }
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                profilePic: 1,
                totalEarnings: 1,
                averageRating: 1,
                specialization: { $arrayElemAt: ['$specialization.name', 0] } // Extract the first specialization name
              }
            },
            {
              $limit: 10 // Limit the results to the first 10 doctors
            }
          ]);
          
          
          console.log("doctors fetched from admin dashboard",doctors);
          const result: AdminDashboardUserandDoctorDetails = {
            patients: users as UserDetails[],
            doctors: doctors as DoctorDetails[]
          };
      
          return result;
          
      }catch (error:unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            const castedError = error as Error
          throw new CustomError(castedError.message || "Internal Server Error", 500);
        }
      }  
      }
  
      async getAppointmentsList(currentPage: number, pageSize: number, searchQuery: string): Promise<AppointmentListResponse> {
        try {
            const pageNum = currentPage || 1;
            const perPage = pageSize && pageSize > 0 ? pageSize : 7;
            const skip = (pageNum - 1) * perPage;
            
            const matchStage = searchQuery
              ? {
                  $match: {
                    $or: [
                      { 'doctorDetails.firstName': { $regex: searchQuery, $options: 'i' } },
                      { 'doctorDetails.lastName': { $regex: searchQuery, $options: 'i' } },
                      { 'patientDetails.firstName': { $regex: searchQuery, $options: 'i' } },
                      { 'patientDetails.lastName': { $regex: searchQuery, $options: 'i' } },
                    ],
                  },
                }
              : null; // Use null instead of an empty object
            
              const pipeline: any[] = [
                {
                  $lookup: {
                    from: 'doctors',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctorDetails',
                  },
                },
                { $unwind: '$doctorDetails' },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patientDetails',
                  },
                },
                { $unwind: '$patientDetails' },
                {
                  $lookup: {
                    from: 'doctorcategories', 
                    localField: 'doctorDetails.specialization',
                    foreignField: '_id',
                    as: 'specializationDetails',
                  },
                },
                { $unwind: { path: '$specializationDetails', preserveNullAndEmptyArrays: true } },
                {
                  $project: {
                    doctorName: {
                      $concat: ['$doctorDetails.firstName', ' ', '$doctorDetails.lastName'],
                    },
                    doctorProfilePic: '$doctorDetails.profilePic',
                    speciality: '$specializationDetails.name',
                    patientName: {
                      $concat: ['$patientDetails.firstName', ' ', '$patientDetails.lastName'],
                    },
                    patientProfilePic: '$patientDetails.profilePic',
                    appointmentTime: { $concat: [{ $dateToString: { format: '%Y-%m-%d', date: '$date' } }, ' ', '$slot'] },
                    status: '$status',
                    paymentStatus: '$paymentStatus',
                    amount: '$amount',
                  },
                },
                { $sort: { createdAt: -1 } }, 
                { $skip: skip },
                { $limit: perPage },
              ];
          
        
            // Conditionally add the match stage
            if (matchStage) {
              pipeline.splice(4, 0, matchStage); // Insert the match stage after the project stage
            }
        
            const appointments = await appointmentModel.aggregate(pipeline).exec();
            const totalCount = await appointmentModel.countDocuments(matchStage ? matchStage.$match : {}).exec();
            const totalPages = Math.ceil(totalCount / perPage);
            console.log("Appointments fetched from Admin Dashboard", appointments, totalCount);
        
            return {
              appointments,
              currentPage: pageNum,
              pageSize: perPage,
              totalCount,
              totalPages,
            };
        } catch (error: unknown) {
          if (error instanceof CustomError) {
            throw error;
          } else {
            const castedError = error as Error;
            throw new CustomError(castedError.message || 'Internal Server Error', 500);
          }
        }
      }


      async getAdminWallet(adminId: string, page: number, pageSize: number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }> {
        try {
            const existingWallet = await walletModel.findOne({ owner: adminId });
    
            if (!existingWallet) {
                const newWallet = new walletModel({
                    owner: adminId,
                    balance: 0,
                    transactions: []
                });
                await newWallet.save();
                return {
                    wallet: newWallet,
                    page,
                    pageSize,
                    totalCount: 0,
                    totalPages: 0
                };
            }
    
            const totalCount = existingWallet.transactions.length;
            const totalPages = Math.ceil(totalCount / pageSize);
    
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCount);
    
            const paginatedTransactions = existingWallet.transactions.slice(startIndex, endIndex);
    
            return {
                wallet: { ...existingWallet.toObject(), transactions: paginatedTransactions },
                page,
                pageSize,
                totalCount,
                totalPages
            };
        } catch (error) {
            console.error("Error while fetching wallet:", error);
            throw error;
        }
    }

  async detailsOfAdmintransactionperWeek(adminId: string): Promise<TransactionDetailsByWeek[]> {
        try { 
            const transactionsByWeek: TransactionDetailsByWeek[] = [];
            const walletDetails = await walletModel.findOne({ owner: adminId });
            if (!walletDetails) {
                return transactionsByWeek; 
            }
    
            // Group transactions by week start dates
            const transactionsGroupedByWeek = new Map<string, TransactionDetailsByWeek>();
            walletDetails.transactions.forEach(transaction => {
                const weekStartDate = getWeekStartDate(transaction.date);
                if (!transactionsGroupedByWeek.has(weekStartDate)) {
                    transactionsGroupedByWeek.set(weekStartDate, {
                        startDate: weekStartDate,
                        credit: 0,
                        debit: 0
                    });
                }
                const week = transactionsGroupedByWeek.get(weekStartDate)!; // "!" ensures that the value is present
                if (transaction.type === 'credit') {
                    week.credit += transaction.amount; 
                } else {
                    week.debit += transaction.amount; 
                }
            });
    
            // Convert map values to array
            transactionsByWeek.push(...transactionsGroupedByWeek.values());
    
            return transactionsByWeek;
        } catch (error) {
            console.error("Error while fetching wallet:", error);
            throw error;
        }
    }
    
    async getAppointmentDetails(appointmentId: string): Promise<AdminAppointmentDetails> {
      try {
        const appointmentDetails = await appointmentModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(appointmentId) },
          },
          {
            $lookup: {
              from: 'doctors',
              localField: 'doctor',
              foreignField: '_id',
              as: 'doctorDetails',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'patient',
              foreignField: '_id',
              as: 'patientDetails',
            },
          },
          {
            $lookup: {
              from: 'medicalrecords',
              localField: 'patient',
              foreignField: 'userId',
              as: 'medicalRecords',
            },
          },
          {
            $unwind: '$doctorDetails',
          },
          {
            $unwind: '$patientDetails',
          },
          {
            $lookup: {
              from: 'reviews',
              let: { doctorId: '$doctorDetails._id' }, 
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ['$doctor', '$$doctorId'] }, 
                  },
                },
              ],
              as: 'doctorReviews',
            },
          },
          {
            $group: {
              _id: '$_id',
              typeOfAppointment: { $first: '$typeOfAppointment' },
              date: { $first: '$date' },
              slot: { $first: '$slot' },
              amount: { $first: '$amount' },
              duration: { $first: '$duration' },
              status: { $first: '$status' },
              paymentStatus: { $first: '$paymentStatus' },
              prescription: { $first: '$prescription' },
              cancellationRequests: { $first: '$cancellationRequests' },
              'doctorDetails': { $first: '$doctorDetails' }, 
              'patientDetails': { $first: '$patientDetails' },
              'medicalRecords': { $first: '$medicalRecords' },
              'doctorReviews': { $push: '$doctorReviews' },
            },
          },
          {
            $project: {
              typeOfAppointment: 1,
              date: 1,
              slot: 1,
              amount: 1,
              duration: 1,
              status: 1,
              paymentStatus: 1,
              prescription: 1,
              cancellationRequests: 1,
              'doctorDetails._id': 1,
              'doctorDetails.firstName': 1,
              'doctorDetails.lastName': 1,
              'doctorDetails.email': 1,
              'doctorDetails.phone': 1,
              'doctorDetails.profilePic': 1,
              'patientDetails.firstName': 1,
              'patientDetails.lastName': 1,
              'patientDetails.email': 1,
              'patientDetails.gender': 1,
              'patientDetails.profilePic': 1,
              'medicalRecords': 1,
              'doctorReviews': {
                $avg: '$doctorReviews.rating', 
              },
            },
          },
        ]);
    
        if (!appointmentDetails.length) {
          throw new CustomError('Appointment not found', 404);
        }
    
        console.log("Appointment Details from admin ", appointmentDetails);
        return appointmentDetails[0];
      } catch (error: unknown) {
        if (error instanceof CustomError) {
          throw error;
        } else {
          const castedError = error as Error;
          throw new CustomError(castedError.message || 'Internal Server Error', 500);
        }
      }
    }
    
    async  getReviewdetails(page: number = 1, pageSize: number = 7, searchQuery: string = ''): Promise<PaginatedReviewResult> {
      try {
        const skip = (page - 1) * pageSize;
        const matchStage = searchQuery ? { $match: { comment: { $regex: searchQuery, $options: 'i' } } } : null;

        const aggregationPipeline: any[] = [];

        if (matchStage) {
            aggregationPipeline.push(matchStage);
        }

        aggregationPipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'patientName',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $unwind: '$patient'
            },
            {
                $unwind: '$doctor'
            },
            {
                $project: {
                    patientName: {
                        $concat: ['$patient.firstName', ' ', '$patient.lastName']
                    },
                    patientProfilePic:'$patient.profilePic',
                    doctorName: {
                        $concat: ['$doctor.firstName', ' ', '$doctor.lastName']
                    },
                    doctorProfilePic:'$doctor.profilePic',
                    rating: 1,
                    comment: 1,
                    createdAt: {
                      $dateToString: {
                          format: "%Y-%m-%d %H:%M:%S",
                          date: "$createdAt",
                          timezone: "UTC" 
                      }
                  },
                    patientId: '$patient._id',
                    doctorId: '$doctor._id'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            }
        );

        const reviews = await ReviewModel.aggregate(aggregationPipeline).exec();
        const totalCount = await ReviewModel.countDocuments(matchStage ? matchStage.$match : {}).exec();
        const totalPages = Math.ceil(totalCount / pageSize);
        console.log("Reviwws getted By admin ",reviews);
        return {
            reviews,
            page,
            pageSize,
            totalCount,
            totalPages
        };
      } catch (error: unknown) {
          if (error instanceof CustomError) {
              throw error;
          } else {
              const castedError = error as Error;
              throw new CustomError(castedError.message || 'Internal Server Error', 500);
          }
      }
  }

    async deleteReview(revId: string): Promise<void> {
      try {
          const result = await ReviewModel.findByIdAndDelete(revId);
          if (!result) {
              throw new CustomError('Review not found', 404);
          }
          console.log(`Review with id ${revId} has been deleted successfully.`);
      } catch (error: unknown) {
          if (error instanceof CustomError) {
              throw error;
          } else {
              const castedError = error as Error;
              throw new CustomError(castedError.message || 'Internal Server Error', 500);
          }
      }
  }
  

    private async fetchRoleDetails(roleIds: string[]): Promise<RoleDetails[]> {
        try {
            const roles = await roleModel.find({ _id: { $in: roleIds } });
            const roleDetails: RoleDetails[] = roles.map(role => ({
                roleId: role._id.toString(),
                roleName: role.name,
                permissions: role.permissions // Assuming your roleModel has a 'permissions' field
            }));
            return roleDetails;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
                throw new CustomError(castedError.message || 'Failed to findByemail',500);
            }
        }
    }

    private async convertToDomain(admin: Admin | null): Promise<Admin | null> {
        if (!admin) return null;
        console.log("log from converttodomain",admin);
        const roleIds: string[] = admin.roles.map(role => role.toString());
        const roleDetails:RoleDetails[] = await this.fetchRoleDetails(roleIds);
        return admin ? new Admin(
            admin.username,
            admin.password,
            admin.email,
            roleDetails as RoleDetails[],
            admin.createdAt,
            admin.updatedAt,
            admin._id // Convert ObjectId to string
        ).toJSON() : null;
    }

}