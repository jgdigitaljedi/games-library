import React, { FunctionComponent, useCallback, useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import ListView from './components/ListView/ListView';
import { Chart } from 'primereact/chart';
import ChartService from './services/chartData.service';
import Colors from './style/colors';
import HomeTopTables from './components/HomeTopTables/HomeTopTables';
import { IStats } from './models/common.model';
import { NotificationContext } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const Home: FunctionComponent<RouteComponentProps> = () => {
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
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
    const result = await Axios.get(`${window.urlPrefix}/api/vg/stats`);
    if (result && result.data) {
      setData(result.data);
    } else {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch stats!',
        summary: 'ERROR'
      });
    }
  }, [setNotify]);

  const itemClicked = useCallback((clicked) => {
    console.log('clicked', clicked);
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [getData]);

  return (
    <div className="home">
      {data && data.physicalVsDigitalGames && (
        <HomeTopTables
          cibGames={data.cibGames}
          totalGames={data.totalGames}
          totalPlatforms={data.totalPlatforms}
          totalAccessories={data.totalAccessories}
          totalClones={data.totalClones}
          consolesByGenerationSorted={data.consolesByGenerationSorted}
          physicalVsDigitalGames={data.physicalVsDigitalGames}
          gamesByDecade={data.gamesByDecade}
          consolesByCompany={data.consolesByCompany}
          gamesAddedPerYear={data.gamesAddedPerYear}
        />
      )}
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
              height="500px"
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
              height="500px"
            />
          </div>
        )}
      </div>
      <ScrollToTop position="right" />
    </div>
  );
};

export default Home;
