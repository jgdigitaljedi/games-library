import Axios, { AxiosResponse } from 'axios';
import { IGame } from '@/models/games.model';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';

const endpoint = 'games';

export const saveGame = async (game: IGame, isUpdate?: boolean) => {
  const hasKey = !!getRequestKey();
  if (isUpdate && hasKey) {
    const params = makeRequest(endpoint, game._id);
    const result = await Axios.patch(params.url, game, params.headers);
    return result;
  } else if (hasKey) {
    const params = makeRequest(endpoint);
    const result = await Axios.put(params.url, game, params.headers);
    return result;
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};

export const igdbGameSearch = async (
  name: string,
  platform: number,
  fuzzy = false
): Promise<AxiosResponse | any> => {
  const hasKey = !!getRequestKey();
  if (hasKey && name) {
    const params = makeRequest('searchgame');
    const body = {
      game: name,
      platform,
      fuzzy
    };
    console.log('request body in client', body);
    const request = await Axios.post(params.url, body, params.headers);
    return request;
  } else {
    return {
      error: true,
      message: 'You must be logged in to search IGDB and you must at least send a name!'
    };
  }
};
