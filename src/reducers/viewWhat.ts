export default function viewWhat(state = 'games', action: any): string {
  if (action.type === 'CHANGE_VIEWWHAT') {
    return action.payload;
  } else {
    return state;
  }
}
