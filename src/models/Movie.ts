import { model, Schema, Types, Document } from 'mongoose';
import { IGenre } from './Genre';
import { IReview } from './Review';

export interface IMovie extends Document {
    tmdbId: string;
    title: string;
    firstAirDate: Date;
    genres: Types.Array<IGenre['_id']>;
    overview: string;
    score: number;
    reviews: Types.Array<IReview['_id']>;
    posterPath: string;
    createdAt: Date;
    deletedAt: Date;
}

const MovieSchema = new Schema({
    tmdbId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    firstAirDate: {
        type: Date,
        required: true
    },
    genres: [
        {
            type: Types.ObjectId,
            ref: 'Genre',
            default: []
        }
    ],
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
