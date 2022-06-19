import { IConsole } from '@/models/platforms.model';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { sortBy as _sortBy } from 'lodash';
import './PlatformsSort.scss';

interface PlatformsSortProps {
  consoles: IConsole[];
  onSortChanged: (consoles: IConsole[]) => void;
}

const PlatformsSort: React.FC<PlatformsSortProps> = ({ consoles, onSortChanged }) => {
  const [sortedConsoles, setSortedConsoles] = useState(consoles);
  const [currentSort, setCurrentSort] = useState('name');
  const [currentSortDir, setCurrentSortDir] = useState('ascending');
  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Company', value: 'company' },
    { label: 'Generation', value: 'generation' },
    { label: 'Release date', value: 'releaseDate.date' },
    { label: 'Date purchased', value: 'datePurchased' }
    // { label: 'Value', value: 'priceCharting.value' }
  ];
  const sortDirectionOptions = [
    { label: 'Ascending', value: 'ascending' },
    { label: 'Descending', value: 'descending' }
  ];

  const onDirChange = (e: any) => {
    const dir = e.value;
    setCurrentSortDir(dir);
    const sorted =
      dir === 'descending'
        ? _sortBy(sortedConsoles, currentSort).reverse()
        : _sortBy(sortedConsoles, currentSort);
    setSortedConsoles(sorted);
    onSortChanged(sorted);
  };

  const onSortChange = (e: any) => {
    setCurrentSort(e.value);
  };

  return (
    <Card className='platforms-sort card'>
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
