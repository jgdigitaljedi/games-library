export default function changeMasterData(masterData: object[]) {
  return { type: 'CHANGE_MASTERDATA', payload: masterData };
}
