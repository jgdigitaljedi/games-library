import React from 'react';
import './HomeTopPrices.scss';
import { CurrencyUtils } from 'stringman-utils';
import { sortBy as _sortBy } from 'lodash';
import HomeTopPricesTable from './HomeTopPricesTable/HomeTopPricesTable';

interface TopPriceProps {
  data: any;
  single?: boolean;
}

const HomeTopPrices: React.FC<TopPriceProps> = ({ data, single }) => {
  const platformRowData = _sortBy(
    Object.keys(data || {})
      .filter(key => {
        return key && key !== 'totalSpent' && key !== 'totalValue' && key !== 'totalDiff';
      })
      .map(key => {
        return {
          name: key,
          spent: data[key].spent,
          value: data[key].value,
          diff: data[key].diff
        };
      }),
    'name'
  );
  const middle = Math.round(platformRowData.length / 2);
  const firstHalf = platformRowData.slice(0, middle);
  const secondHalf = single ? platformRowData : platformRowData.slice(middle);
  return (
    <div className='home-prices'>
      {data && (
        <React.Fragment>
          {!single && <HomeTopPricesTable data={firstHalf} />}
          <HomeTopPricesTable
            data={secondHalf}
            totals={{
              spent: data?.totalSpent || 0,
              value: data?.totalValue || 0,
              diff: data?.totalDiff || 0
            }}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default HomeTopPrices;
