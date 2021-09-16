import { model, Schema, Types, Document } from 'mongoose';
import { IReview } from './Review';

export interface IMovie extends Document {
    tmdbId: string;
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
    tmdbId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        text: true,
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

MovieSchema.index({ title: "text" });

const Movie = model<IMovie>('Movie', MovieSchema);

Movie.createIndexes();

export { Movie };