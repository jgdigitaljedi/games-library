import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import changePlatformsArr from '../../../actionCreators/platformsArr';
import { IDropdown } from '@/models/common.model';
import { IAccessory } from '@/models/accessories.model';
import { accessoryTypeArr } from '@/constants';
import { handleChange, handleDropdownFn } from '@/services/forms.service';
import helpersService from '../../../services/helpers.service';
import { Dispatch as ReduxDispatch } from 'redux';
import PlatformForm from "@/components/Forms/PlatformForm/PlatformForm";

interface MapStateProps {
  platformsArr: IDropdown[];
}

interface MapDispatchProps {
  setPlatformsArr: (platformsArr: IDropdown[]) => void;
}

interface IProps extends MapDispatchProps, MapStateProps {
  acc: IAccessory;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const AccForm: FunctionComponent<IProps> = ({ acc, closeDialog, platformsArr, closeConfirmation }) => {
  const [accForm, setAccForm] = useState<IAccessory>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);

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
    [accForm, setAccForm]
  );

  useEffect(() => {
    if (acc && (acc.name === '' || acc.name === 'Add Game')) {
      setAddMode(true);
    }
    setAccForm(acc as IAccessory);
    if (acc?.purchaseDate) {
      (acc as IAccessory).newPurchaseDate = helpersService.getTodayYMD(acc.purchaseDate);
    }
  }, [acc, setAddMode]);

  const updateAcc = useCallback(() => {
    closeConfirmation();
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('accForm in save', accForm);
    closeDialog(accForm?.name);
  }, [accForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
    closeConfirmation();
    closeDialog(null);
  };

  return (
    <div className="crud-form acc-form">
      <div className="crud-form--flex-wrapper">
        <form className="crud-from--form acc-form--form">
          <div className="crud-form--form__row">
            <label htmlFor="name">Name</label>
            <InputText id="name" value={accForm?.name} onChange={userChange} attr-which="name" />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="compnay">Company</label>
            <InputText
              id="company"
              value={accForm?.company}
              onChange={userChange}
              attr-which="company"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="condition">Condition</label>
            <Dropdown
              value={accForm?.type}
              options={accessoryTypeArr}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which="condition"
              id="condition"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="forConsoleName">For Console</label>
            <Dropdown
              value={accForm?.forConsoleName}
              options={platformsArr}
              onChange={e => handleDropdown(e, 'forConsoleName')}
              attr-which="forConsoleName"
              id="forConsoleName"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="officialLicensed">Official/Licensed?</label>
            <InputSwitch
              id="officialLicensed"
              checked={!!accForm?.officialLicensed}
              onChange={userChange}
              attr-which="officialLicensed"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="quantity">Quantity</label>
            <InputText
              id="quantity"
              value={accForm?.quantity}
              onChange={userChange}
              attr-which="quantity"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="pricePaid">Price Paid</label>
            <InputText
              id="pricePaid"
              value={accForm?.pricePaid}
              onChange={userChange}
              attr-which="pricePaid"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="newPurchaseDate">Date Purchased</label>
            <Calendar
              id="newPurchaseDate"
              showIcon={true}
              value={accForm?.newPurchaseDate}
              onChange={userChange}
              attr-which="newPurchaseDate"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="howAcquired">How Acquired</label>
            <InputText
              id="howAcquired"
              value={accForm?.howAcquired}
              onChange={userChange}
              attr-which="howAcquired"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="notes"
              value={accForm?.notes}
              onChange={userChange}
              attr-which="notes"
              autoResize={true}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="updatedAt">Last Updated</label>
            <InputText
              id="updatedAt"
              value={accForm?.updatedAt}
              onChange={userChange}
              attr-which="updatedAt"
              readonly
            />
          </div>
        </form>
        <div className="crud-form--image-and-data">
          {accForm?.image && <img src={accForm?.image} alt="accessory" />}
        </div>
      </div>
      <hr />
      <div className="crud-form--footer">
        <Button
          label="Cancel"
          onClick={cancelClicked}
          icon="pi pi-times"
          className="p-button-info"
        />
        <Button
          label={`Save ${accForm?.name}`}
          onClick={updateAcc}
          icon="pi pi-save"
          className="p-button-success"
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

const mapDispatchToProps = (dispatch: ReduxDispatch): MapDispatchProps => ({
  setPlatformsArr: (platformsArr: IDropdown[]) => dispatch(changePlatformsArr(platformsArr))
});

export default connect(mapStateToProps, mapDispatchToProps)(AccForm);
