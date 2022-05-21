import { RouteComponentProps } from '@reach/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PlatformsItem from './components/PlatformsItem/PlatformsItem';
import { NotificationContext } from './context/NotificationContext';
import { IConsole, PgameReturn } from './models/platforms.model';
import {
  getPlatforms,
  getPlatformExtras,
  getPlatformGameData
} from './services/platformsCrud.service';
import { sortBy as _sortBy } from 'lodash';
import { flatten as _flatten } from 'lodash';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import PlatformsSort from './components/PlatformsSort';

const Platforms: React.FC<RouteComponentProps> = () => {
  const [notify, setNotify] = useContext(NotificationContext);
  const [consolesData, setConsolesData] = useState<IConsole[]>([]);
  const [consolesExtras, setConsolesExtras] = useState<any[]>([]);
  const [pgameData, setPgameDdata] = useState<PgameReturn>({});

  const getPlatformsArr = useCallback(async (): Promise<void> => {
    const platformsArr = await getPlatforms();
    if (platformsArr.error) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch platforms data!',
        summary: 'ERROR'
      });
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
    }
  }, [setNotify]);

  const getExtrasData = useCallback(async (): Promise<void> => {
    const platExtras = await getPlatformExtras();
    if (platExtras.error) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch platform extras!',
        summary: 'ERROR'
      });
    } else {
      setConsolesExtras(platExtras);
    }
  }, [setNotify]);

  const getPgameData = useCallback(async (): Promise<void> => {
    const pgameData = await getPlatformGameData();
    if (pgameData.error) {
      setNotify({
        severity: 'error',
        detail: 'Failed to fetch platform games data!',
        summary: 'ERROR'
      });
      console.error(pgameData.error);
    } else {
      setPgameDdata(pgameData);
    }
  }, [setNotify]);

  useEffect(() => {
    getPlatformsArr();
    getExtrasData();
    getPgameData();
  }, [getPlatformsArr, getExtrasData, getPgameData]);

  return (
    <div className='platforms-wrapper'>
      <PlatformsSort />
      {consolesData?.length > 0 &&
        consolesExtras?.length > 0 &&
        consolesData.map((con: IConsole) => {
          if (con.ghostConsole) {
            return <></>;
          }
          const conEx = consolesExtras.filter(ce => ce.platformId === con.id);
          // @ts-ignore
          const thisPgame = pgameData[con.id?.toString()];
          return <PlatformsItem platform={con} extra={conEx} pgame={thisPgame} />;
        })}
      <ScrollToTop position='right' />
    </div>
  );
};

export default Platforms;
