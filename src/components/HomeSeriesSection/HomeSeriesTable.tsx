import React from 'react';
import { SeriesSectionProps } from './HomeSeriesSection';

interface SeriesTableProps extends SeriesSectionProps {
  tableIndex: number;
}

const HomeSeriesTable: React.FC<SeriesTableProps> = ({ extraData, tableIndex }) => {
  const getPercent = (value: number, total?: number): string => {
    if (total) {
      return ((value / total) * 100).toFixed(2);
    }
    return '--';
  };

  if (extraData?.length) {
    return (
      <table className='home-prices--table'>
        <thead>
          <tr>
            <th>Series</th>
            <th>Owned</th>
            <th>Total</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {extraData?.length > 0 &&
            extraData.map((item: any) => {
              return (
                <tr key={`${item.title.replace(' ', '-')}-${tableIndex}`}>
                  <td>{item.title}</td>
                  <td>{item.owned}</td>
                  <td>{item.total || '--'}</td>
                  <td>{getPercent(item.owned, item.total)}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  } else {
    return <></>;
  }
};

export default HomeSeriesTable;
