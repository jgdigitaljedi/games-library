import React, { FunctionComponent, useState, useEffect, useCallback, useContext } from 'react';
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
import { AutoComplete } from 'primereact/autocomplete';
import { cloneDeep as _cloneDeep } from 'lodash';
import { NotificationContext } from '@/context/NotificationContext';
import {
  formatNewPlatformForSave,
  igdbPlatformSearch,
  igdbPlatformVersions,
  savePlatform
} from '@/services/platformsCrud.service';

interface IProps {
  platform: IConsole;
  closeDialog: Function;
  closeConfirmation: () => void;
}

const PlatformForm: FunctionComponent<IProps> = ({
  platform,
  closeDialog,
  closeConfirmation
}: IProps) => {
  const [platformForm, setPlatformForm] = useState<IConsole>();
  const [addMode, setAddMode] = useState<boolean>(false);
  const [igdbPlatforms, setIgdbPlatforms] = useState<any[]>();
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
  const [platformVersions, setPlatformVersions] = useState([]);

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
    [closeConfirmation, platformForm]
  );

  const searchSelection = async (e: any) => {
    closeConfirmation();
    if (e?.value) {
      const platform = e.value;
      setPlatformVersions(platform.versions);
      const pfCopy = _cloneDeep(platformForm);
      setPlatformForm(Object.assign(pfCopy, platform));
    }
  };

  const searchVersion = async (version: any) => {
    const plat = { ...platformForm, versions: [version] };
    const versionData = await igdbPlatformVersions(plat);
    const fullPlatform = { ...plat, ...versionData.data };
    fullPlatform.id = plat.id;
    const formattedPlatform = formatNewPlatformForSave(fullPlatform);
    const pfCopy = _cloneDeep(platformForm);
    const savable = Object.assign(pfCopy, formattedPlatform);
    // @ts-ignore
    delete savable.versions;
    console.log('savable', savable);
    setPlatformForm(savable);
  };

  const searchIgdb = useCallback(async () => {
    closeConfirmation();
    if (platformForm?.name) {
      try {
        const result = await igdbPlatformSearch(platformForm?.name);
        if (result?.data) {
          setIgdbPlatforms(result.data);
        }
      } catch (error) {
        setNotify({
          severity: 'error',
          detail: 'Error fetching IGDB platform data.',
          summary: 'ERROR'
        });
      }
    }
  }, [closeConfirmation, platformForm, setNotify]);

  useEffect(() => {
    if (platform && (platform.name === '' || platform.name === 'Add Console')) {
      setAddMode(true);
    }
    setPlatformForm(platform as IConsole);
    if (platform?.datePurchased) {
      (platform as IConsole).newDatePurchased = helpersService.getTodayYMD(platform.datePurchased);
    }
  }, [platform, setAddMode]);

  // const resetGameForm = useCallback(() => {
  //   setPlatformForm(helpersService.resetPlatformForm());
  // }, []);

  const updatePlatform = useCallback(() => {
    // make save call
    const platformCopy = _cloneDeep(platformForm as IConsole);

    savePlatform(platformCopy, addMode)
      .then(result => {
        closeDialog(platformForm?.name, true, 'added');
      })
      .catch(error => {
        console.log('save error', error);
        closeDialog(platformForm?.name, false, 'added');
      });
    closeConfirmation();
    closeDialog(platformForm?.name);
  }, [closeConfirmation, closeDialog, platformForm, addMode]);

  const cancelClicked = () => {
    // resetGameForm();
    closeConfirmation();
    closeDialog(null);
  };

  return (
    <div className='crud-form platform-form'>
      <div className='crud-form--flex-wrapper'>
        <form className='crud-from--form platform-form--form'>
          <div className='crud-form--form__row'>
            <label htmlFor='name'>Name</label>
            <AutoComplete
              dropdown
              className='search-field'
              delay={600}
              id='name'
              value={platformForm?.name}
              onChange={userChange}
              onSelect={searchSelection}
              attr-which='name'
              suggestions={igdbPlatforms}
              completeMethod={searchIgdb}
              field='name'
              placeholder='Type console name to search'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='version'>Version</label>
            <Dropdown
              value={platformForm?.version?.name}
              options={platformVersions}
              onChange={e => searchVersion(e.value)}
              attr-which='version'
              id='version'
              optionLabel='name'
              style={{ width: '33%' }}
              disabled={!platformVersions?.length}
            />
          </div>
          <div className='divider'>
            <hr />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='alternative_name'>Aliases</label>
            <InputText
              id='alternative_name'
              value={platformForm?.alternative_name}
              onChange={userChange}
              attr-which='alternative_name'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='cpu'>CPU</label>
            <InputText id='cpu' value={platformForm?.cpu} onChange={userChange} attr-which='cpu' />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='os'>OS</label>
            <InputText
              id='os'
              value={platformForm?.os || ''}
              onChange={userChange}
              attr-which='os'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='memory'>Memory</label>
            <InputText
              id='memory'
              value={platformForm?.memory}
              onChange={userChange}
              attr-which='memory'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='storage'>Storage</label>
            <InputText
              id='storage'
              value={platformForm?.storage}
              onChange={userChange}
              attr-which='storage'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='output'>Output</label>
            <InputText
              id='output'
              value={platformForm?.output}
              onChange={userChange}
              attr-which='output'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='resolutions'>Resolutions</label>
            <InputText
              id='resolutions'
              value={platformForm?.resolutions}
              onChange={userChange}
              attr-which='resolutions'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='connectivity'>Connectivity</label>
            <InputText
              id='connectivity'
              value={platformForm?.connectivity || ''}
              onChange={userChange}
              attr-which='connectivity'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='generation'>Generation</label>
            <InputText
              id='generation'
              value={platformForm?.generation || ''}
              onChange={userChange}
              attr-which='generation'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='logo'>Logo</label>
            <InputText
              id='logo'
              value={platformForm?.logo || ''}
              onChange={userChange}
              attr-which='logo'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='category'>Category</label>
            <InputText
              id='category'
              value={platformForm?.category || ''}
              onChange={userChange}
              attr-which='category'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='releaseDate_date'>Release Date</label>
            <InputText
              id='releaseDate_date'
              value={platformForm?.releaseDate?.date || ''}
              onChange={userChange}
              attr-which='releaseDate.date'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='releaseDate_region'>Release Region</label>
            <InputText
              id='releaseDate_region'
              value={platformForm?.releaseDate?.region || ''}
              onChange={userChange}
              attr-which='releaseDate.region'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='summary'>Summary</label>
            <InputText
              id='summary'
              value={platformForm?.summary || ''}
              onChange={userChange}
              attr-which='summary'
            />
          </div>
          <div className='divider'>
            <hr />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='condition'>Condition</label>
            <Dropdown
              value={platformForm?.condition}
              options={conditionArr}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which='condition'
              id='condition'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='mods'>Mods</label>
            <InputTextarea
              id='mods'
              value={platformForm?.mods}
              onChange={userChange}
              attr-which='mods'
              autoResize={true}
              cols={50}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='box'>Box</label>
            <InputSwitch
              id='box'
              checked={platformForm?.box}
              onChange={userChange}
              attr-which='box'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='manual'>Manual</label>
            <InputSwitch
              id='manual'
              checked={platformForm?.manual}
              onChange={userChange}
              attr-which='manual'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='howAcquired'>How Acquired</label>
            <InputText
              id='howAcquired'
              value={platformForm?.howAcquired || ''}
              onChange={userChange}
              attr-which='howAcquired'
              type='text'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pricePaid'>Price Paid</label>
            <InputText
              id='pricePaid'
              value={platformForm?.pricePaid || 0}
              onChange={userChange}
              attr-which='pricePaid'
              type='number'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='newDatePurchased'>Date Purchased</label>
            <Calendar
              id='newDatePurchased'
              showIcon={true}
              value={platformForm?.newDatePurchased}
              onChange={userChange}
              attr-which='newDatePurchased'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='notes'>Notes</label>
            <InputTextarea
              id='notes'
              value={platformForm?.notes}
              onChange={userChange}
              attr-which='notes'
              autoResize={true}
              cols={50}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='ghostConsole'>Ghost Console</label>
            <InputSwitch
              id='ghostConsole'
              checked={platformForm?.ghostConsole}
              onChange={userChange}
              attr-which='ghostConsole'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='updatedAt'>Last Updated</label>
            <InputText
              id='updatedAt'
              value={platformForm?.updatedAt}
              onChange={userChange}
              attr-which='updatedAt'
              readOnly
            />
          </div>
        </form>
        <div className='crud-form--image-and-data'>
          {platformForm?.logo && <img src={platformForm?.logo} alt='platform' />}
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
          label={`Save ${platformForm?.name}`}
          onClick={updatePlatform}
          icon='pi pi-save'
          className='p-button-success'
        />
      </div>
    </div>
  );
};

export default PlatformForm;
