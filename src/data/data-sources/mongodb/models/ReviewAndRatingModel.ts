import mongoose, { Schema } from "mongoose";
import { Review } from "../../../../domain/entities/Doctor";

const ReviewSchema: Schema<Review> = new Schema<Review>(
    {
        appointmentId:{
            type: Schema.Types.ObjectId,
            ref: 'Appointment', 
            required: true
        }, 
        doctor:{
            type: Schema.Types.ObjectId,
            ref: 'Doctor', 
            required: true
        },
        patientName: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

export const ReviewModel = mongoose.model<Review>("Review", ReviewSchema);
