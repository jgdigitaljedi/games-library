import React, { FunctionComponent, useState, useEffect } from 'react';
import { IConsole } from '../../../common.model';
import { InputText } from 'primereact/inputtext';
import { handleChange } from '../../../services/forms.service';
import helpersService from '../../../services/helpers.service';

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

  useEffect(() => {
    if (platform && (platform.name === '' || platform.name === 'Add Game')) {
      setAddMode(true);
    }
    setPlatformForm(platform as IConsole);
    if (platform?.datePurchased) {
      (platform as IConsole).newDatePurchased = helpersService.getTodayYMD(platform.datePurchased);
    }
  }, [platform, setAddMode]);

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
        </form>
      </div>
    </div>
  );
};

export default PlatformForm;
