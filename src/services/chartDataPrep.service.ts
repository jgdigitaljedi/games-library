import { IGame } from '../models/games.model';
import { IIndexedWithNum } from '../models/common.model';
import { get as _get } from 'lodash';
import sortsService from './sorts.service';

function getMonthYear(gameData: string): string {
  const dObj = new Date(gameData);
  return `${dObj.getMonth() + 1}/${dObj.getFullYear()}`;
}

export const getPriceOverTimeData = (data: IGame[]) => {
  let labels: string[] = [];
  const dataObjUnordered: IIndexedWithNum = {};
  data.forEach((game: IGame) => {
    const gameDate = _get(game, 'datePurchased');
    const gamePrice = _get(game, 'pricePaid');
    if (gameDate && gamePrice) {
      const monthYear = getMonthYear(gameDate);
      if (!dataObjUnordered.hasOwnProperty(monthYear)) {
        dataObjUnordered[monthYear] = parseFloat(gamePrice);
      } else {
        dataObjUnordered[monthYear] += parseFloat(gamePrice);
      }
    }
  });
  const dataObj: IIndexedWithNum = {};
  sortsService.sortDateWithSlash(Object.keys(dataObjUnordered)).forEach(d => {
    dataObj[d] = dataObjUnordered[d];
  });
  labels = Object.keys(dataObj);

  return { labels, dataObj };
};
