import get from 'lodash/get';
import { IFormState } from '../models/common.model';
// import { IConsoleArr } from '../models/platforms.model';
import { IGame } from '../models/games.model';
import SortService from './sorts.service';

export const filters = {
  defaultFormState: (): IFormState => {
    return {
      name: '',
      players: 0,
      genre: [],
      esrb: '',
      platform: [],
      everDrive: false,
      physical: false,
      location: null,
      handheld: 'show'
    };
  },
  filterName: (data: IGame[], str: string): IGame[] => {
    const lc = str.toLowerCase();
    return data.filter((d) => {
      return get(d, 'name').toLowerCase().indexOf(lc) >= 0;
    });
  },
  filterPlatform: (data: IGame[], platform: string[]): IGame[] => {
    if (platform.length) {
      return data.filter((d) => {
        return platform.indexOf(d.consoleName) >= 0;
        // return d.consoleName === platform;
      });
    } else {
      return data;
    }
  },
  filterPlayers: (data: IGame[], players: number): IGame[] => {
    return data.filter((d) => {
      const mpn = get(d, 'multiplayerNumber');
      return parseInt(mpn as string) >= players;
    });
  },
  filterEsrb: (data: IGame[], esrb: string): IGame[] => {
    return data.filter((d) => {
      return get(d, 'esrb') === esrb;
    });
  },
  filterGenre: (data: IGame[], genre: string[]): IGame[] => {
    if (genre?.length) {
      return data.filter((d) => {
        // return get(d, 'igdb.genres').indexOf(genre) >= 0;
        return genre.some((g) => get(d, 'genres').indexOf(g) >= 0);
      });
    }
    return data;
  },
  filterLocation: (data: IGame[], location: string | null) => {
    if (location) {
      const result = data.filter((d) => {
        return get(d, 'location') === location;
      });
      if (location === 'upstairs' || location === 'downstairs') {
        const bothArr = data.filter((d) => get(d, 'location') === 'both');
        return SortService.sortData([...result, ...bothArr], 'dateAdded', 'descending');
      }
      return result;
    }
    return data;
  },
  filterHandhelds: (data: IGame[], handheld: string) => {
    if (handheld === 'hide') {
      return data.filter((g) => !g.handheld);
    } else if (handheld === 'only') {
      return data.filter((g) => g.handheld);
    }
    return data;
  }
};
