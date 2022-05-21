import React from 'react';

const PlatformsSort = () => {
  const sortOptions = [
    { label: 'Generation', value: 'generation' },
    { label: 'Company', value: 'company' },
    { label: 'Release date', value: 'releaseDate.date' },
    { label: 'Date purchased', value: 'datePurchased' },
    { label: 'Value', value: 'priceCharting.value' }
  ];
  return <div className='platforms-sort card'></div>;
};

export default PlatformsSort;
