import { AdminDataSource } from "../../data/data-sources/mongodb/mongodbAdminDataSource";
import { MongoDbDoctorDataSourceImpl } from "../../data/data-sources/mongodb/mongodbDoctorDataSource";
import { MongoDbUserDataSource } from "../../data/data-sources/mongodb/mongodbUserDataSource";
import { AdminRepository } from "../../domain/repositories/adminRepository";
import { IDoctorRepositoryImpl } from "../../domain/repositories/doctorRepository";
import { UserRepository } from "../../domain/repositories/userRepository";
import { AuthMiddleware } from "../../middlewares/jwtAuthenticationMiddleware";



const adminDataSource = new AdminDataSource();
const adminRepository = new AdminRepository(adminDataSource);

const userDataSource = new MongoDbUserDataSource()
const userRepositoryImpl = new UserRepository(userDataSource)

const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);


export const authMiddleWare = new AuthMiddleware(userRepositoryImpl,doctorRepo,adminRepository)
