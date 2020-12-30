import Axios, { AxiosResponse } from 'axios';
import { IGame } from '@/models/games.model';
import { getRequestKey } from './auth.service';
import { makeRequest } from './generalCrud.service';

const endpoint = 'games';

export const saveGame = async (game: IGame, isUpdate?: boolean) => {
  const hasKey = !!getRequestKey();
  console.log('game to be updated', game);
  if (isUpdate && hasKey) {
    const params = makeRequest(endpoint, game._id);
    const result = await Axios.patch(params.url, game, params.headers);
    return result;
  } else if (hasKey) {
    const params = makeRequest(endpoint);
    console.log('param', params);
    console.log('game', game);
    const result = await Axios.put(params.url, game, params.headers);
    return result;
  } else {
    return {
      error: true,
      message: 'You must be logged in to do that!'
    };
  }
};

export const deleteGame = async (game: IGame) => {
  const hasKey = !!getRequestKey();
  if (hasKey && game) {
    const params = makeRequest(endpoint, game._id);
    const result = await Axios.delete(params.url, params.headers);
    return result;
  } else if (hasKey) {
    return {
      error: true,
      message: 'Empty request: you must send a game to delete.'
    };
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
