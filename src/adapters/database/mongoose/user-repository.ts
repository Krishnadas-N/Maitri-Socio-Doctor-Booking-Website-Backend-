import { User } from "../../../core/entities/User";
import { UserModel } from "./user-model";

import {UserRepository} from "../../../core/use-cases/user-repository"

export class  InMemoryUserRepository implements UserRepository{
    async findByEmail(email: string): Promise<User | null> {
        const userDoc  = await UserModel.findOne({email});
        return userDoc ? new User(userDoc?._id?.toString(), userDoc.email, userDoc.password) : null;
    }

    async save(user:User) :Promise<User> {
        const userDoc = new UserModel({ username: user.email, password: user.password });
    await userDoc.save();
    return new User(userDoc._id.toString(), userDoc.email, userDoc.password);  
    }
}