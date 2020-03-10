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
import ChartDataService from './services/chartData.service';
import { Chart } from 'primereact/chart';

const Viz: FunctionComponent<RouteComponentProps> = () => {
  const dataSets = [
    { label: 'Games by release date', value: 'gamesReleaseDate' },
    { label: 'Money spent on games over time', value: 'moneyOnGames' },
    { label: 'Growth of games collection over time', value: 'numOfGamesTime' }
  ];

  const chartTypes = [
    { label: 'bar', value: 'bar' },
    { label: 'line', value: 'line' }
  ];
  const [data, setData]: [IGame[], Dispatch<SetStateAction<any>>] = useState([]);
  const [masterData, setMasterData]: [IGame[], Dispatch<SetStateAction<any>>] = useState([]);
  const [chartType, setChartType]: [string, Dispatch<SetStateAction<string>>] = useState(
    chartTypes[0].value
  );
  const [chartData, setChartData]: [string, Dispatch<SetStateAction<string>>] = useState(
    dataSets[0].value
  );

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

  const getchartData = useCallback(() => {
    setData(ChartDataService.makeDataSet(masterData, chartData));
  }, [chartData, masterData]);

  useEffect(() => {
    if (!masterData || !masterData.length) {
      getData(false);
    }
  }, [getData, masterData]);

  return (
    <div className="viz">
      <div className="viz-header">
        <div className="viz-header--group">
          <label>Select a data set:</label>
          <Dropdown
            value={chartData}
            onChange={e => {
              setChartData(e.value);
              getchartData();
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
            }}
            options={chartTypes}
          />
        </div>
      </div>
      <div className="viz-chart-container">
        {data && data.length && <Chart type={chartType} data={data} />}
      </div>
    </div>
  );
};

export default Viz;
