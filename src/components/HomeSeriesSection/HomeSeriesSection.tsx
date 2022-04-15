import React, { useCallback, useEffect, useState } from 'react';
import HomeSeriesTable from './HomeSeriesTable';
import { chunk as _chunk } from 'lodash';

interface ExtraDataItem {
  owned: number;
  total: number | null;
  title: string;
}

export interface SeriesSectionProps {
  extraData: ExtraDataItem[] | undefined;
}

const HomeSeriesSection: React.FC<SeriesSectionProps> = ({ extraData }) => {
  const [formattedData, setFormattedData] = useState<ExtraDataItem[][]>();
  const [tableCount, setTableCount] = useState(0);

  const createTableData = useCallback(() => {
    if (extraData?.length) {
      const perTable = Math.ceil(extraData.length / tableCount);
      const chunks = _chunk(extraData, perTable);
      setFormattedData(chunks);
    }
  }, [tableCount, extraData]);

  const updateTableCount = useCallback(() => {
    const tables = Math.floor((window.innerWidth - 32) / 500);
    setTableCount(tables);
    createTableData();
  }, [createTableData]);

  useEffect(() => {
    updateTableCount();
    window.addEventListener('resize', updateTableCount);

    return function cleanup() {
      window.removeEventListener('resize', updateTableCount);
    };
  }, [extraData, updateTableCount]);
  return (
    <div className='home-prices' style={{ justifyContent: 'space-around' }}>
      {formattedData?.map((chunk: ExtraDataItem[], index: number) => (
        <HomeSeriesTable extraData={chunk} tableIndex={index} key={`table-chunk-${index}`} />
      ))}
    </div>
  );
};

export default HomeSeriesSection;
