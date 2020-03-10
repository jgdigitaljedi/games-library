import { IGame } from '../common.model';
import { get as _get } from 'lodash';

interface IDataSets {
  label: string;
  backgroundColor: string;
  data: number[];
}

export interface IChartData {
  labels: string[];
  datasets: IDataSets[];
}

export default {
  makeDataSet: (data: IGame[], which: string): IChartData => {
    console.log('data', data);
    console.log('which', which);
    let labels: string[] = [],
      dataObj = {};
    data.forEach(d => {
      const gameData = _get(d, which).toString();
      // gonna have to setup the dataSets array in viz to have more data, like what part of the date to use for the labels, etc
      if (labels.indexOf(gameData) === -1) {
        labels.push(gameData);
      }
      if (!dataObj.hasOwnProperty(gameData)) {
        // @ts-ignore
        dataObj[gameData] = 1;
      } else {
        // @ts-ignore
        dataObj[gameData]++;
      }
    });

    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: '#9CCC65',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
  }
};

/*
{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#9CCC65',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }
        */
