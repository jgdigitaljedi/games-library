import { cloneDeep as _cloneDeep, set as _set } from 'lodash';

export const handleChange = (e: any, state: any) => {
  const isSwitch = e.hasOwnProperty('value');
  const { value } = isSwitch ? e : e.target;
  const propPath = isSwitch ? e.target.id : e.target.getAttribute('attr-which');
  const copy = _cloneDeep(state);
  if (copy) {
    _set(copy, propPath, value);
    return copy;
  }
  return null;
};
