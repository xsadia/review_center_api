import { model, Schema, Document, Types } from 'mongoose';
import { IMovie } from './Movie';
import { IUser } from './User';

export interface IReview extends Document {
    review: string;
    score: number;
    userId: IUser["_id"];
    movieId: IMovie["_id"];
    createdAt: Date;
    deletedAt: Date;
}

const ReviewSchema = new Schema({
    review: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    movieId: {
        type: Types.ObjectId,
        ref: 'Movie'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    }
});

export const Review = model<IReview>('Review', ReviewSchema);