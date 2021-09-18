import { Schema, model, Document } from 'mongoose';

export interface IGenre extends Document {
    genreId: number;
    genreName: string;
}

const GenreSchema = new Schema({
    genreId: {
        type: Number,
        required: true,
        unique: true
    },
    genreName: {
        type: String,
        required: true,
        unique: true
    }
});

export const Genre = model<IGenre>('Genre', GenreSchema);
