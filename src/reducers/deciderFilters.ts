import { IFormState } from '../models/common.model';

const initState = {
  name: '',
  players: 0,
  genre: '',
  esrb: '',
  platform: '',
  everDrive: false
};

export default function deciderFilters(state = initState, action: any): IFormState {
  if (action.type === 'CHANGE_DECIDERFILTERS') {
    return action.payload;
  } else {
    return state;
  }
}
