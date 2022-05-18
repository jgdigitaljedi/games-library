import { IConsole, PgameData, PlatExtraData } from '@/models/platforms.model';
import React, { useMemo } from 'react';
import './PlatformsItem.scss';

interface PlatformsItemProps {
  platform: IConsole;
  extra: PlatExtraData[];
  pgame?: PgameData;
}

const PlatformsItem: React.FC<PlatformsItemProps> = ({ platform, extra, pgame }) => {
  console.log('platform', platform);
  console.log('extra', extra);
  console.log('pgame', pgame);

  const launchTitles = useMemo(() => {
    // @ts-ignore
    const ltObj = extra?.find(l => l.dataSet === 'LT');
    // @ts-ignore
    return { total: ltObj?.total || 0, owned: ltObj?.owned || 0 };
  }, [extra]);

  const exclusives = useMemo(() => {
    // @ts-ignore
    const exObj = extra?.find(e => e.dataSet === 'EX');
    // @ts-ignore
    return { total: exObj?.total || 0, owned: exObj?.owned || 0 };
  }, [extra]);

  const greatestHits = useMemo(() => {
    // @ts-ignore
    const ghObj = extra?.find(e => e.dataSet === 'GH');
    if (ghObj) {
      return { total: ghObj.total, owned: ghObj.owned, title: ghObj.title };
    }
    return null;
  }, []);

  return (
    <div className='platforms-item-wrapper'>
      <div className='platforms-item-section name-logo'>
        <h4>{platform.name}</h4>
        {platform.logo && <img src={platform.logo} alt={`${platform.name} logo`} />}
      </div>
      <div className='platforms-item-section'>
        <div className='platforms-item-section--sub top'>
          <label>Company</label>
          <div>{platform.company || '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Release date</label>
          <div>{platform.releaseDate?.date || '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Generation</label>
          <div>{platform.generation || '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Alternate name(s)</label>
          <div>{platform.alternative_name || '??'}</div>
        </div>
      </div>
      <div className='platforms-item-section'>
        <div className='platforms-item-section--sub top'>
          <label>Date purchased</label>
          <div>{platform.datePurchased || '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>How acquired</label>
          <div>{platform.howAcquired || '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Condition</label>
          <div>{platform.condition || '??'}</div>
        </div>
        <div className='platforms-item-section--sub'>
          <label>Mods</label>
          <div>{platform.mods || 'NONE'}</div>
        </div>
      </div>
      <div className='platforms-item-section'>
        <div className='platforms-item-section--sub top'>
          <label>Status</label>
          <div>{platform.priceCharting?.case || '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Price paid</label>
          <div>{platform.pricePaid ? `$${platform.pricePaid}` : '??'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Current value</label>
          <div>{platform.priceCharting?.price ? `$${platform.priceCharting?.price}` : '??'}</div>
        </div>
        <div className='platforms-item-section--sub'>
          <label>Storage capacity</label>
          <div>{platform.storage || 'NA'}</div>
        </div>
      </div>
      <div className='platforms-item-section bg games'>
        {pgame?.total && (
          <div className='platforms-item-section--sub top'>
            <label>Games owned</label>
            <div>{pgame.total}</div>
          </div>
        )}
        <div className='platforms-item-section--sub top'>
          <label>Launch titles owned</label>
          <div>{`${launchTitles.owned} of ${launchTitles.total}`}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Exclusives owned</label>
          <div>{`${exclusives.owned} of ${exclusives.total}`}</div>
        </div>
        {greatestHits && (
          <div className='platforms-item-section--sub'>
            <label>{greatestHits.title} owned</label>
            <div>{`${greatestHits.owned} of ${greatestHits.total}`}</div>
          </div>
        )}
      </div>
      {pgame && (
        <div className='platforms-item-section bg prices'>
          <div className='platforms-item-section--sub top'>
            <label>Total paid for games</label>
            <div>{`$${pgame.totalPaid}`}</div>
          </div>
          <div className='platforms-item-section--sub top'>
            <label>Highest paid for game</label>
            <div>
              {`${pgame.highestPaid?.name} `}
              <i>for</i>
              {` $${pgame.highestPaid?.pricePaid}`}
            </div>
          </div>
          <div className='platforms-item-section--sub top'>
            <label>Total value for games</label>
            <div>{`$${pgame.totalValue}`}</div>
          </div>
          <div className='platforms-item-section--sub top'>
            <label>Highest value game</label>
            <div>
              {`${pgame.highestValue?.name} `}
              <i>for</i> {`$${pgame.highestValue?.value}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformsItem;
