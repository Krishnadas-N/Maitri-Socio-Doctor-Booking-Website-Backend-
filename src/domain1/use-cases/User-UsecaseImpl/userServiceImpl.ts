import { CustomError } from "../../../../utils/CustomError";
import { User } from "../../entities/User";
import { UserRepository } from "../../interfaces/repositories/user-Authentication";
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
}