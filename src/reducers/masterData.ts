export default function masterData(state = [{}], action: any): object[] {
  if (action.type === 'CHANGE_MASTERDATA') {
    return action.payload;
  } else {
    return state;
  }
}
