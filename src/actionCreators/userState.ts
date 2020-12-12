export default function changeUserState(state: boolean) {
    return { type: 'CHANGE_USERSTATE', payload: state };
}