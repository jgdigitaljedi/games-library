import get from 'lodash/get';
import { IGame } from '../common.model';

export const filters = {
  filterName: (data: IGame[], str: string): IGame[] => {
    const lc = str.toLowerCase();
    return data.filter(d => {
      return (
        get(d, 'igdb.name')
          .toLowerCase()
          .indexOf(lc) >= 0
      );
    });
  },
  filterPlatform: (data: IGame[], platform: string): IGame[] => {
    return data.filter(d => {
      return d.consoleName === platform;
    });
  },
  filterPlayers: (data: IGame[], players: number): IGame[] => {
    return data.filter(d => {
      const mpn = get(d, 'multiplayerNumber');
      return parseInt(mpn as string) >= players;
    });
  },
  filterEsrb: (data: IGame[], esrb: string): IGame[] => {
    return data.filter(d => {
      return get(d, 'igdb.esrb') === esrb;
    });
  },
  filterGenre: (data: IGame[], genre: string): IGame[] => {
    return data.filter(d => {
      return get(d, 'genres').indexOf(genre) >= 0;
    });
  }
};
