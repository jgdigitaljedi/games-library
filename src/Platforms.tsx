import { RouteComponentProps } from '@reach/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PlatformsItem from './components/PlatformsItem/PlatformsItem';
import { NotificationContext } from './context/NotificationContext';
import { IConsole } from './models/platforms.model';
import { getPlatforms, getPlatformExtras } from './services/platformsCrud.service';
import { uniqBy as _uniqBy } from 'lodash';

const Platforms: React.FC<RouteComponentProps> = () => {
  const [notify, setNotify] = useContext(NotificationContext);
  const [consolesData, setConsolesData] = useState<IConsole[]>([]);
  const [consolesExtras, setConsolesExtras] = useState<any[]>([]);

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

  useEffect(() => {
    getPlatformsArr();
    getExtrasData();
  }, [getPlatformsArr, getExtrasData]);

  return (
    <div className='platforms-wrapper'>
      <h3>Platforms</h3>
      {consolesData?.length > 0 &&
        consolesExtras?.length > 0 &&
        consolesData.map((con: IConsole) => {
          if (con.ghostConsole) {
            return <></>;
          }
          const conEx = consolesExtras.filter(ce => ce.platformId === con.id);
          return <PlatformsItem platform={con} extra={conEx} />;
        })}
    </div>
  );
};

export default Platforms;
