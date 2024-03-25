"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(email, password, username, firstname, lastName, gender, dateOfBirth, _id, profilePic) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.firstname = firstname;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this._id = _id;
        this.profilePic = profilePic;
    }
}
exports.User = User;
