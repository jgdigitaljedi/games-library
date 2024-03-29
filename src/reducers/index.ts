import { combineReducers } from 'redux';
import viewWhat from './viewWhat';
import masterData from './masterData';
import filteredData from './filteredData';
import deciderFilters from './deciderFilters';
import platformsArr from './platformsArr';
import userState from './userState';

export default combineReducers({
  viewWhat,
  masterData,
  filteredData,
  deciderFilters,
  platformsArr,
  userState
});
