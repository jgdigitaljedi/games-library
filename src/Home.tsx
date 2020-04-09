import React, { FunctionComponent, useCallback, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import { IGame, IConsole } from './common.model';
import ListView from './components/ListView/ListView';
import { Chart } from 'primereact/chart';
import ChartService from './services/chartData.service';
import Colors from './style/colors';

interface INumIndex {
  [key: string]: number;
}

interface IDateRelated {
  dateFormatted: string;
  games: number;
}

interface ICatVal {
  category: string;
  value: number;
}

interface IStats {
  mostRecentlyAddedGames: IGame[];
  mostRecentlyAddedPlatforms: IConsole[];
  mostPaidForGames: IGame[];
  mostPaidForPlatforms: IConsole[];
  gamePerConsoleCounts: INumIndex;
  gamesPerEsrb: INumIndex;
  physicalVsDigitalGames: INumIndex;
  gamesAcquisition: INumIndex;
  cibGames: number;
  gamesWithGenre: INumIndex;
  gamesAddedInMonth: IDateRelated[];
  gamesAddedPerYear: IDateRelated[];
  igdbRatingsBreakdown: ICatVal;
  consolesByCompany: INumIndex;
  consolesByGenerationSorted: INumIndex;
}

const Home: FunctionComponent<RouteComponentProps> = () => {
  // @ts-ignore
  const [data, setData] = useState<IStats>({});
  const chartOptions = {
    responsive: true,
    responsiveAnimationDuration: 300,
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: Colors.lightKhaki
      }
    }
  };

  const extraChartOptions = ChartService.getExtraChartOptions();

  function addTitle(text: string) {
    return {
      title: {
        text,
        position: 'top',
        fontColor: Colors.white,
        display: true,
        fontSize: 16
      }
    };
  }

  const getData = useCallback(async () => {
    const result = await Axios.get('http://localhost:4001/api/vg/stats');
    if (result && result.data) {
      setData(result.data);
      console.log('result.data', result.data);
    }
  }, []);

  const itemClicked = useCallback(clicked => {
    console.log('clicked', clicked);
  }, []);

  useEffect(() => {
    getData();
    console.log('dasasd', {
      ...chartOptions,
      ...extraChartOptions,
      ...addTitle('Games per platform')
    });
    // eslint-disable-next-line
  }, [getData]);

  return (
    <div className="home">
      {/* {data && data.cibGames && (
        <div className="text-container">
          <h3>Complete in box games</h3>
          <div>{data.cibGames}</div>
        </div>
      )} */}
      <div className="home--row">
        {data && data.mostRecentlyAddedGames && (
          <div className="container-column">
            <h3>Most Recently Added Games</h3>
            <ListView
              data={data.mostRecentlyAddedGames}
              whichData="createdAt"
              listRowClick={itemClicked}
            />
          </div>
        )}
        {data && data.mostRecentlyAddedPlatforms && (
          <div className="container-column">
            <h3>Most Recently Added Consoles</h3>
            <ListView
              data={data.mostRecentlyAddedPlatforms}
              whichData="createdAt"
              listRowClick={itemClicked}
            />
          </div>
        )}
      </div>
      {data && data.gamePerConsoleCounts && (
        <div className="chart-container" style={{ width: '100%' }}>
          <Chart
            type="bar"
            data={ChartService.returnSimpleDataSet(data.gamePerConsoleCounts, 'Games')}
            options={{
              ...chartOptions,
              ...extraChartOptions,
              ...addTitle('Games per platform'),
              ...{ legend: { display: false } }
            }}
            width="100%"
          />
        </div>
      )}
      <div className="home--row">
        {data && data.mostPaidForGames && (
          <div className="container-column">
            <h3>Highest Price Paid for Games</h3>
            <ListView
              data={data.mostPaidForGames}
              whichData="pricePaid"
              listRowClick={itemClicked}
            />
          </div>
        )}
        {data && data.mostPaidForPlatforms && (
          <div className="container-column">
            <h3>Highest Price Paid for Platforms</h3>
            <ListView
              data={data.mostPaidForPlatforms}
              whichData="purchasePrice"
              listRowClick={itemClicked}
            />
          </div>
        )}
      </div>
      {data && data.gamesAcquisition && (
        <div className="chart-container" style={{ width: '100%' }}>
          <Chart
            type="bar"
            data={ChartService.returnSimpleDataSet(
              data.gamesAcquisition,
              'Games per Acquisition Type'
            )}
            options={{
              ...chartOptions,
              ...extraChartOptions,
              ...addTitle('Games per Acquisition Source'),
              ...{ legend: { display: false } }
            }}
            width="100%"
          />
        </div>
      )}
      <div className="home--row">
        {data && data.physicalVsDigitalGames && (
          <div className="chart-container" style={{ width: '50%' }}>
            <Chart
              type="pie"
              data={ChartService.returnSimpleDataSet(
                data.physicalVsDigitalGames,
                'Physical vs Digital Games',
                true
              )}
              options={{
                ...chartOptions,
                ...addTitle('Physical Copy vs Digital Download'),
                ...{ legend: { position: 'bottom', labels: { fontColor: Colors.white } } }
              }}
              width="100%"
            />
          </div>
        )}
        {data && data.gamesPerEsrb && (
          <div className="chart-container" style={{ width: '50%' }}>
            <Chart
              type="pie"
              data={ChartService.returnSimpleDataSet(
                data.gamesPerEsrb,
                'Games per ESRB rating',
                true
              )}
              options={{
                ...chartOptions,
                ...addTitle('Games per ESRB Rating'),
                ...{ legend: { position: 'bottom', labels: { fontColor: Colors.white } } }
              }}
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
