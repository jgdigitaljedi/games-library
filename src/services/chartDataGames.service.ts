import { IGame } from '@/models/games.model';
import { IIndexedWithNum } from '@/models/common.model';
import { get as _get, sum as _sum } from 'lodash';
import sortsService from './sorts.service';

function getMonthYear(gameData: string): string {
  const dObj = new Date(gameData);
  return `${dObj.getMonth() + 1}/${dObj.getFullYear()}`;
}

function getYear(gameDate: string): number {
  return new Date(gameDate).getFullYear();
}

function priceToPriceGroup(price: number): string {
  if (price < 16) {
    return 'Cheap ($15 or less)';
  } else if (price < 40 && price > 15) {
    return 'Medium ($16 - $39)';
  } else if (price > 39 && price < 66) {
    return 'High ($40 - $65)';
  } else {
    return 'Very High ($66+)';
  }
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

export const getGameByReleaseYearData = ({
  data,
  which
}: {
  data: IGame[];
  which: string;
}): { labels: string[]; dataObj: any } => {
  const labels: string[] = [];
  const dataObj: IIndexedWithNum = {};
  data.forEach(d => {
    const gameData = _get(d, which);
    let dataFormatted;
    if (gameData) {
      dataFormatted = getYear(gameData).toString();
      if (dataFormatted) {
        if (labels.indexOf(dataFormatted) === -1) {
          labels.push(dataFormatted);
        }
        if (!dataObj.hasOwnProperty(dataFormatted)) {
          dataObj[dataFormatted] = 1;
        } else {
          dataObj[dataFormatted]++;
        }
      }
    }
  });

  return { labels, dataObj };
};

export const getGamesCollectionGrowthData = (data: IGame[]) => {
  const dataObjUnordered: IIndexedWithNum = {};
  const dataObjRaw: IIndexedWithNum = {};
  data.forEach(d => {
    const gameData = _get(d, 'datePurchased');
    let dataFormatted;
    if (gameData) {
      dataFormatted = getMonthYear(gameData).toString();
      if (dataFormatted) {
        if (!dataObjUnordered.hasOwnProperty(dataFormatted)) {
          dataObjUnordered[dataFormatted] = 1;
        } else {
          dataObjUnordered[dataFormatted]++;
        }
      }
    }
  });
  sortsService.sortDateWithSlash(Object.keys(dataObjUnordered)).forEach(d => {
    // @ts-ignore
    dataObjRaw[d] = parseInt(dataObjUnordered[d]);
  });
  const labels: string[] = [];
  const dataObj: IIndexedWithNum = {};
  Object.keys(dataObjRaw).forEach((d, index) => {
    labels.push(d);
    const valueArr = Object.values(dataObjRaw).slice(0, index);
    dataObj[d] = _sum(valueArr);
  });

  return { labels, dataObj };
};

export const getPriceGroups = (data: IGame[]) => {
  const labels: string[] = [
    'Cheap ($15 or less)',
    'Medium ($16 - $39)',
    'High ($40 - $65)',
    'Very High ($66+)'
  ];
  const dataObjUnordered: IIndexedWithNum = {
    'Cheap ($15 or less)': 0,
    'Medium ($16 - $39)': 0,
    'High ($40 - $65)': 0,
    'Very High ($66+)': 0
  };
  data.forEach(d => {
    const gameData = _get(d, 'pricePaid');
    let dataFormatted;
    if (gameData) {
      dataFormatted = priceToPriceGroup(
        typeof gameData === 'number' ? gameData : parseFloat(gameData)
      );
      if (dataFormatted) {
        if (!dataObjUnordered.hasOwnProperty(dataFormatted)) {
          dataObjUnordered[dataFormatted] = 1;
        } else {
          dataObjUnordered[dataFormatted]++;
        }
      }
    }
  });
  const dataObj: IIndexedWithNum = {};
  labels.forEach(label => {
    dataObj[label] = dataObjUnordered[label];
  });
  return { labels, dataObj };
};
