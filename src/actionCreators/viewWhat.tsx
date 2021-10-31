import { ViewWhatType } from '@/models/common.model';

export default function changeViewWhat(viewWhat: ViewWhatType) {
  return { type: 'CHANGE_VIEWWHAT', payload: viewWhat };
}
