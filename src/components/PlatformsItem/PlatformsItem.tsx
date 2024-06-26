import { IConsole, PgameData, PlatExtraData } from '@/models/platforms.model';
import { getConsoleImage } from '@/services/assets.service';
import React, { useMemo } from 'react';
import './PlatformsItem.scss';

interface PlatformsItemProps {
  platform: IConsole;
  extra: PlatExtraData[];
  pgame?: PgameData;
}

const PlatformsItem: React.FC<PlatformsItemProps> = ({ platform, extra, pgame }) => {
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
  }, [extra]);

  const special = useMemo(() => {
    // @ts-ignore
    const spObj = extra?.find(e => e.dataSet === 'SP');
    if (spObj) {
      return { total: spObj.total, owned: spObj.owned, title: spObj.title };
    }
    return null;
  }, [extra]);

  const cib = useMemo(() => {
    // @ts-ignore
    const cibObj = extra?.find(e => e.dataSet === 'CIB');
    if (cibObj) {
      return { owned: cibObj.owned, title: cibObj.title };
    }
    return null;
  }, [extra]);

  const platImage = useMemo(() => {
    return getConsoleImage(platform);
  }, [platform]);

  return (
    <div className='platforms-item-wrapper'>
      <div className='platforms-item-section name-logo'>
        <h4>{platform.name}</h4>
        {platImage && (
          <div className='img-wrapper'>
            <img src={platImage} alt={`${platform.name} logo`} />
          </div>
        )}
        {platform.version?.name && <div className='version-wrapper'>{platform.version.name}</div>}
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
        <div className='platforms-item-section--sub top'>
          <label>CPU</label>
          <div>{platform.cpu || '??'}</div>
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
        <div className='platforms-item-section--sub top'>
          <label>Mods</label>
          <div>{platform.mods || 'NONE'}</div>
        </div>
        <div className='platforms-item-section--sub'>
          <label>Memory</label>
          <div>{platform.memory || '??'}</div>
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
        <div className='platforms-item-section--sub top'>
          <label>Storage capacity</label>
          <div>{platform.storage || 'NA'}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Notes</label>
          <div>{platform.notes || 'NA'}</div>
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
          <label>Launch titles</label>
          <div>{`${launchTitles.owned} of ${launchTitles.total}`}</div>
        </div>
        <div className='platforms-item-section--sub top'>
          <label>Exclusives</label>
          <div>{`${exclusives.owned} of ${exclusives.total}`}</div>
        </div>
        {greatestHits && (
          <div className='platforms-item-section--sub top'>
            <label>{greatestHits.title}</label>
            <div>{`${greatestHits.owned} of ${greatestHits.total}`}</div>
          </div>
        )}
        {special && (
          <div className='platforms-item-section--sub top'>
            <label>{special.title}</label>
            <div>{`${special.owned} of ${special.total}`}</div>
          </div>
        )}
        {cib && (
          <div className='platforms-item-section--sub'>
            <label>{cib.title}</label>
            <div>{cib.owned}</div>
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
