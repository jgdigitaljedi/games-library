import { combineReducers } from 'redux';
import viewWhat from './viewWhat';
import masterData from './masterData';
import filteredData from './filteredData';

export default combineReducers({
  viewWhat,
  masterData,
  filteredData
});
