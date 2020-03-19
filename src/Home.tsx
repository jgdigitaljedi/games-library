import React, {
  FunctionComponent,
  useCallback,
  Dispatch,
  SetStateAction,
  useState,
  useEffect
} from 'react';
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
  const [data, setData]: [IStats, Dispatch<SetStateAction<IStats>>] = useState({});
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

  const getData = useCallback(async () => {
    const result = await Axios.get('http://localhost:4001/api/stats');
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
            data={ChartService.returnSimpleDataSet(data.gamePerConsoleCounts, 'Games per platform')}
            options={{ ...chartOptions, ...extraChartOptions }}
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
            <h3>Highest Price Paird for Platforms</h3>
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
            options={{ ...chartOptions, ...extraChartOptions }}
            width="100%"
          />
        </div>
      )}
      {data && data.physicalVsDigitalGames && (
        <div className="chart-container" style={{ width: '50%' }}>
          <Chart
            type="pie"
            data={ChartService.returnSimpleDataSet(
              data.physicalVsDigitalGames,
              'Physical vs Digital Games',
              true
            )}
            options={chartOptions}
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
