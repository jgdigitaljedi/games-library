import { get as _get, sortBy as _sortBy } from 'lodash';
import { IGame } from '../common.model';

export default {
  sortDropdownCats: () => {
    return [
      { label: 'Purchase Date', value: 'date_purchased' },
      { label: 'Name', value: 'igdb.name' },
      { label: 'Release Date', value: 'igdb.first_release_date' },
      { label: 'Purchase Price', value: 'pricePaid' },
      { label: 'Rating', value: 'igdb.total_rating' },
      { label: 'Max # Players', value: 'multiplayerNumber' }
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
      if (cat.toLowerCase().indexOf('date') >= 0) {
        // sortBy ain't gonna work with dates
        sorted = data.sort((a, b) => {
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
          // eslint-ignore-next-line
          return new Date(aDate) > new Date(bDate) ? 1 : -1;
        });
      } else {
        sorted = _sortBy(data, cat);
      }
      if (dir === 'descending') {
        // should it be reversed
        return sorted.reverse();
      }
      return sorted;
    }
    return data;
  }
};
