import { AdminDataSource } from "../../data/data-sources/mongodb/mongodb-admin-dataSource";
import { MongoDbDoctorDataSourceImpl } from "../../data/data-sources/mongodb/mongodb-doctor-dataSource";
import { MongoDbUserDataSource } from "../../data/data-sources/mongodb/mongodb-user-dataSource";
import { AdminRepoImpl } from "../../domain/repositories/admin-repoImpl";
import { IDoctorRepositoryImpl } from "../../domain/repositories/doctor-repository";
import { UserAuthenticationRepoImpl } from "../../domain/repositories/user-repository";
import { AuthMiddleware } from "../../middlewares/jwtAuthenticationMiddleware";



const adminDataSource = new AdminDataSource();
const adminRepository = new AdminRepoImpl(adminDataSource);

const userRepositoryImpl = new UserAuthenticationRepoImpl(new MongoDbUserDataSource())

const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);

export const authMiddleWare = new AuthMiddleware(userRepositoryImpl,doctorRepo,adminRepository)
