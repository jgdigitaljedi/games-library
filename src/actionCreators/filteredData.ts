export default function changeFilteredData(filteredData: object[]) {
  return { type: 'CHANGE_FILTEREDDATA', payload: filteredData };
}
