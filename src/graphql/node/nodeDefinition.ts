import { fromGlobalId, nodeDefinitions } from 'graphql-relay';
import { User } from '../../models/User';
import { Movie } from '../../models/Movie';
import { Review } from '../../models/Review';
import { MovieType } from '../movie/MovieType';
import { ReviewType } from '../review/ReviewType';

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
    async (globalId) => {
        const { type, id } = fromGlobalId(globalId);

        if (type === 'Movie') {
            return await Movie.findOne({ _id: id });
        }

        if (type === 'Review') {
            return await Review.findOne({ _id: id });
        }

        return null;
    },
    (obj) => {
        if (obj instanceof Movie) {
            return MovieType;
        }

        if (obj instanceof Review) {
            return ReviewType;
        }

        return null;
    }
);