export default function changeViewWhat(viewWhat: string) {
  console.log('viewWhat', viewWhat);
  return { type: 'CHANGE_VIEWWHAT', payload: viewWhat };
}
