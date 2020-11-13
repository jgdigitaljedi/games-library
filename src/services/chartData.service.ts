import { IGame } from '../models/games.model';
import Colors from '../style/colors';
import { IDataTitlesIndex, IStats } from '../models/common.model';
import {
  getPriceOverTimeData,
  getGameByReleaseYearData,
  getGamesCollectionGrowthData,
  getPriceGroups
} from './chartDataGames.service';

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

const dataTitles: IDataTitlesIndex = {
  first_release_date: 'Game Release Date',
  datePurchased: 'Money Spent Over Time',
  numOfGamesTime: 'Games collection growth over time (only games with purchase date)',
  pricePaid: 'Games by price group'
};

function makeDataSets(which: string, dataObjFinal: any) {
  return [
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
  ];
}

export default {
  makeDataSet: (data: IGame[], which: string): IChartData => {
    let jointData;
    if (which === 'first_release_date') {
      jointData = getGameByReleaseYearData({ data, which });
    } else if (which === 'datePurchased') {
      jointData = getPriceOverTimeData(data);
    } else if (which === 'numOfGamesTime') {
      jointData = getGamesCollectionGrowthData(data);
    } else if (which === 'pricePaid') {
      jointData = getPriceGroups(data);
    } else {
      jointData = { labels: [], dataObj: {} };
    }
    const { labels, dataObj } = jointData;

    let labelsSorted;
    if (which === 'datePurchased' || which === 'numOfGamesTime' || which === 'pricePaid') {
      labelsSorted = labels;
    } else {
      labelsSorted = labels.sort();
    }
    const dataObjFinal = Object.keys(dataObj).map((key) => dataObj[key]);

    return {
      labels: labelsSorted,
      datasets: makeDataSets(which, dataObjFinal)
    };
  },
  makeDataSetForPlatforms: (data: IStats, which: string) => {
    if (which === 'platforms.company') {
      // jointData = getPlatformsByCompany(data);
      return {
        labels: Object.keys(data.consolesByCompany),
        datasets: {
          label: 'Consoles per Company',
          backgroundColor: Colors.lightOrange,
          data: Object.values(data.consolesByCompany) || [],
          pointBackgroundColor: Colors.lightBlue,
          lineTension: 0.6,
          borderColor: Colors.navSelected,
          borderWidth: 2,
          pointRadius: 4
        }
      };
    }

    return {
      labels: [],
      datasets: []
    };
  },
  returnSimpleDataSet: (data: any, title: string, bgColorArr?: boolean) => {
    const bgColor = bgColorArr
      ? [
          Colors.lightOrange,
          Colors.lightBlue,
          Colors.lightGreen,
          Colors.lightKhaki,
          Colors.accent,
          Colors.secondary,
          Colors.success,
          Colors.warn,
          Colors.error,
          Colors.extraLight
        ]
      : Colors.lightOrange;
    if (data && title) {
      return {
        labels: Object.keys(data),
        datasets: [
          {
            label: title || 'Stuff',
            backgroundColor: bgColor,
            data: Object.values(data) || [],
            pointBackgroundColor: Colors.lightBlue,
            lineTension: 0.6,
            borderColor: Colors.navSelected,
            borderWidth: 2,
            pointRadius: 4
          }
        ]
      };
    } else {
      return {};
    }
  },
  getExtraChartOptions: () => {
    return {
      legend: {
        labels: {
          fontColor: Colors.lightKhaki
        },
        position: 'bottom'
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: Colors.white,
              color: Colors.white
            },
            gridLines: {
              color: Colors.extraLight
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontColor: Colors.white,
              color: Colors.white
            }
          }
        ]
      }
    };
  }
};
