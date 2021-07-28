import { cloneDeep as _cloneDeep, set as _set } from 'lodash';

function checkPathForPrefix(val: string): string {
  if (val.indexOf('GS') >= 0) {
    const valSplit = val.split('GS');
    return `gamesService.${valSplit[1]}`;
  } else {
    return val;
  }
}

export const handleChange = (e: any, state: any) => {
  const isSwitch = e.hasOwnProperty('value');
  const { value } = isSwitch ? e : e.target;
  const propPath = isSwitch ? e.target.id : e.target.getAttribute('attr-which');
  console.log('propPath', propPath);
  const pathExpanded = checkPathForPrefix(propPath);
  const copy = _cloneDeep(state);
  if (copy) {
    _set(copy, pathExpanded, value);
    console.log('copy', copy);
    return copy;
  }
  return null;
};

export const handleDropdownFn = (e: any, which: string, data: any) => {
  const copy = _cloneDeep(data);
  if (copy) {
    _set(copy, which, e.value);
  }
  return copy;
};
