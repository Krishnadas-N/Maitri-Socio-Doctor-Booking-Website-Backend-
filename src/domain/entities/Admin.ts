import { ObjectId } from "mongodb";
export interface RoleDetails {
    roleId: string;
    roleName: string;
    permissions: string[];
}
interface IAdmin {
    _id?: string | ObjectId;
    username: string;
    email:string;
    password: string;
    roles: string[] | RoleDetails[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  class Admin implements IAdmin {
    _id?: string |ObjectId;
    username: string;
    email:string;
    password: string;
    roles: string[] | RoleDetails[];
    createdAt: Date;
    updatedAt: Date;
    
    constructor(
        username: string,
        password: string,
        email: string,
        roles: string[] | RoleDetails[], // Use union type for roles
        createdAt: Date = new Date(Date.now()),
        updatedAt: Date = new Date(Date.now()),
        _id?: string | ObjectId
    ) {
        
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._id = _id;
       
    }
  
    static fromJSON(json: any): Admin {
      return new Admin(json.username,json.password, json.email, json.roles, json.createdAt, json.updatedAt,json._id);
    }
  
    toJSON(): any {
      return {
        _id: this._id,
        username: this.username,
        password: this.password,
        email: this.email,
        roles: this.roles,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  }
  
  export default Admin;