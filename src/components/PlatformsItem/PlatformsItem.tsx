import { IConsole, PgameData, PlatExtraData } from '@/models/platforms.model';
import React from 'react';
import './PlatformsItem.scss';

interface PlatformsItemProps {
  platform: IConsole;
  extra: PlatExtraData[];
  pgame?: PgameData;
}

const PlatformsItem: React.FC<PlatformsItemProps> = ({ platform, extra }) => {
  console.log('platform', platform);
  console.log('extra', extra);
  return (
    <div className='platforms-item-wrapper'>
      <div className='platforms-item-section'>
        <h4>{platform.name}</h4>
        {platform.logo && <img src={platform.logo} alt={`${platform.name} logo`} />}
      </div>
      <div className='platforms-item-section'>
        <div className='platforms-item-section--sub top'>
          <label>Release date</label>
          <div>{platform.releaseDate?.date || '??'}</div>
        </div>
        <div className='platforms-item-section--sub'>
          <label>Generation</label>
          <div>{platform.generation}</div>
        </div>
      </div>
      <div className='platforms-item-section'>
        <div className='platforms-item-section--sub top'>
          <label>Date purchased</label>
          <div>{platform.datePurchased || '??'}</div>
        </div>
        <div className='platforms-item-section--sub'>
          <label>How acquired</label>
          <div>{platform.howAcquired}</div>
        </div>
      </div>
    </div>
  );
};

export default PlatformsItem;
