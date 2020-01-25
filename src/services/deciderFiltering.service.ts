import get from 'lodash/get';

export const filters = {
  filterName: (data: object[], str: string): object[] => {
    const lc = str.toLowerCase();
    return data.filter(d => {
      return get(d, 'igdb.name')
        .toLowerCase()
        .indexOf(lc);
    });
  },
  filterPlayers: (data: object[], players: number): object[] => {
    return data.filter(d => {
      return get(d, 'multiplayerNumber') >= players;
    });
  },
  filterEsrb: (data: object[], esrb: string): object[] => {
    return data.filter(d => {
      return get(d, 'igdb.esrb') === esrb;
    });
  },
  filterGenre: (data: object[], genre: string): object[] => {
    return data.filter(d => {
      return get(d, 'genres').indexOf(genre) >= 0;
    });
  }
};
