import get from 'lodash/get';
import { IFormState } from '../models/common.model';
import { IConsoleArr } from '../models/platforms.model';
import { IGame } from '../models/games.model';
import SortService from './sorts.service';

export const filters = {
  defaultFormState: (): IFormState => {
    return {
      name: '',
      players: 0,
      genre: '',
      esrb: '',
      platform: '',
      everDrive: false,
      physical: false,
      location: null,
      handheld: 'show'
    };
  },
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
      // return d.consoleName === platform;
      return (d.consoleArr as IConsoleArr[]).map(d => d.consoleName).indexOf(platform) >= 0;
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
      return get(d, 'igdb.genres').indexOf(genre) >= 0;
    });
  },
  filterLocation: (data: IGame[], location: string | null) => {
    if (location) {
      const result = data.filter(d => {
        return get(d, 'location') === location;
      });
      if (location === 'upstairs' || location === 'downstairs') {
        const bothArr = data.filter(d => get(d, 'location') === 'both');
        return SortService.sortData([...result, ...bothArr], 'dateAdded', 'descending');
      }
      return result;
    }
    return data;
  },
  filterHandhelds: (data: IGame[], handheld: string) => {
    if (handheld === 'hide') {
      return data.filter(g => !g.handheld);
    } else if (handheld === 'only') {
      return data.filter(g => g.handheld);
    }
    return data;
  }
};
