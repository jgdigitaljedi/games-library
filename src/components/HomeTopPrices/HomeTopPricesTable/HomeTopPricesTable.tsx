import React from 'react';
import '../HomeTopPrices.scss';
import { CurrencyUtils } from 'stringman-utils';

interface HomeTopTableProps {
  data: any;
  totals?: {
    value: number;
    spent: number;
    diff: number;
    count: number;
    avg: number;
  };
  noCounts?: boolean;
}

const HomeTopPricesTable: React.FC<HomeTopTableProps> = ({ data, totals, noCounts }) => {
  const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');

  return (
    <table className='home-prices--table'>
      <thead>
        <tr>
          <th>Platform</th>
          <th>Spent</th>
          <th>Value</th>
          <th>Diff</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => {
          return (
            <tr>
              <td>{row.name}</td>
              <td>{currencyUtils.formatCurrencyDisplay(row.spent)}</td>
              <td>{currencyUtils.formatCurrencyDisplay(row.value)}</td>
              <td className={row?.diff > 0 ? 'positive' : 'negative'}>
                {currencyUtils.formatCurrencyDisplay(row.diff)}
              </td>
              <td>{noCounts ? 1 : row.count}</td>
            </tr>
          );
        })}
      </tbody>
      {totals && (
        <tfoot>
          <tr>
            <td>Totals</td>
            <td>{currencyUtils.formatCurrencyDisplay(totals?.spent || 0)}</td>
            <td>{currencyUtils.formatCurrencyDisplay(totals?.value || 0)}</td>
            <td className={totals?.diff > 0 ? 'positive' : 'negative'}>
              {currencyUtils.formatCurrencyDisplay(totals?.diff || 0)}
            </td>
            <td>{totals.count}</td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default HomeTopPricesTable;
