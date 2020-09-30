export default function platformsArr(state = [], action: any): object[] {
  if (action.type === 'CHANGE_PLATFORMSARR') {
    return action.payload;
  } else {
    return state;
  }
}
