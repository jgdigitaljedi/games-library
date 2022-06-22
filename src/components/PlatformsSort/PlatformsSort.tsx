import { PlatformsPageItem } from '@/models/platforms.model';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { sortBy as _sortBy } from 'lodash';
import './PlatformsSort.scss';

interface PlatformsSortProps {
  consoles: PlatformsPageItem[];
  onSortChanged: (consoles: PlatformsPageItem[]) => void;
}

// TODO: add more filtering options
/** thoughts
 * - radio group for handhelds, consoles, and both
 * - more sorts in dropdown
 *   - categorize some of the extra data (greatest hits) and add ability to sort by most/least
 */

const PlatformsSort: React.FC<PlatformsSortProps> = ({ consoles, onSortChanged }) => {
  const [currentSort, setCurrentSort] = useState<string>('name');
  const [currentSortDir, setCurrentSortDir] = useState<string>('ascending');
  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Company', value: 'company' },
    { label: 'Generation', value: 'generation' },
    { label: 'Release date', value: 'releaseDate.date' },
    { label: 'Date purchased', value: 'datePurchased' },
    { label: 'Value', value: 'priceCharting.price' }
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
        ? _sortBy(consoles, currentSort).reverse()
        : _sortBy(consoles, currentSort);
    onSortChanged(sorted);
  };

  const onSortChange = (e: any) => {
    setCurrentSort(e.value);
    const sorted =
      currentSortDir === 'descending'
        ? _sortBy(consoles, e.value).reverse()
        : _sortBy(consoles, e.value);
    onSortChanged(sorted);
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
