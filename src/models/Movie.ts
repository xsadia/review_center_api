import { model, Schema, Types, Document } from 'mongoose';

interface IMovie extends Document {
    title: string;
    firstAirDate: Date;
    overview: string;
    score: number;
    reviews: Array<Types.ObjectId>;
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date
    }
});

export const Movie = model<IMovie>('Movie', MovieSchema);