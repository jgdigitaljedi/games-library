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
import { IGame } from './common.model';
import { Dropdown } from 'primereact/dropdown';
import ChartDataService, { IChartData } from './services/chartData.service';
import { Chart } from 'primereact/chart';

const Viz: FunctionComponent<RouteComponentProps> = () => {
  const dataSets = [
    { label: 'Games by release date', value: 'igdb.first_release_date' },
    { label: 'Money spent on games over time', value: 'datePurchased' },
    { label: 'Growth of games collection over time', value: 'numOfGamesTime' },
    { label: 'Games by price group', value: 'pricePaid' }
  ];

  const chartTypes = [
    { label: 'bar', value: 'bar' },
    { label: 'line', value: 'line' }
  ];
  const [data, setData]: [IChartData, Dispatch<SetStateAction<IChartData>>] = useState({
    labels: [''],
    datasets: [{ label: '', backgroundColor: '', data: [0] }]
  });
  const [masterData, setMasterData]: [IGame[], Dispatch<SetStateAction<any>>] = useState([]);
  const [chartType, setChartType]: [string, Dispatch<SetStateAction<string>>] = useState(
    chartTypes[0].value
  );
  const [chartData, setChartData]: [string, Dispatch<SetStateAction<string>>] = useState(
    dataSets[0].value
  );

  const extraChartOptions = ChartDataService.getExtraChartOptions();

  const basicOptions = {
    responsive: true,
    responsiveAnimationDuration: 300,
    maintainAspectRatio: false
  };

  const chartOptions = { ...basicOptions, ...extraChartOptions };

  const getData = useCallback(
    async (ed?: boolean) => {
      const result = await Axios.post('http://localhost:4001/api/gamescombined', {
        everDrive: ed
      });
      if (result && result.data) {
        setData(result.data);
        setMasterData(result.data);
      }
    },
    [setData, setMasterData]
  );

  const getChartData = useCallback(() => {
    setData(ChartDataService.makeDataSet(masterData, chartData));
  }, [chartData, masterData]);

  useEffect(() => {
    if (!masterData || !masterData.length) {
      getData(false);
    }
    getChartData();
  }, [getData, masterData, getChartData]);

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
