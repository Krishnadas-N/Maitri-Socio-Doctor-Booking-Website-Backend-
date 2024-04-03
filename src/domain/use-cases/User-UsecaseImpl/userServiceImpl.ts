import { CustomError } from "../../../../utils/CustomError";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-IRepository";
import { userUseCase } from "../../interfaces/use-cases/UserService/User-usecase";

export class UserUseCaseImpl implements userUseCase{
    
    constructor(private UserRepo:UserRepository){}
    profile(id: string): Promise<User> {
        const user = this.UserRepo.getUser(id);
        if(!user){
            throw new CustomError('User doesnot Exist',401);
        }
        return user;
    }

    async forgotPassword(email: string): Promise<void> {
     try {
        if(!email){
            throw new CustomError('Email is Not Found',404)
        }
       return this.UserRepo.setResetToken(email);
    } catch (error:any) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError(error.message || 'Error In forgotPassword', 500);
    }
    }

   async  setResetPassword(token: string, password: string): Promise<void> {
    try {
        if(!token || password){
            throw new CustomError('Token or Password  is not provided',400);
        }
        await this.UserRepo.findResetTokenAndSavePassword(token,password);
    } catch (error:any) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError(error.message || 'Error In forgotPassword', 500);
    }
   }

}