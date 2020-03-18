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

  const getData = useCallback(async () => {
    const result = await Axios.get('http://localhost:4001/api/stats');
    if (result && result.data) {
      setData(result.data);
      console.log('result.data', result.data);
    }
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return <section className="home">Home view</section>;
};

export default Home;
