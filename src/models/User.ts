import { model, Schema, Document, Types } from "mongoose";
import { IReview } from "./Review";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    reviews: Array<IReview['_id']>;
    createdAt: Date;
}

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Types.ObjectId,
            ref: 'Review'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = model<IUser>('User', UserSchema);