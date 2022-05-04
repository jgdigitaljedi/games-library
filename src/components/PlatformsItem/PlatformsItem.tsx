import { IConsole, PlatExtraData } from '@/models/platforms.model';
import React from 'react';
import './PlatformsItem.scss';

interface PlatformsItemProps {
  platform: IConsole;
  extra: PlatExtraData[];
}

const PlatformsItem: React.FC<PlatformsItemProps> = ({ platform, extra }) => {
  return (
    <div className='platforms-item-wrapper'>
      <div className='platforms-item-section'>
        <h4>{platform.name}</h4>
        {platform.logo && <img src={platform.logo} alt={`${platform.name} logo`} />}
      </div>
      <div className='platforms-item-section'>
        <div className='platforms-item-section--sub'>
          <label>Release date</label>
          <div>{platform.releaseDate?.date}</div>
        </div>
      </div>
    </div>
  );
};

export default PlatformsItem;
