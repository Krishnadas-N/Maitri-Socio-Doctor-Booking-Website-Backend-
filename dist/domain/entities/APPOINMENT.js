"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
class Appointment {
    constructor(patient, doctor, typeOfAppointment, date, slot, amount, duration, status, createdAt, paymentStatus, payment, consultationLink) {
        this.patient = patient;
        this.doctor = doctor;
        this.typeOfAppointment = typeOfAppointment;
        this.date = date;
        this.slot = slot;
        this.amount = amount;
        this.duration = duration;
        this.status = status;
        this.createdAt = createdAt;
        this.paymentStatus = paymentStatus;
        this.payment = payment;
        this.consultationLink = consultationLink;
    }
}
exports.Appointment = Appointment;
