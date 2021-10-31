import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { IClone } from '@/models/common.model';
import { handleChange } from '@/services/forms.service';
import helpersService from '../../../services/helpers.service';
import PcPriceComponent from '../PcPriceComponent/PcPriceComponent';
import PcPriceDetailsComponent from '../PcPriceDetails/PcPriceDetailsComponent';
import { formatFormResult } from '@/services/pricecharting.service';
import { IPriceChartingData } from '@/models/pricecharting.model';
import { cloneDeep as _cloneDeep } from 'lodash';
import { NotificationContext } from '@/context/NotificationContext';
import moment from 'moment';
import { saveClone } from '@/services/cloneCrud.service';

interface IProps {
  clone: IClone;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const CloneForm: FunctionComponent<IProps> = ({ clone, closeDialog, closeConfirmation }) => {
  const [cloneForm, setCloneForm] = useState<IClone>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);

  const userChange = (e: any) => {
    closeConfirmation();
    const newState = handleChange(e, cloneForm);
    if (newState) {
      setCloneForm(newState);
    }
  };

  useEffect(() => {
    if (clone && (clone.name === '' || clone.name === 'Add Game')) {
      setAddMode(true);
    }
    setCloneForm(clone as IClone);
    if (clone?.datePurchased) {
      (clone as IClone).newPurchaseDate = helpersService.getTodayYMD(clone.datePurchased);
    }
    if (typeof clone?.gamesIncludedAmount === 'string') {
      clone.gamesIncludedAmount = parseInt(clone.gamesIncludedAmount);
    }
    if (typeof clone?.gamesAddedNumber === 'string') {
      clone.gamesAddedNumber = parseInt(clone.gamesAddedNumber);
    }
    if (typeof clone?.pricePaid === 'string') {
      clone.pricePaid = parseInt(clone.pricePaid);
    }
    if (typeof clone?.hacked === 'string') {
      clone.hacked = JSON.parse(clone.hacked);
    }
    if (typeof clone?.wireless === 'string') {
      clone.wireless = JSON.parse(clone.wireless);
    }
    if (typeof clone?.controllerNumber === 'string') {
      clone.controllerNumber = parseInt(clone.controllerNumber);
    }
    if (typeof clone?.maxPlayers === 'string') {
      clone.maxPlayers = parseInt(clone.maxPlayers);
    }
  }, [clone, setAddMode]);

  const isUpdate = useMemo(() => {
    return !addMode && cloneForm?.hasOwnProperty('_id');
  }, [addMode, cloneForm]);

  const updateClone = useCallback(() => {
    closeConfirmation();
    const cloneCopy = _cloneDeep(cloneForm);
    const isPatch = isUpdate;
    if (!cloneCopy) {
      setNotify({
        severity: 'error',
        detail: 'Empty of incomplete data for clone to be saved.',
        summary: 'ERROR'
      });
      return;
    }
    if (!isPatch) {
      cloneCopy.datePurchased = moment(cloneForm?.newPurchaseDate).format('YYYY-MM-DD');
    }
    delete cloneCopy.newPurchaseDate;
    saveClone(cloneCopy, isPatch)
      .then(result => {
        closeDialog(cloneForm?.name, true, 'added');
      })
      .catch(error => {
        console.log('save acc error', error);
        closeDialog(cloneForm?.name, false, 'added');
        setNotify({
          severity: 'error',
          detail: 'Error saving clone!.',
          summary: 'ERROR'
        });
      });
  }, [cloneForm, closeDialog, closeConfirmation, isUpdate, setNotify]);

  const cancelClicked = () => {
    // resetGameForm();
    closeConfirmation();
    closeDialog(null);
  };

  const setPricechartingData = (data: IPriceChartingData) => {
    if (cloneForm) {
      const updatedClone = { ...cloneForm, priceCharting: data };
      setCloneForm(updatedClone);
    }
  };

  return (
    <div className='crud-form clone-form'>
      <div className='crud-form--flex-wrapper'>
        <form className='crud-from--form clone-form--form'>
          <div className='crud-form--form__row'>
            <label htmlFor='name'>Name</label>
            <InputText id='name' value={cloneForm?.name} onChange={userChange} attr-which='name' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='company'>Company</label>
            <InputText
              id='company'
              value={cloneForm?.company}
              onChange={userChange}
              attr-which='company'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='consolesEmulated'>Console(s) Emulated</label>
            <InputText
              id='consolesEmulated'
              value={cloneForm?.consolesEmulated}
              onChange={userChange}
              attr-which='consolesEmulated'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='newPurchaseDate'>Date Purchased</label>
            <Calendar
              id='newPurchaseDate'
              showIcon={true}
              value={cloneForm?.newPurchaseDate}
              onChange={userChange}
              attr-which='newPurchaseDate'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pricePaid'>Purchase Price $</label>
            <InputText
              id='pricePaid'
              value={cloneForm?.pricePaid}
              onChange={userChange}
              attr-which='pricePaid'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='gamesIncludedAmount'># Games Included</label>
            <InputText
              id='gamesIncludedAmount'
              value={cloneForm?.gamesIncludedAmount}
              onChange={userChange}
              attr-which='gamesIncludedAmount'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='gamesAddedNumber'># Games Added</label>
            <InputText
              id='gamesAddedNumber'
              value={cloneForm?.gamesAddedNumber}
              onChange={userChange}
              attr-which='gamesAddedNumber'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='hacked'>Hacked</label>
            <InputSwitch
              id='hacked'
              checked={cloneForm?.hacked}
              onChange={userChange}
              attr-which='hacked'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='hd'>HD</label>
            <InputSwitch id='hd' checked={cloneForm?.hd} onChange={userChange} attr-which='hd' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='controllerNumber'># Controllers</label>
            <InputText
              id='controllerNumber'
              value={cloneForm?.controllerNumber}
              onChange={userChange}
              attr-which='controllerNumber'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='takesOriginalControllers'>Takes Original Controllers</label>
            <InputSwitch
              id='takesOriginalControllers'
              checked={cloneForm?.takesOriginalControllers}
              onChange={userChange}
              attr-which='takesOriginalControllers'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='wireless'>Wireless</label>
            <InputSwitch
              id='wireless'
              checked={cloneForm?.wireless}
              onChange={userChange}
              attr-which='wireless'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='maxPlayers'>Max # Players</label>
            <InputText
              id='maxPlayers'
              value={cloneForm?.maxPlayers}
              onChange={userChange}
              attr-which='maxPlayers'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='updatedAt'>Last Updated</label>
            <InputText
              id='updatedAt'
              value={cloneForm?.updatedAt}
              onChange={userChange}
              attr-which='updatedAt'
              readOnly
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pc-input'>Price Charting</label>
            <PcPriceComponent
              data-id='pc-input'
              item={formatFormResult(cloneForm as IClone, 'CLONE')}
              onSelectionMade={setPricechartingData}
            />
          </div>
          {/** eslint-disable-next-line */}
          {cloneForm?.priceCharting && (
            <PcPriceDetailsComponent pcData={cloneForm?.priceCharting} />
          )}
        </form>
        <div className='crud-form--image-and-data'>
          {cloneForm?.image && <img src={cloneForm?.image} alt='accessory' />}
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
          label={`Save ${cloneForm?.name}`}
          onClick={updateClone}
          icon='pi pi-save'
          className='p-button-success'
        />
      </div>
    </div>
  );
};

export default CloneForm;
