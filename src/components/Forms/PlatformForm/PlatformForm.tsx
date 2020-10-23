import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { IConsole } from '../../../models/platforms.model';
import { InputText } from 'primereact/inputtext';
import { handleChange, handleDropdownFn } from '../../../services/forms.service';
import helpersService from '../../../services/helpers.service';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { conditionArr } from '../../../constants';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

interface IProps {
  platform: IConsole;
  closeDialog: Function;
}

const PlatformForm: FunctionComponent<IProps> = ({ platform, closeDialog }: IProps) => {
  const [platformForm, setPlatformForm] = useState<IConsole>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);

  const userChange = (e: any) => {
    const newState = handleChange(e, platformForm);
    if (newState) {
      setPlatformForm(newState);
    }
  };

  const handleDropdown = useCallback(
    (e: any, which: string) => {
      setPlatformForm(handleDropdownFn(e, which, platformForm));
    },
    [platformForm, setPlatformForm]
  );

  useEffect(() => {
    if (platform && (platform.name === '' || platform.name === 'Add Game')) {
      setAddMode(true);
    }
    setPlatformForm(platform as IConsole);
    if (platform?.datePurchased) {
      (platform as IConsole).newDatePurchased = helpersService.getTodayYMD(platform.datePurchased);
    }
  }, [platform, setAddMode]);

  // const resetGameForm = useCallback(() => {
  //   // setPlatformForm(helpersService.resetPlatformForm());
  // }, []);

  const updatePlatform = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('platformForm in save', platformForm);
    closeDialog(platformForm?.name);
  }, [platformForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
    closeDialog(null);
  };

  return (
    <div className="crud-form platform-form">
      <div className="crud-form--flex-wrapper">
        <form className="crud-from--form platform-form--form">
          <div className="crud-form--form__row">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={platformForm?.name}
              onChange={userChange}
              attr-which="name"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="aliases">Aliases</label>
            <InputText
              id="aliases"
              value={platformForm?.aliases}
              onChange={userChange}
              attr-which="aliases"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="company">Company</label>
            <InputText
              id="company"
              value={platformForm?.gb?.company}
              onChange={userChange}
              attr-which="company"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="condition">Condition</label>
            <Dropdown
              value={platformForm?.condition}
              options={conditionArr}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which="condition"
              id="condition"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="mods">Mods</label>
            <InputTextarea
              id="mods"
              value={platformForm?.mods}
              onChange={userChange}
              attr-which="mods"
              autoResize={true}
              cols={50}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="box">Box</label>
            <InputSwitch
              id="box"
              checked={platformForm?.box === 'true'}
              onChange={userChange}
              attr-which="box"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="originalPrice">Launch Price</label>
            <InputText
              id="originalPrice"
              value={'$' + platformForm?.gb?.original_price}
              onChange={userChange}
              attr-which="originalPrice"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="installBase">Units Sold</label>
            <InputText
              id="installBase"
              value={platformForm?.gb?.install_base}
              onChange={userChange}
              attr-which="installBase"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="pricePaid">Price Paid</label>
            <InputText
              id="pricePaid"
              value={platformForm?.purchasePrice}
              onChange={userChange}
              attr-which="pricePaid"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="newDatePurchased">Date Purchased</label>
            <Calendar
              id="newDatePurchased"
              showIcon={true}
              value={platformForm?.newDatePurchased}
              onChange={userChange}
              attr-which="newDatePurchased"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="onlineSupport">Online Support</label>
            <InputSwitch
              id="onlineSupport"
              checked={platformForm?.gb?.online_support}
              onChange={userChange}
              attr-which="onlineSupport"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="storage">Storage Space</label>
            <InputText
              id="storage"
              value={platformForm?.storage}
              onChange={userChange}
              attr-which="storage"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="storageUnit">Storage Unit</label>
            <InputText
              id="storageUnit"
              value={platformForm?.unit}
              onChange={userChange}
              attr-which="storageUnit"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="notes"
              value={platformForm?.notes}
              onChange={userChange}
              attr-which="notes"
              autoResize={true}
              cols={50}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="ghostConsole">Ghost Console</label>
            <InputSwitch
              id="ghostConsole"
              checked={platformForm?.ghostConsole}
              onChange={userChange}
              attr-which="ghostConsole"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="updatedAt">Last Updated</label>
            <InputText
              id="updatedAt"
              value={platformForm?.updatedAt}
              onChange={userChange}
              attr-which="updatedAt"
              readOnly
            />
          </div>
        </form>
        <div className="crud-form--image-and-data">
          {/* {platformForm?.igdb?.logo && <img src={platformForm?.igdb?.logo} alt="platform logo" />} */}
          {platformForm?.gb?.image && <img src={platformForm?.gb?.image} alt="platform" />}
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
          label={`Save ${platformForm?.name}`}
          onClick={updatePlatform}
          icon="pi pi-save"
          className="p-button-success"
        />
      </div>
    </div>
  );
};

export default PlatformForm;
