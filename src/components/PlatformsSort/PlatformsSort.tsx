import { PlatformsPageItem } from '@/models/platforms.model';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import React, { useState } from 'react';
import { sortBy as _sortBy } from 'lodash';
import './PlatformsSort.scss';
import {
  appreciationConsolesSort,
  appreciationGamesSort,
  dateSortHyphen,
  dateSortSlash
} from '@/services/sorts.service';

interface PlatformsSortProps {
  consoles: PlatformsPageItem[];
  onSortChanged: (consoles: PlatformsPageItem[]) => void;
  onTypeChanged: (platformType: PlatformType) => void;
}

enum CurrentSortType {
  Name = 'name',
  Company = 'company',
  Generation = 'generation',
  'Release Date' = 'releaseDate.date',
  'Date Purchased' = 'datePurchased',
  Value = 'priceCharting.price',
  'Appreciation (games)' = 'appreciationGames',
  'Appreciation (consoles)' = 'appreciationConsoles'
}

enum SortDirectionType {
  Ascending = 'ascending',
  Descending = 'descending'
}

export enum PlatformType {
  All = 'all',
  Consoles = 'consoles',
  Handhelds = 'handhelds'
}

// TODO: add more filtering options
/** thoughts
 * - radio group for handhelds, consoles, and both
 * - more sorts in dropdown
 *   - categorize some of the extra data (greatest hits) and add ability to sort by most/least
 *   - appreciation
 */

const PlatformsSort: React.FC<PlatformsSortProps> = ({
  consoles,
  onSortChanged,
  onTypeChanged
}) => {
  const [currentSort, setCurrentSort] = useState<string>('name');
  const [currentSortDir, setCurrentSortDir] = useState<string>('ascending');
  const [currentPType, setCurrentPType] = useState<string>('all');
  const sortOptions = Object.keys(CurrentSortType).map((option: string) => {
    return { label: option, value: CurrentSortType[option as keyof typeof CurrentSortType] };
  });
  const sortDirectionOptions = Object.keys(SortDirectionType).map((option: string) => {
    return { label: option, value: SortDirectionType[option as keyof typeof SortDirectionType] };
  });
  const platformTypeOptions = Object.keys(PlatformType).map((option: string) => {
    return { label: option, value: PlatformType[option as keyof typeof PlatformType] };
  });

  const onPTypeChange = (e: any) => {
    console.log('e.value', e.value);
    if (e.value) {
      setCurrentPType(e.value);
      onTypeChanged(e.value);
    }
  };

  const onDirChange = (e: any) => {
    const dir = e.value;
    setCurrentSortDir(dir);
    if (currentSort === 'appreciationGames') {
      onSortChanged(appreciationGamesSort(consoles, dir));
    } else if (currentSort === 'appreciationConsoles') {
      onSortChanged(appreciationConsolesSort(consoles, dir));
    } else {
      const sorted =
        dir === 'descending'
          ? _sortBy(consoles, currentSort).reverse()
          : _sortBy(consoles, currentSort);
      onSortChanged(sorted);
    }
  };

  const onSortChange = (e: any) => {
    const sortProp = e.value as CurrentSortType;
    setCurrentSort(sortProp);
    if (sortProp === 'appreciationGames') {
      onSortChanged(appreciationGamesSort(consoles, currentSortDir));
    } else if (sortProp === 'appreciationConsoles') {
      onSortChanged(appreciationConsolesSort(consoles, currentSortDir));
    } else if (sortProp === 'datePurchased') {
      onSortChanged(dateSortHyphen(consoles, sortProp, currentSortDir));
    } else if (sortProp === 'releaseDate.date') {
      // @ts-ignore
      onSortChanged(dateSortSlash(consoles, sortProp, currentSortDir));
    } else {
      const sorted =
        currentSortDir === 'descending'
          ? _sortBy(consoles, sortProp).reverse()
          : _sortBy(consoles, sortProp);
      onSortChanged(sorted);
    }
  };

  return (
    <Card className='platforms-sort card'>
      <div className='platforms-sort--item-wrapper'>
        <label htmlFor='platform-type'>Platform Type</label>
        <SelectButton
          id='platform-type'
          options={platformTypeOptions}
          optionLabel='label'
          optionValue='value'
          value={currentPType}
          onChange={onPTypeChange}
        />
      </div>
      <div className='platforms-sort--item-wrapper'>
        <label htmlFor='sort-direction'>Sort direction</label>
        <Dropdown
          options={sortDirectionOptions}
          name='sort-direction'
          value={currentSortDir}
          onChange={onDirChange}
        />
      </div>
      <div className='platforms-sort--item-wrapper'>
        <label htmlFor='sort-options'>Sort by</label>
        <Dropdown
          options={sortOptions}
          name='sort-options'
          value={currentSort}
          onChange={onSortChange}
        />
      </div>
    </Card>
  );
};

export default PlatformsSort;
