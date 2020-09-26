import Axios from 'axios';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { IAccessory } from '../../../common.model';
import { accessoryTypeArr } from '../../../constants';
import { handleChange, handleDropdownFn } from '../../../services/forms.service';
import helpersService from '../../../services/helpers.service';

interface IProps {
  acc: IAccessory;
  closeDialog: Function;
}

const AccForm: FunctionComponent<IProps> = ({ acc, closeDialog }) => {
  const [accForm, setAccForm] = useState<IAccessory>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);
  const [platformArr, setPlatformArr] = useState([]);

  const userChange = (e: any) => {
    const newState = handleChange(e, accForm);
    if (newState) {
      setAccForm(newState);
    }
  };

  const getPlatformArr = () => {
    const url = `${window.urlPrefix}/api/vg/utils/platforms`;
    Axios.get(url)
      .then(result => {
        setPlatformArr(result.data);
      })
      .catch(error => {
        console.log('error fetching genre array', error);
      });
  };

  const handleDropdown = useCallback(
    (e: any, which: string) => {
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
    getPlatformArr();
  }, [acc, setAddMode]);

  const updateAcc = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('platformForm in save', accForm);
    closeDialog(accForm?.name);
  }, [accForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
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
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="forConsoleName">For Console</label>
            <Dropdown
              value={accForm?.forConsoleName}
              options={platformArr}
              onChange={e => handleDropdown(e, 'forConsoleName')}
              attr-which="forConsoleName"
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

export default AccForm;
