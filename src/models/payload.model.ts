import { RoleDetails } from "../domain/entities/Admin";
import { objectId } from "./users.model";

export interface Payload {
    id: objectId | undefined | string;
    roles: RoleDetails[] | string[];
    iat: number;
    exp: number;
}
