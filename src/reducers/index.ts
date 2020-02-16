import { combineReducers } from 'redux';
import viewWhat from './viewWhat';
import masterData from './masterData';
import filteredData from './filteredData';
import deciderFilters from './deciderFilters';

export default combineReducers({
  viewWhat,
  masterData,
  filteredData,
  deciderFilters
});
