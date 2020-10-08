import { IFormState } from '../models/common.model';

export default function changeDeciderFilters(deciderFilters: IFormState) {
  return { type: 'CHANGE_DECIDERFILTERS', payload: deciderFilters };
}
