import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { IAcc } from '@/models/accessories.model';
import { accessoryTypeArr } from '@/constants';
import { handleChange, handleDropdownFn } from '@/services/forms.service';
import ItemsContext, { IPlatformsWithId } from '@/context/ItemsContext';
import HelpersService, { conditionOptionsArr } from '../../../services/helpers.service';
import moment from 'moment';
import { cloneDeep as _cloneDeep } from 'lodash';
import { NotificationContext } from '@/context/NotificationContext';
import { saveAcc } from '@/services/accCrud.service';
import PcPriceComponent from '../PcPriceComponent/PcPriceComponent';
import PcPriceDetailsComponent from '../PcPriceDetails/PcPriceDetailsComponent';
import { formatFormResult, formatUpdateData, getPriceById } from '@/services/pricecharting.service';
import { IPriceChartingData } from '@/models/pricecharting.model';
import { IClone } from '@/models/common.model';
import axios from 'axios';

interface IProps {
  acc: IAcc;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const AccForm: FunctionComponent<IProps> = ({ acc, closeDialog, closeConfirmation }) => {
  const IContext = useContext(ItemsContext);
  const [accForm, setAccForm] = useState<IAcc>();
  const [addMode, setAddMode] = useState<boolean>(false);
  const yearRange = `2000:${new Date().getFullYear()}`;
  const [clones, setClones] = useState<IClone[]>([]);
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);

  const platformsWithId = useMemo(() => {
    const consFormatted = IContext.platformsWithId.map((platform: IPlatformsWithId) => {
      return { consoleId: platform.id, consoleName: platform.name };
    });
    return [...consFormatted, ...clones];
  }, [IContext.platformsWithId, clones]);

  const userChange = (e: any) => {
    closeConfirmation();
    const newState = handleChange(e, accForm);
    if (newState) {
      setAccForm(newState);
    }
  };

  const handleDropdown = useCallback(
    (e: any, which: string) => {
      closeConfirmation();
      setAccForm(handleDropdownFn(e, which, accForm));
    },
    [accForm, closeConfirmation]
  );

  const getClonesForConArray = useCallback(async () => {
    try {
      const clonesResult = await axios.get(`${window.urlPrefix}/api/vg/clones`);
      if (clonesResult?.data) {
        const clonesFormatted = clonesResult.data.map((c: IClone) => ({
          consoleId: c.name,
          consoleName: c.name
        }));
        setClones(clonesFormatted);
      }
    } catch (err) {
      setNotify({
        severity: 'error',
        detail: 'Error fetching clones and merging with console array.',
        summary: 'ERROR'
      });
    }
  }, [setNotify]);

  useEffect(() => {
    if (acc && acc.name === '') {
      setAddMode(true);
    }
    setAccForm(acc as IAcc);
    if (acc?.purchaseDate) {
      (acc as IAcc).newPurchaseDate = new Date(acc.purchaseDate);
    }
    getClonesForConArray();
  }, [acc, setAddMode]);

  const isUpdate = useCallback(() => {
    return !addMode && accForm?.hasOwnProperty('_id');
  }, [addMode, accForm]);

  const updateAcc = useCallback(() => {
    closeConfirmation();
    const accCopy = _cloneDeep(accForm);
    const isPatch = isUpdate();
    console.log('isPatch', isPatch);
    if (!accCopy) {
      setNotify({
        severity: 'error',
        detail: 'Empty of incomplete data for accessory to be saved.',
        summary: 'ERROR'
      });
      return;
    }
    if (!isPatch) {
      accCopy.purchaseDate = moment(accForm?.newPurchaseDate).format('YYYY-MM-DD');
    }
    delete accCopy.newPurchaseDate;
    saveAcc(accCopy, isPatch)
      .then(result => {
        closeDialog(accForm?.name, true, 'added');
      })
      .catch(error => {
        console.log('save acc error', error);
        closeDialog(accForm?.name, false, 'added');
      });
  }, [accForm, closeConfirmation, closeDialog, isUpdate, setNotify]);

  const resetAccForm = useCallback(() => {
    // @ts-ignore
    setAccForm(HelpersService.resetAccForm());
  }, [setAccForm]);

  const setPricechartingData = (data: IPriceChartingData) => {
    if (accForm) {
      const priceMultipliedByQuantity = accForm.quantity
        ? data.price * accForm.quantity
        : data.price;
      const updatedData = { ...data, price: priceMultipliedByQuantity };
      const updatedAcc = { ...accForm, priceCharting: updatedData };
      setAccForm(updatedAcc);
    }
  };

  const cancelClicked = () => {
    resetAccForm();
    closeConfirmation();
    closeDialog(null);
  };

  return (
    <div className='crud-form acc-form'>
      <div className='crud-form--flex-wrapper'>
        <form className='crud-from--form acc-form--form'>
          <div className='crud-form--form__row'>
            <label htmlFor='name'>Name</label>
            <InputText id='name' value={accForm?.name} onChange={userChange} attr-which='name' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='company'>Company</label>
            <InputText
              id='company'
              value={accForm?.company}
              onChange={userChange}
              attr-which='company'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='image'>Image</label>
            <InputText id='image' value={accForm?.image} onChange={userChange} attr-which='image' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='type'>Acc Type</label>
            <Dropdown
              value={accForm?.type}
              options={accessoryTypeArr}
              onChange={e => handleDropdown(e, 'type')}
              attr-which='type'
              id='type'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='condition'>Condition</label>
            <Dropdown
              value={accForm?.condition}
              options={conditionOptionsArr}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which='condition'
              id='condition'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='consoleName'>For Console</label>
            <Dropdown
              value={accForm?.associatedConsole}
              optionLabel='consoleName'
              options={platformsWithId}
              onChange={e => handleDropdown(e, 'associatedConsole')}
              attr-which='associatedConsole.consoleName'
              id='consoleName'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='officialLicensed'>Official/Licensed?</label>
            <InputSwitch
              id='officialLicensed'
              checked={!!accForm?.officialLicensed}
              onChange={userChange}
              attr-which='officialLicensed'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='quantity'>Quantity</label>
            <InputText
              id='quantity'
              value={accForm?.quantity}
              onChange={userChange}
              attr-which='quantity'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pricePaid'>Price Paid</label>
            <InputText
              id='pricePaid'
              value={accForm?.pricePaid || 0}
              onChange={userChange}
              attr-which='pricePaid'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='newPurchaseDate'>Date Purchased</label>
            <Calendar
              id='newPurchaseDate'
              showIcon={true}
              value={accForm?.newPurchaseDate}
              onChange={userChange}
              attr-which='newPurchaseDate'
              monthNavigator
              yearNavigator
              yearRange={yearRange}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='howAcquired'>How Acquired</label>
            <InputText
              id='howAcquired'
              value={accForm?.howAcquired}
              onChange={userChange}
              attr-which='howAcquired'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='box'>Box?</label>
            <InputSwitch id='box' checked={!!accForm?.box} onChange={userChange} attr-which='box' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='cib'>CIB?</label>
            <InputSwitch id='cib' checked={!!accForm?.cib} onChange={userChange} attr-which='cib' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='notes'>Notes</label>
            <InputTextarea
              id='notes'
              value={accForm?.notes}
              onChange={userChange}
              attr-which='notes'
              autoResize={true}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='updatedAt'>Last Updated</label>
            <InputText
              id='updatedAt'
              value={accForm?.updatedAt}
              onChange={userChange}
              attr-which='updatedAt'
              readOnly
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pc-input'>Price Charting</label>
            <PcPriceComponent
              data-id='pc-input'
              item={formatFormResult(accForm as IAcc, 'ACC')}
              onSelectionMade={setPricechartingData}
            />
          </div>
          {/** eslint-disable-next-line */}
          {accForm?.priceCharting && <PcPriceDetailsComponent pcData={accForm?.priceCharting} />}
        </form>
        <div className='crud-form--image-and-data'>
          {accForm?.image && <img src={accForm?.image} alt='accessory' />}
        </div>
      </div>
      <hr />
      <div className='crud-form--footer'>
        <Button
          label='Cancel'
          onClick={cancelClicked}
          icon='pi pi-times'
          className='p-button-info'
        />
        <Button
          label={`Save ${accForm?.name}`}
          onClick={updateAcc}
          icon='pi pi-save'
          className='p-button-success'
        />
      </div>
    </div>
  );
};

export default AccForm;
