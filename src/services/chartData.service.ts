import { IGame } from '../common.model';
import { get as _get, sum as _sum } from 'lodash';
import Colors from '../style/colors';
import SortService from './sorts.service';

interface IDataSets {
  label: string;
  backgroundColor: string;
  data: number[];
  pointBackgroundColor?: string;
  lineTension?: number;
  borderColor?: string;
  borderWidth?: number;
  hoverBackgroundColor?: string;
  pointRadius?: number;
}

export interface IChartData {
  labels: any[];
  datasets: IDataSets[];
}

interface IDataTitlesIndex {
  [key: string]: string;
}

interface IIndexedWithNum {
  [key: string]: number;
}

function getYear(gameDate: string): number {
  return new Date(gameDate).getFullYear();
}

function getMonthYear(gameData: string): string {
  const dObj = new Date(gameData);
  return `${dObj.getMonth() + 1}/${dObj.getFullYear()}`;
}

const dataTitles: IDataTitlesIndex = {
  'igdb.first_release_date': 'Game Release Date',
  datePurchased: 'Money Spent Over Time',
  numOfGamesTime: 'Games collection growth over time (only games with purchase date)'
};

function getPriceOverTimeData(data: IGame[]) {
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
  SortService.sortDateWithSlash(Object.keys(dataObjUnordered)).forEach(d => {
    dataObj[d] = dataObjUnordered[d];
  });
  labels = Object.keys(dataObj);

  return { labels, dataObj };
}

function getGameByReleaseYearData({
  data,
  which
}: {
  data: IGame[];
  which: string;
}): { labels: string[]; dataObj: any } {
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
}

function getGamesCollectionGrowthData(data: IGame[]) {
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
  SortService.sortDateWithSlash(Object.keys(dataObjUnordered)).forEach(d => {
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
}

export default {
  makeDataSet: (data: IGame[], which: string): IChartData => {
    let jointData;
    if (which === 'igdb.first_release_date') {
      jointData = getGameByReleaseYearData({ data, which });
    } else if (which === 'datePurchased') {
      jointData = getPriceOverTimeData(data);
    } else if (which === 'numOfGamesTime') {
      jointData = getGamesCollectionGrowthData(data);
    } else {
      jointData = { labels: [], dataObj: {} };
    }
    const { labels, dataObj } = jointData;

    let labelsSorted;
    if (which === 'datePurchased' || which === 'numOfGamesTime') {
      labelsSorted = labels;
    } else {
      labelsSorted = labels.sort();
    }
    const dataObjFinal = Object.keys(dataObj).map(key => dataObj[key]);

    return {
      labels: labelsSorted,
      datasets: [
        {
          label: dataTitles[which] || 'Stuff',
          backgroundColor: Colors.lightOrange,
          data: dataObjFinal,
          pointBackgroundColor: Colors.lightBlue,
          lineTension: 0.6,
          borderColor: Colors.navSelected,
          borderWidth: 2,
          pointRadius: 4
        }
      ]
    };
  }
};
