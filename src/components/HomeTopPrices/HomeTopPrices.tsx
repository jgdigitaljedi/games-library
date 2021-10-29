import React from 'react';
import './HomeTopPrices.scss';
import { CurrencyUtils } from 'stringman-utils';
import { sortBy as _sortBy } from 'lodash';
import HomeTopPricesTable from './HomeTopPricesTable/HomeTopPricesTable';

interface TopPriceProps {
  data: any;
  single?: boolean;
  noCounts?: boolean;
}

const HomeTopPrices: React.FC<TopPriceProps> = ({ data, single, noCounts }) => {
  const platformRowData = _sortBy(
    Object.keys(data || {})
      .filter(key => {
        return (
          key &&
          key !== 'totalSpent' &&
          key !== 'totalValue' &&
          key !== 'totalDiff' &&
          key !== 'totalCount' &&
          key !== 'averageValue'
        );
      })
      .map(key => {
        return {
          name: key,
          spent: data[key].spent,
          value: data[key].value,
          diff: data[key].diff,
          count: noCounts ? 0 : data[key].count
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
          {!single && <HomeTopPricesTable data={firstHalf} noCounts={noCounts || false} />}
          <HomeTopPricesTable
            data={secondHalf}
            totals={{
              spent: data?.totalSpent || 0,
              value: data?.totalValue || 0,
              diff: data?.totalDiff || 0,
              count: data?.totalCount || 0,
              avg: data?.averageValue || 0
            }}
            noCounts={noCounts || false}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default HomeTopPrices;
