import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { IConsole } from '@/models/platforms.model';
import { InputText } from 'primereact/inputtext';
import { handleChange, handleDropdownFn } from '@/services/forms.service';
import helpersService from '../../../services/helpers.service';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { conditionArr } from '@/constants';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

interface IProps {
  platform: IConsole;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const PlatformForm: FunctionComponent<IProps> = ({ platform, closeDialog, closeConfirmation }: IProps) => {
  const [platformForm, setPlatformForm] = useState<IConsole>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);

  const userChange = (e: any) => {
    closeConfirmation();
    const newState = handleChange(e, platformForm);
    if (newState) {
      setPlatformForm(newState);
    }
  };

  const handleDropdown = useCallback(
    (e: any, which: string) => {
      closeConfirmation();
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
    closeConfirmation();
    closeDialog(platformForm?.name);
  }, [platformForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
    closeConfirmation();
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
            <label htmlFor="alternative_name">Aliases</label>
            <InputText
              id="alternative_name"
              value={platformForm?.alternative_name}
              onChange={userChange}
              attr-which="alternative_name"
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
              checked={platformForm?.box}
              onChange={userChange}
              attr-which="box"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="pricePaid">Price Paid</label>
            <InputText
              id="pricePaid"
              value={platformForm?.pricePaid || 0}
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
            <label htmlFor="connectivity">Connectivity</label>
            <InputText
              id="connectivity"
              value={platformForm?.connectivity}
              onChange={userChange}
              attr-which="connectivity"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="memory">Memory</label>
            <InputText
              id="memory"
              value={platformForm?.memory}
              onChange={userChange}
              attr-which="memory"
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
          {platformForm?.logo && <img src={platformForm?.logo} alt="platform" />}
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
