import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { IDropdown } from '@/models/common.model';
import { ICollectible, ICollAssociatedCon } from '@/models/collectibles.model';
import { handleChange } from '@/services/forms.service';
import helpersService from '../../../services/helpers.service';
import { connect } from 'react-redux';
import { InputTextarea } from 'primereact/inputtextarea';
import PcPriceComponent from '../PcPriceComponent/PcPriceComponent';
import PcPriceDetailsComponent from '../PcPriceDetails/PcPriceDetailsComponent';
import { formatFormResult } from '@/services/pricecharting.service';
import { IPriceChartingData } from '@/models/pricecharting.model';
import { cloneDeep as _cloneDeep } from 'lodash';
import { NotificationContext } from '@/context/NotificationContext';
import moment from 'moment';
import { saveCollectible } from '@/services/collectibleCrud.service';

interface MapStateProps {
  platformsArr: IDropdown[];
}

interface IProps extends MapStateProps {
  collectible: ICollectible;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const CollForm: FunctionComponent<IProps> = ({
  collectible,
  closeDialog,
  platformsArr,
  closeConfirmation
}) => {
  const [collForm, setCollForm] = useState<ICollectible>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);
  const [pArr, setPArr] = useState<ICollAssociatedCon[]>([]);
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);

  const isUpdate = useMemo(() => {
    return !addMode && collForm?.hasOwnProperty('_id');
  }, [addMode, collForm]);

  const userChange = (e: any) => {
    closeConfirmation();
    const newState = handleChange(e, collForm);
    if (newState) {
      setCollForm(newState);
    }
  };

  useEffect(() => {
    setPArr(
      platformsArr.map((con: any) => {
        return { name: con.label, id: con.value };
      })
    );
    setCollForm(collectible as ICollectible);
    if (collectible && (collectible.name === '' || collectible.name === 'Add Game')) {
      setAddMode(true);
    }
    if (collectible?.associatedConsoles) {
      collectible.associatedConsoles = collectible.associatedConsoles.map(con => {
        return { name: con.name, id: con.name };
      });
    }
    if (collectible?.purchaseDate) {
      (collectible as ICollectible).newPurchaseDate = helpersService.getTodayYMD(
        collectible.purchaseDate
      );
    }
    if (typeof collectible?.officialLicensed === 'string') {
      collectible.officialLicensed = JSON.parse(collectible.officialLicensed);
    }
    if (typeof collectible?.pricePaid === 'string') {
      collectible.pricePaid = parseInt(collectible.pricePaid);
    }
  }, [collectible, setAddMode, platformsArr]);

  const updateColl = useCallback(() => {
    closeConfirmation();
    const collCopy = _cloneDeep(collForm);
    const isPatch = isUpdate;
    if (!collCopy) {
      setNotify({
        severity: 'error',
        detail: 'Empty of incomplete data for clone to be saved.',
        summary: 'ERROR'
      });
      return;
    }
    if (!isPatch) {
      collCopy.purchaseDate = moment(collForm?.newPurchaseDate).format('YYYY-MM-DD');
    }
    delete collCopy.newPurchaseDate;
    saveCollectible(collCopy, isPatch)
      .then(result => {
        closeDialog(collForm?.name, true, 'added');
      })
      .catch(error => {
        console.log('save collectible error', error);
        closeDialog(collForm?.name, false, 'added');
        setNotify({
          severity: 'error',
          detail: 'Error saving clone!.',
          summary: 'ERROR'
        });
      });
  }, [closeConfirmation, closeDialog, collForm, isUpdate, setNotify]);

  const cancelClicked = () => {
    // resetGameForm();
    closeConfirmation();
    closeDialog(null);
  };

  const setPricechartingData = (data: IPriceChartingData) => {
    if (collForm) {
      const updatedColl = { ...collForm, priceCharting: data };
      setCollForm(updatedColl);
    }
  };

  return (
    <div className='crud-form coll-form'>
      <div className='crud-form--flex-wrapper'>
        <form className='crud-from--form coll-form--form'>
          <div className='crud-form--form__row'>
            <label htmlFor='name'>Name</label>
            <InputText id='name' value={collForm?.name} onChange={userChange} attr-which='name' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='compnay'>Company</label>
            <InputText
              id='company'
              value={collForm?.company}
              onChange={userChange}
              attr-which='company'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='character'>Character</label>
            <InputText
              id='character'
              value={collForm?.character}
              onChange={userChange}
              attr-which='character'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='associatedGame'>Associated Game</label>
            <InputText
              id='associatedGame'
              value={collForm?.associatedGame}
              onChange={userChange}
              attr-which='associatedGame'
            />
          </div>
          {pArr?.length && (
            <div className='crud-form--form__row'>
              <label htmlFor='associatedConsoles'>Associated Consoles</label>
              <ListBox
                id='associatedConsoles'
                value={collForm?.associatedConsoles}
                options={pArr}
                optionLabel='name'
                onChange={userChange}
                multiple={true}
                style={{ height: '13rem', overflowY: 'scroll' }}
                attr-which='associatedConsoles'
              />
            </div>
          )}
          <div className='crud-form--form__row'>
            <label htmlFor='officialLicensed'>Official/Licensed?</label>
            <InputSwitch
              id='officialLicensed'
              checked={!!collForm?.officialLicensed}
              onChange={userChange}
              attr-which='officialLicensed'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pricePaid'>Price Paid</label>
            <InputText
              id='pricePaid'
              value={collForm?.pricePaid}
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
              value={collForm?.newPurchaseDate}
              onChange={userChange}
              attr-which='newPurchaseDate'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='howAcquired'>How Acguired</label>
            <InputText
              id='howAcquired'
              value={collForm?.howAcquired}
              onChange={userChange}
              attr-which='howAcquired'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='type'>Type</label>
            <InputText id='type' value={collForm?.type} onChange={userChange} attr-which='type' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='quantity'>Quantity</label>
            <InputText
              id='quantity'
              value={collForm?.quantity}
              onChange={userChange}
              attr-which='quantity'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='notes'>Notes</label>
            <InputTextarea
              id='notes'
              value={collForm?.notes}
              onChange={userChange}
              attr-which='notes'
              autoResize={true}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='updatedAt'>Last Updated</label>
            <InputText
              id='updatedAt'
              value={collForm?.updatedAt}
              onChange={userChange}
              attr-which='updatedAt'
              readOnly
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pc-input'>Price Charting</label>
            <PcPriceComponent
              data-id='pc-input'
              item={formatFormResult(collForm as ICollectible, 'COLL')}
              onSelectionMade={setPricechartingData}
            />
          </div>
          {/** eslint-disable-next-line */}
          {collForm?.priceCharting && <PcPriceDetailsComponent pcData={collForm?.priceCharting} />}
        </form>
        <div className='crud-form--image-and-data'>
          {collForm?.image && <img src={collForm?.image} alt='collectible' />}
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
          label={`Save ${CollForm?.name}`}
          onClick={updateColl}
          icon='pi pi-save'
          className='p-button-success'
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ platformsArr }: { platformsArr: IDropdown[] }): MapStateProps => {
  return {
    platformsArr
  };
};

export default connect(mapStateToProps)(CollForm);
