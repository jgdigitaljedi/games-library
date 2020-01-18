export default function filteredData(state = [{}], action: any): object[] {
  if (action.type === 'CHANGE_FILTEREDDATA') {
    return action.payload;
  } else {
    return state;
  }
}
