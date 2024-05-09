"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
class Admin {
    constructor(username, password, email, roles, // Use union type for roles
    createdAt = new Date(Date.now()), updatedAt = new Date(Date.now()), _id) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._id = _id;
    }
    static fromJSON(json) {
        return new Admin(json.username, json.password, json.email, json.roles, json.createdAt, json.updatedAt, json._id);
    }
    toJSON() {
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
exports.Admin = Admin;
