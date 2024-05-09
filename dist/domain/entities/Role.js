"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
class Role {
    constructor(name, permissions, createdAt = new Date(Date.now()), updatedAt = new Date(Date.now()), id) {
        this._id = id;
        this.name = name;
        this.permissions = permissions;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(json) {
        return new Role(json.id, json.name, json.permissions, json.createdAt, json.updatedAt);
    }
    toJSON() {
        return {
            id: this._id,
            name: this.name,
            permissions: this.permissions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.Role = Role;
exports.default = Role;
