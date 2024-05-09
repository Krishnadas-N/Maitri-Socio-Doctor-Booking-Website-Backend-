"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Availability = exports.Education = exports.Review = exports.Address = void 0;
class Address {
    constructor(state, city, zipcode, country) {
        this.state = state;
        this.city = city;
        this.zipcode = zipcode;
        this.country = country;
    }
}
exports.Address = Address;
class Review {
    constructor(patientName, comment, rating, createdAt = new Date()) {
        this.patientName = patientName;
        this.comment = comment;
        this.rating = rating;
        this.createdAt = createdAt;
    }
}
exports.Review = Review;
class Education {
    constructor(degree, institution, year) {
        this.degree = degree;
        this.institution = institution;
        this.year = year;
    }
}
exports.Education = Education;
class Availability {
    constructor(dayOfWeek, startTime, endTime, isAvailable) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isAvailable = isAvailable;
    }
}
exports.Availability = Availability;
class consultationFee {
    constructor(type, fee) {
        this.type = type;
        this.fee = fee;
    }
}
class Doctor {
    constructor(_id, firstName, lastName, gender, dateOfBirth, email, password, phone, address, specialization, education, experience, certifications, languages, availability, profilePic, bio, isVerified, typesOfConsultation, maxPatientsPerDay, roles, consultationFee, registrationStepsCompleted, createdAt, updatedAt, followers, rating, isBlocked, reviews, isProfileComplete, resetToken, selectedSlots) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
        this.specialization = specialization;
        this.education = education;
        this.experience = experience;
        this.certifications = certifications;
        this.languages = languages;
        this.availability = availability;
        this.profilePic = profilePic;
        this.bio = bio;
        this.isVerified = isVerified;
        this.typesOfConsultation = typesOfConsultation;
        this.maxPatientsPerDay = maxPatientsPerDay;
        this.roles = roles;
        this.consultationFee = consultationFee;
        this.registrationStepsCompleted = registrationStepsCompleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.followers = followers;
        this.rating = rating;
        this.isBlocked = isBlocked;
        this.reviews = reviews;
        this.isProfileComplete = isProfileComplete;
        this.resetToken = resetToken;
        this.selectedSlots = selectedSlots;
    }
    toJson() {
        var _a;
        return {
            _id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            dateOfBirth: this.dateOfBirth,
            email: this.email,
            password: this.password,
            phone: this.phone,
            address: {
                state: this.address.state,
                city: this.address.city,
                zipcode: this.address.zipcode,
                country: this.address.country
            },
            specialization: this.specialization,
            education: this.education.map(edu => ({
                degree: edu.degree,
                institution: edu.institution,
                year: edu.year
            })),
            experience: this.experience,
            certifications: this.certifications,
            languages: this.languages,
            consultationFee: this.consultationFee,
            availability: this.availability.map(avail => ({
                dayOfWeek: avail.dayOfWeek,
                startTime: avail.startTime,
                endTime: avail.endTime
            })),
            registrationStepsCompleted: this.registrationStepsCompleted,
            profilePic: this.profilePic,
            bio: this.bio,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            followers: this.followers,
            isVerified: this.isVerified,
            typesOfConsultation: this.typesOfConsultation,
            maxPatientsPerDay: this.maxPatientsPerDay,
            rating: this.rating,
            isBlocked: this.isBlocked,
            reviews: (_a = this.reviews) === null || _a === void 0 ? void 0 : _a.map(review => ({
                patientName: review.patientName,
                comment: review.comment,
                rating: review.rating,
                createdAt: review.createdAt
            })),
            isProfileComplete: this.isProfileComplete,
            resetToken: this.resetToken,
            selectedSlots: this.selectedSlots,
            roles: this.roles,
        };
    }
}
exports.default = Doctor;
