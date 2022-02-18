import React, { useCallback, useEffect, useState } from 'react';
import { IPriceChartingData } from '@/models/pricecharting.model';
import { InputText } from 'primereact/inputtext';
import { CurrencyUtils } from 'stringman-utils';
import { Dropdown } from 'primereact/dropdown';

type CaseSelection = 'loose' | 'loose+' | 'cib' | 'sealed';

interface IPcPriceComponentProps {
  pcData: IPriceChartingData;
  caseChangeCb: (value: CaseSelection) => void;
  hasManual?: boolean;
}

const PcPriceDetailsComponent: React.FC<IPcPriceComponentProps> = ({
  pcData,
  caseChangeCb,
  hasManual
}) => {
  const [caseSelected, setCaseSelected] = useState<CaseSelection>(pcData?.case || 'loose');
  const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');
  const caseOptions = [
    { label: 'loose', value: 'loose' },
    { label: 'loose+', value: 'loose+' },
    { label: 'cib', value: 'cib' },
    { label: 'sealed', value: 'sealed' }
  ];

  const caseSelectionMade = useCallback(
    (value: CaseSelection) => {
      setCaseSelected(value);
      caseChangeCb(value);
    },
    [caseChangeCb]
  );

  useEffect(() => {
    if (caseSelected === 'loose' && hasManual) {
      setCaseSelected('loose+');
    }
  }, [pcData]);

  return (
    <React.Fragment>
      <div className='crud-form--form__row'>
        <label htmlFor='pcPrice'>PC Price</label>
        <InputText
          id='pcPrice'
          value={currencyUtils.formatCurrencyDisplay(pcData?.price)}
          attr-which='pcPrice'
          readOnly
        />
      </div>
      <div className='crud-form--form__row'>
        <label htmlFor='pcUpdated'>PC Data Updated</label>
        <InputText id='pcUpdated' value={pcData.lastUpdated} attr-which='pcUpdated' readOnly />
      </div>
      <div className='crud-form--form__row'>
        <label htmlFor='pcName'>PC Name</label>
        <InputText id='pcName' value={pcData?.name} attr-which='pcName' readOnly />
      </div>
      <div className='crud-form--form__row'>
        <label htmlFor='pcCase'>PC Case/Box</label>
        {/* <InputText id='pcCase' value={pcData?.case} attr-which='pcCase' /> */}
        <Dropdown
          value={caseSelected}
          options={caseOptions}
          onChange={e => caseSelectionMade(e.value)}
          placeholder='Case/Box'
        />
      </div>
      <div className='crud-form--form__row'>
        <label htmlFor='pcConsoleName'>PC Console</label>
        <InputText
          id='pcConsoleName'
          value={pcData?.consoleName}
          attr-which='pcConsoleName'
          readOnly
        />
      </div>
      <div className='crud-form--form__row'>
        <label htmlFor='pcId'>PC ID</label>
        <InputText id='pcId' value={pcData?.id} attr-which='pcId' readOnly />
      </div>
    </React.Fragment>
  );
};

export default PcPriceDetailsComponent;
