import { IGame, IGameDisplay } from '@/models/games.model';
import moment from 'moment';

const dateDisplayFormat = 'MM/DD/YYYY';

export const cleanupGames = (games: IGame[]): IGameDisplay[] => {
    return games.map(game => {
        (game as IGameDisplay).genresDisplay = game.genres?.join(', ') || '';
        (game as IGameDisplay).purchaseDate = game.datePurchased ? moment(game.datePurchased).format(dateDisplayFormat) : '';
        return game;
    }) as IGameDisplay[];
};
