import { RouteComponentProps } from '@reach/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PlatformsItem from './components/PlatformsItem/PlatformsItem';
import { NotificationContext } from './context/NotificationContext';
import { IConsole, PgameReturn, PlatExtraData, PlatformsPageItem } from './models/platforms.model';
import {
  getPlatforms,
  getPlatformExtras,
  getPlatformGameData
} from './services/platformsCrud.service';
import { sortBy as _sortBy } from 'lodash';
import { flatten as _flatten } from 'lodash';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import PlatformsSort from './components/PlatformsSort';
import { PlatformType } from './components/PlatformsSort/PlatformsSort';
import { consoleHandheldFilter } from './services/filters.service';

const Platforms: React.FC<RouteComponentProps> = () => {
  const [notify, setNotify] = useContext(NotificationContext);
  const [consolesData, setConsolesData] = useState<IConsole[]>([]);
  const [consolesExtras, setConsolesExtras] = useState<PlatExtraData[]>([]);
  const [pgameData, setPgameDdata] = useState<PgameReturn>({});
  const [consolesList, setConsolesList] = useState<PlatformsPageItem[] | null>(null);
  const [fullConsolesList, setFullConsolesList] = useState<PlatformsPageItem[] | null>(null);

  const getPlatformsArr = useCallback((): Promise<IConsole[]> => {
    return new Promise(async (resolve, reject) => {
      const platformsArr = await getPlatforms();
      if (platformsArr.error) {
        setNotify({
          severity: 'error',
          detail: 'Failed to fetch platforms data!',
          summary: 'ERROR'
        });
        reject(platformsArr.error);
      } else {
        // group by company and sort group by name
        const grouped = platformsArr.reduce((acc: any, con: IConsole) => {
          const company = con.company;
          if (company && acc[company]) {
            acc[company] = _sortBy([...acc[company], con], 'name');
          } else if (con.company) {
            acc[con.company] = [con];
          }
          return acc;
        }, {});
        const companyOrder = Object.keys(grouped).sort();
        const sorted = _flatten(
          companyOrder.map(company => {
            return grouped[company];
          })
        );
        // @ts-ignore
        setConsolesData(sorted);
        resolve(sorted);
      }
    });
  }, [setNotify]);

  const getExtrasData = useCallback((): Promise<PlatExtraData[]> => {
    return new Promise(async (resolve, reject) => {
      const platExtras = await getPlatformExtras();
      if (platExtras.error) {
        setNotify({
          severity: 'error',
          detail: 'Failed to fetch platform extras!',
          summary: 'ERROR'
        });
        reject(platExtras.error);
      } else {
        setConsolesExtras(platExtras);
        resolve(platExtras);
      }
    });
  }, [setNotify]);

  const getPgameData = useCallback((): Promise<PgameReturn> => {
    return new Promise(async (resolve, reject) => {
      const pgameData = await getPlatformGameData();
      if (pgameData.error) {
        setNotify({
          severity: 'error',
          detail: 'Failed to fetch platform games data!',
          summary: 'ERROR'
        });
        console.error(pgameData.error);
        reject(pgameData.error);
      } else {
        setPgameDdata(pgameData);
        resolve(pgameData);
      }
    });
  }, [setNotify]);

  const buildConsolesList = useCallback(
    (plats: IConsole[], xtra: PlatExtraData[], pgame: PgameReturn) => {
      if (!consolesList && plats?.length && xtra?.length && Object.keys(pgame).length) {
        const masterList = plats.map((con: IConsole) => {
          const conEx = xtra.filter(ce => ce.platformId === con.id);
          // @ts-ignore
          const thisPgame = pgame[con.id?.toString()];

          return { ...con, conEx, pgame: thisPgame };
        });
        setFullConsolesList(masterList);
        setConsolesList(masterList);
      }
    },
    [consolesList]
  );

  const filterByType = (platformType: PlatformType) => {
    console.log('platformType', platformType);
    console.log('fullConsolesList', fullConsolesList);
    if (fullConsolesList?.length) {
      const newFiltered = consoleHandheldFilter(fullConsolesList, platformType);
      setConsolesList(newFiltered);
    }
  };

  const getData = useCallback(async () => {
    if (!consolesList?.length) {
      const plats = await getPlatformsArr();
      const xtra = await getExtrasData();
      const pgame = await getPgameData();
      buildConsolesList(plats, xtra, pgame);
    }
  }, [getPgameData, getPlatformsArr, getExtrasData, buildConsolesList, consolesList]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className='platforms-wrapper'>
      <PlatformsSort
        onTypeChanged={filterByType}
        onSortChanged={(newData: PlatformsPageItem[]) => {
          console.log('newData', newData);
          setConsolesList(newData);
        }}
        consoles={consolesList || []}
      />
      {consolesList?.length &&
        consolesList.map((con: IConsole, index: number) => {
          if (con.ghostConsole) {
            return <></>;
          }
          const conEx = consolesExtras.filter(ce => ce.platformId === con.id);
          // @ts-ignore
          const thisPgame = pgameData[con.id?.toString()];
          return (
            <PlatformsItem
              platform={con}
              extra={conEx}
              pgame={thisPgame}
              key={`${con.name}${con.lastUpdated}${index}`}
            />
          );
        })}
      <ScrollToTop position='right' />
    </div>
  );
};

export default Platforms;
