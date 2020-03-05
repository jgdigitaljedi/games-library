import { get as _get, sortBy as _sortBy } from 'lodash';
import { IGame, IDropdown } from '../common.model';

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
      const sorted = _sortBy(data, cat);
      if (dir === 'descending') {
        return sorted.reverse();
      }
      return sorted;
    }
    return data;
  }
};
