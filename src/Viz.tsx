import React, { FunctionComponent, useCallback, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import { IConsoleArr } from './models/platforms.model';
import { IGame } from './models/games.model';
import { Dropdown } from 'primereact/dropdown';
import ChartDataService, { IChartData } from './services/chartData.service';
import { Chart } from 'primereact/chart';
import { IStats } from './Home';
import { getPlatformData } from './services/globalData.service';

const Viz: FunctionComponent<RouteComponentProps> = () => {
  const dataSets = [
    { label: 'Games by release date', value: 'igdb.first_release_date' },
    { label: 'Money spent on games over time', value: 'datePurchased' },
    { label: 'Growth of games collection over time', value: 'numOfGamesTime' },
    { label: 'Games by price group', value: 'pricePaid' },
    { label: 'Games per Platform', value: 'gpp' },
    { label: 'Games per Acquisition Type', value: 'gat' },
    { label: 'Games per ESRB Rating', value: 'esrb' },
    { label: 'Consoles by Company', value: 'cbc' }
  ];

  const chartTypes = [
    { label: 'bar', value: 'bar' },
    { label: 'line', value: 'line' }
  ];
  const [data, setData] = useState<IChartData>({
    labels: [''],
    datasets: [{ label: '', backgroundColor: '', data: [0] }]
  });
  const [stats, setStats] = useState<IStats>();
  const [platforms, setPlatforms] = useState<IConsoleArr>();
  const [masterData, setMasterData] = useState<IGame[]>([]);
  const [chartType, setChartType] = useState<string>(chartTypes[0].value);
  const [chartData, setChartData] = useState<string>(dataSets[0].value);

  const extraChartOptions = ChartDataService.getExtraChartOptions();

  const basicOptions = {
    responsive: true,
    responsiveAnimationDuration: 300,
    maintainAspectRatio: false
  };

  const chartOptions = { ...basicOptions, ...extraChartOptions };

  const getData = useCallback(
    async (ed?: boolean) => {
      const result = await Axios.post(`${window.urlPrefix}/api/vg/gamescombined`, {
        everDrive: ed
      });
      if (result && result.data) {
        setData(result.data);
        setMasterData(result.data);
      }
    },
    [setData, setMasterData]
  );

  const getStats = useCallback(async () => {
    const result = await Axios.get(`${window.urlPrefix}/api/vg/stats`);
    if (result && result.data) {
      setStats(result.data);
    }
  }, []);

  const getPlatformsWithData = useCallback(async () => {
    const result = await getPlatformData();
    if (result?.data) {
      setPlatforms(result.data);
    }
  }, []);

  const getChartData = useCallback(async () => {
    if (chartData === 'gpp' && stats) {
      setData(
        ChartDataService.returnSimpleDataSet(stats.gamePerConsoleCounts, 'Games') as IChartData
      );
    } else if (chartData === 'gat' && stats) {
      setData(
        ChartDataService.returnSimpleDataSet(
          stats.gamesAcquisition,
          'Games per Acquisition Type'
        ) as IChartData
      );
    } else if (chartData === 'esrb' && stats) {
      setData(
        ChartDataService.returnSimpleDataSet(
          stats.gamesPerEsrb,
          'Games per ESRB rating',
          true
        ) as IChartData
      );
    } else if (chartData === 'cbc') {
      // setData(ChartDataService.)
    } else {
      setData(ChartDataService.makeDataSet(masterData, chartData));
    }
    // eslint-disable-next-line
  }, [chartData, masterData]);

  useEffect(() => {
    if (!masterData || !masterData.length) {
      getData(false);
    }
    getChartData();
    getStats();
    getPlatformsWithData();
  }, [getData, masterData, getChartData, getStats, getPlatformsWithData]);

  return (
    <div className="viz">
      <div className="viz-header">
        <div className="viz-header--group">
          <label>Select a data set:</label>
          <Dropdown
            value={chartData}
            onChange={e => {
              setChartData(e.value);
              getChartData();
            }}
            options={dataSets}
          />
        </div>
        <div className="viz-header--group">
          <label>Select a chart type:</label>
          <Dropdown
            value={chartType}
            onChange={e => {
              setChartType(e.value);
              getChartData();
            }}
            options={chartTypes}
          />
        </div>
      </div>
      <div className="viz-chart--container">
        {data && data.datasets?.length && data.datasets[0].data?.length && (
          <Chart type={chartType} data={data} options={chartOptions} width="100%" />
        )}
      </div>
    </div>
  );
};

export default Viz;
