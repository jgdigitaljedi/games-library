import { IGame } from '../common.model';
import { get as _get } from 'lodash';
import Colors from '../style/colors';

interface IDataSets {
  label: string;
  backgroundColor: string;
  data: number[];
}

export interface IChartData {
  labels: any[];
  datasets: IDataSets[];
}

interface IDataTitlesIndex {
  [key: string]: string;
}

function getYear(gameDate: string) {
  return new Date(gameDate).getFullYear();
}

const dataTitles: IDataTitlesIndex = {
  'igdb.first_release_date': 'Game Release Date'
};

export default {
  makeDataSet: (data: IGame[], which: string): IChartData => {
    let labels: string[] = [],
      dataObj = {};
    data.forEach(d => {
      const gameData = _get(d, which);
      let dataFormatted;
      if (gameData) {
        if (which === 'igdb.first_release_date') {
          dataFormatted = getYear(gameData).toString();
        }
        if (dataFormatted) {
          if (labels.indexOf(dataFormatted) === -1) {
            labels.push(dataFormatted);
          }
          if (!dataObj.hasOwnProperty(dataFormatted)) {
            // @ts-ignore
            dataObj[dataFormatted] = 1;
          } else {
            // @ts-ignore
            dataObj[dataFormatted]++;
          }
        }
      }
    });
    console.log('labels', labels);
    console.log('dataObj', dataObj);

    const labelsSorted = labels.sort();
    // @ts-ignore
    const dataObjFinal = Object.keys(dataObj).map(key => dataObj[key]);

    return {
      labels: labelsSorted,
      datasets: [
        {
          label: dataTitles[which] || 'Stuff',
          backgroundColor: Colors.lightOrange,
          data: dataObjFinal
        }
      ]
    };
  }
};
