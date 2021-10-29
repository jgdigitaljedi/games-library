import { get as _get, sortBy as _sortBy } from 'lodash';
import { IGame } from '@/models/games.model';

export default {
  sortDateWithSlash: (data: string[]) => {
    return data.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      const aSplit = a.split('/');
      const bSplit = b.split('/');
      const aFormatted = new Date(`${aSplit[0]}-01-20${aSplit[1]}`);
      const bFormatted = new Date(`${bSplit[0]}-01-20${bSplit[1]}`);
      return aFormatted > bFormatted ? 1 : -1;
    });
  },
  sortDropdownCats: () => {
    return [
      { label: 'Purchase Date', value: 'datePurchased' },
      { label: 'Name', value: 'name' },
      { label: 'Release Date', value: 'first_release_date' },
      { label: 'Value', value: 'priceCharting.price' },
      { label: 'Purchase Price', value: 'pricePaid' },
      { label: 'Rating', value: 'total_rating' },
      { label: 'Max # Players', value: 'maxMultiplayer' }
    ];
  },
  sortDropdownDirections: () => {
    return [
      { label: 'Descending', value: 'descending' },
      { label: 'Ascending', value: 'ascending' }
    ];
  },
  sortData: (data: IGame[], cat: string, dir: string) => {
    if (typeof cat === 'string' && typeof dir === 'string') {
      // basic check to make sure things are legit
      let sorted;
      const noData: IGame[] = [];
      if (cat.toLowerCase().indexOf('date') >= 0) {
        // sortBy ain't gonna work with dates
        sorted = data
          .filter(g => {
            const hasData = _get(g, cat);
            if (!hasData) {
              noData.push(g);
            }
            return hasData;
          })
          .sort((a, b) => {
            const aDate: string = _get(a, cat);
            const bDate: string = _get(b, cat);
            if ((!aDate && !bDate) || aDate === bDate) {
              return 0;
            }
            if (!aDate) {
              return 1;
            }
            if (!bDate) {
              return -1;
            }
            return new Date(aDate) > new Date(bDate) ? 1 : -1;
          });
      } else if (cat === 'name') {
        sorted = data.sort((a, b) => {
          const aLower = _get(a, cat).toLowerCase();
          const bLower = _get(b, cat).toLowerCase();
          if (aLower > bLower) {
            return 1;
          }
          if (bLower > aLower) {
            return -1;
          }
          return 0;
        });
      } else if (cat === 'maxMultiplayer' || cat === 'pricePaid') {
        sorted = data
          .filter(g => {
            const gData = _get(g, cat);
            if (!gData) {
              noData.push(g);
            }
            return gData;
          })
          .sort((a, b) => {
            if (!a) {
              return -1;
            }
            if (!b) {
              return 1;
            }
            // @ts-ignore
            const aLower = parseFloat(_get(a, cat).toString());
            // @ts-ignore
            const bLower = parseFloat(_get(b, cat).toString());
            if (aLower > bLower) {
              return 1;
            }
            if (bLower > aLower) {
              return -1;
            }
            return 0;
          });
      } else {
        sorted = _sortBy(
          data.filter(g => {
            const gData = _get(g, cat);
            if (!gData) {
              noData.push(g);
            }
            return gData;
          }),
          cat
        );
      }
      // the idea is that I'm splitting of games without the required data point then putting them on the end of the return
      if (dir === 'descending') {
        // should it be reversed
        return [...sorted.reverse(), ...noData];
      }
      return [...sorted, ...noData];
    }
    return data;
  }
};
