import { IGame, IGameDisplay } from '../models/games.model';
import moment from 'moment';

export const cleanupGames = (games: IGame[]): IGameDisplay[] => {
    return games.map(game => {
        (game as IGameDisplay).genresDisplay = game.genres?.join(', ') || '';
        (game as IGameDisplay).purchaseDate = game.datePurchased ? moment(game.datePurchased).format('MM/DD/YYYY') : '';
        return game;
    }) as IGameDisplay[];
};
