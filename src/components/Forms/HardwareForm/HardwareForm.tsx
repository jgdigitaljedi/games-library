import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { IHardware } from '@/models/common.model';
import { handleChange } from '@/services/forms.service';
import helpersService from '../../../services/helpers.service';

interface IProps {
  hardware: IHardware;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const HardwareForm: FunctionComponent<IProps> = ({ hardware, closeDialog, closeConfirmation }) => {
  const [hwForm, setHwForm] = useState<IHardware>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);

  const userChange = (e: any) => {
    closeConfirmation();
    const newState = handleChange(e, hwForm);
    if (newState) {
      setHwForm(newState);
    }
  };

  useEffect(() => {
    setHwForm(hardware as IHardware);
    if (hardware?.purchaseDate) {
      (hardware as IHardware).newPurchaseDate = helpersService.getTodayYMD(hardware.purchaseDate);
    }
    if (typeof hardware?.pricePaid === 'string') {
      hardware.pricePaid = parseInt(hardware.pricePaid);
    }
  }, [hardware, setAddMode]);

  const updateColl = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    closeConfirmation();
    closeDialog(hwForm?.name);
  }, [hwForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
    closeConfirmation();
    closeDialog(null);
  };
  return (
    <div className="crud-form hw-form">
      <div className="crud-form--flex-wrapper">
        <form className="crud-from--form hw-form--form">
          <div className="crud-form--form__row">
            <label htmlFor="name">Name</label>
            <InputText id="name" value={hwForm?.name} onChange={userChange} attr-which="name" />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="company">Company</label>
            <InputText
              id="company"
              value={hwForm?.company}
              onChange={userChange}
              attr-which="company"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="type">Type</label>
            <InputText id="type" value={hwForm?.type} onChange={userChange} attr-which="type" />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="quantity">Quantity</label>
            <InputText
              id="quantity"
              value={hwForm?.quantity}
              onChange={userChange}
              attr-which="quantity"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="newPurchaseDate">Date Purchased</label>
            <Calendar
              id="newPurchaseDate"
              showIcon={true}
              value={hwForm?.newPurchaseDate}
              onChange={userChange}
              attr-which="newPurchaseDate"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="pricePaid">Purchase Price</label>
            <InputText
              id="pricePaid"
              value={hwForm?.pricePaid}
              onChange={userChange}
              attr-which="pricePaid"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="howAcquired">How Acquired</label>
            <InputText
              id="howAcquired"
              value={hwForm?.howAcquired}
              onChange={userChange}
              attr-which="howAcquired"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="notes"
              value={hwForm?.notes}
              onChange={userChange}
              attr-which="notes"
              autoResize={true}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="updatedAt">Last Updated</label>
            <InputText
              id="updatedAt"
              value={hwForm?.updatedAt}
              onChange={userChange}
              attr-which="updatedAt"
              readonly
            />
          </div>
        </form>
        <div className="crud-form--image-and-data">
          {hwForm?.image && <img src={hwForm?.image} alt="hardware" />}
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
          label={`Save ${hwForm?.name}`}
          onClick={updateColl}
          icon="pi pi-save"
          className="p-button-success"
        />
      </div>
    </div>
  );
};

export default HardwareForm;
