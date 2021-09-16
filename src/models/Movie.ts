import { model, Schema, Types, Document } from 'mongoose';
import { IReview } from './Review';

export interface IMovie extends Document {
    title: string;
    firstAirDate: Date;
    overview: string;
    score: number;
    reviews: Array<IReview['_id']>;
    posterPath: string;
    createdAt: Date;
    deletedAt: Date;
}

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    firstAirDate: {
        type: Date,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: Types.ObjectId,
            ref: 'Review'
        }
    ],
    posterPath: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    }
});

export const Movie = model<IMovie>('Movie', MovieSchema);