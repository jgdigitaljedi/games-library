import Axios from 'axios';
import { IGame } from '../models/games.model';
import { getRequestKey } from './auth.service';

export const saveGame = async (game: IGame) => {
  const key = getRequestKey(); // wire this into the call/gotta be server side and client side
  if (game.hasOwnProperty('_id')) {
    const url = `${window.urlPrefix}/api/vg/games/${game._id}`;
    const result = await Axios.patch(url, game);
    return result;
  } else {
    const url = `${window.urlPrefix}/api/vg/games`;
    const result = await Axios.put(url, game);
    return result;
  }
};
