"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorSpecializtion = void 0;
class DoctorSpecializtion {
    constructor(name, description, isBlocked = false, _id) {
        this.name = name;
        this.description = description;
        this.isBlocked = isBlocked;
        this._id = _id;
    }
}
exports.DoctorSpecializtion = DoctorSpecializtion;
