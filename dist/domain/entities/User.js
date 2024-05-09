"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(email, password, username, firstName, lastName, gender, dateOfBirth, _id, profilePic, isVerified, resetToken, roles) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this._id = _id;
        this.profilePic = profilePic;
        this.isVerified = isVerified;
        this.resetToken = resetToken;
        this.roles = roles;
    }
    toJson() {
        return {
            email: this.email,
            password: this.password,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            dateOfBirth: this.dateOfBirth,
            _id: this._id,
            profilePic: this.profilePic,
            isVerified: this.isVerified,
            resetToken: this.resetToken,
            roles: this.roles,
        };
    }
    static fromJSON(json) {
        return new User(json.email, json.password, json.username, json.firstName, json.lastName, json.gender, json.dateOfBirth, json._id, json.profilePic, json.isVerified, json.resetToken, json.roles);
    }
}
exports.User = User;
