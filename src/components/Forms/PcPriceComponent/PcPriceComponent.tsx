import {
  IItemCommonFormat,
  IPriceChartingData,
  PricechartingGameSearchResponse
} from '@/models/pricecharting.model';
import { formatPcResult, pricechartingNameSearch } from '@/services/pricecharting.service';
import { AutoComplete, AutoCompleteSelectParams } from 'primereact/autocomplete';
import React, { useCallback, useEffect, useState } from 'react';

interface IPcPriceComponentProps {
  item: IItemCommonFormat;
  onSelectionMade: (arg: IPriceChartingData) => any;
}

const PcPriceComponent: React.FC<IPcPriceComponentProps> = ({ item, onSelectionMade }) => {
  const [pcQueryResult, setPcQueryResult] = useState<PricechartingGameSearchResponse[]>([]);
  const [value, setValue] = useState(item?.name);

  const getPcDataOptions = useCallback(
    async e => {
      setValue(e?.query || '');
      const pcResult = await pricechartingNameSearch(value);
      console.log('pcResult', pcResult);
      setPcQueryResult(pcResult.data || []);
    },
    [value]
  );

  const formatSelectionCb = async (sel: AutoCompleteSelectParams) => {
    setValue(sel.value.productConsoleCombined);
    const formatted = formatPcResult(sel.value, item, item.type);
    onSelectionMade(formatted);
  };

  useEffect(() => {
    setValue(item?.priceCharting?.name || item.name || '');
  }, [item]);

  return (
    <AutoComplete
      dropdown
      className='pcprice-autocomplete'
      delay={600}
      id='pcprice'
      value={value}
      field='productConsoleCombined'
      onSelect={formatSelectionCb}
      attr-which='pcprice'
      suggestions={pcQueryResult || []}
      completeMethod={getPcDataOptions}
    />
  );
};

export default PcPriceComponent;
