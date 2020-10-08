import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { IClone } from '../../../models/common.model';
import { handleChange } from '../../../services/forms.service';
import helpersService from '../../../services/helpers.service';

interface IProps {
  clone: IClone;
  closeDialog: Function;
}

const CloneForm: FunctionComponent<IProps> = ({ clone, closeDialog }) => {
  const [cloneForm, setCloneForm] = useState<IClone>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);

  const userChange = (e: any) => {
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

  const updateAcc = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('cloneFormin save', cloneForm);
    closeDialog(cloneForm?.name);
  }, [cloneForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
    closeDialog(null);
  };

  return (
    <div className="crud-form clone-form">
      <div className="crud-form--flex-wrapper">
        <form className="crud-from--form clone-form--form">
          <div className="crud-form--form__row">
            <label htmlFor="name">Name</label>
            <InputText id="name" value={cloneForm?.name} onChange={userChange} attr-which="name" />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="company">Company</label>
            <InputText
              id="company"
              value={cloneForm?.company}
              onChange={userChange}
              attr-which="company"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="consolesEmulated">Console(s) Emulated</label>
            <InputText
              id="consolesEmulated"
              value={cloneForm?.consolesEmulated}
              onChange={userChange}
              attr-which="consolesEmulated"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="newPurchaseDate">Date Purchased</label>
            <Calendar
              id="newPurchaseDate"
              showIcon={true}
              value={cloneForm?.newPurchaseDate}
              onChange={userChange}
              attr-which="newPurchaseDate"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="pricePaid">Purchase Price $</label>
            <InputText
              id="pricePaid"
              value={cloneForm?.pricePaid}
              onChange={userChange}
              attr-which="pricePaid"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="gamesIncludedAmount"># Games Included</label>
            <InputText
              id="gamesIncludedAmount"
              value={cloneForm?.gamesIncludedAmount}
              onChange={userChange}
              attr-which="gamesIncludedAmount"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="gamesAddedNumber"># Games Added</label>
            <InputText
              id="gamesAddedNumber"
              value={cloneForm?.gamesAddedNumber}
              onChange={userChange}
              attr-which="gamesAddedNumber"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="hacked">Hacked</label>
            <InputSwitch
              id="hacked"
              checked={cloneForm?.hacked}
              onChange={userChange}
              attr-which="hacked"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="hd">HD</label>
            <InputSwitch id="hd" checked={cloneForm?.hd} onChange={userChange} attr-which="hd" />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="controllerNumber"># Controllers</label>
            <InputText
              id="controllerNumber"
              value={cloneForm?.controllerNumber}
              onChange={userChange}
              attr-which="controllerNumber"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="takesOriginalControllers">Takes Original Controllers</label>
            <InputSwitch
              id="takesOriginalControllers"
              checked={cloneForm?.takesOriginalControllers}
              onChange={userChange}
              attr-which="takesOriginalControllers"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="wireless">Wireless</label>
            <InputSwitch
              id="wireless"
              checked={cloneForm?.wireless}
              onChange={userChange}
              attr-which="wireless"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="maxPlayers">Max # Players</label>
            <InputText
              id="maxPlayers"
              value={cloneForm?.maxPlayers}
              onChange={userChange}
              attr-which="maxPlayers"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="updatedAt">Last Updated</label>
            <InputText
              id="updatedAt"
              value={cloneForm?.updatedAt}
              onChange={userChange}
              attr-which="updatedAt"
              readOnly
            />
          </div>
        </form>
        <div className="crud-form--image-and-data">
          {cloneForm?.image && <img src={cloneForm?.image} alt="accessory" />}
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
          label={`Save ${cloneForm?.name}`}
          onClick={updateAcc}
          icon="pi pi-save"
          className="p-button-success"
        />
      </div>
    </div>
  );
};

export default CloneForm;
