import { RoleDetails } from "../domain/entities/Admin";
import { objectId } from "./users.model";

export interface Payload {
    id: objectId | string;
    roles: RoleDetails[];
    iat: number;
    exp: number;
}

