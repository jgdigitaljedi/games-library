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
import { uniqBy as _uniqBy } from 'lodash';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

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
      const uniqCons = _uniqBy(platformsArr, 'id');
      // @ts-ignore
      setConsolesData(uniqCons);
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
