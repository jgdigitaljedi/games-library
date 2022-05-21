import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext,
  MouseEventHandler
} from 'react';
import { IConsole, IConUserFields } from '@/models/platforms.model';
import { InputText } from 'primereact/inputtext';
import { handleChange, handleDropdownFn } from '@/services/forms.service';
import helpersService, { platformsCompany } from '../../../services/helpers.service';
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
  igdbUpdatePlatformById,
  savePlatform
} from '@/services/platformsCrud.service';
import PcPriceComponent from '../PcPriceComponent/PcPriceComponent';
import PcPriceDetailsComponent from '../PcPriceDetails/PcPriceDetailsComponent';
import { formatFormResult, formatUpdateData, getPriceById } from '@/services/pricecharting.service';
import { IPriceChartingData } from '@/models/pricecharting.model';

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

  const companies = platformsCompany;

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

  const getUserFields = (): IConUserFields => {
    return {
      box: platformForm?.box,
      condition: platformForm?.condition,
      createdAt: platformForm?.createdAt,
      datePurchased: platformForm?.datePurchased,
      newDatePurchased: platformForm?.newDatePurchased,
      ghostConsole: platformForm?.ghostConsole,
      howAcquired: platformForm?.howAcquired,
      manual: platformForm?.manual,
      mods: platformForm?.mods,
      notes: platformForm?.notes,
      priceCharting: platformForm?.priceCharting,
      pricePaid: platformForm?.pricePaid,
      updatedAt: platformForm?.updatedAt,
      storage: platformForm?.storage
    };
  };

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
    const userFields = getUserFields();
    const formattedPlatform = formatNewPlatformForSave(fullPlatform, userFields);
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

  const setPricechartingData = (data: IPriceChartingData) => {
    if (platformForm) {
      const updatedGame = { ...platformForm, priceCharting: data };
      setPlatformForm(updatedGame);
    }
  };

  const updatePcData = async (e: MouseEventHandler<HTMLButtonElement>) => {
    // @ts-ignore
    e.preventDefault();
    if (platformForm?.priceCharting?.id) {
      const newData = await getPriceById(platformForm?.priceCharting?.id);
      const formatted = formatUpdateData(
        newData.data,
        platformForm.priceCharting,
        platformForm.manual
      );
      setPlatformForm({ ...platformForm, priceCharting: formatted });
    }
  };

  const caseManuallyChanged = useCallback(
    value => {
      if (platformForm?.priceCharting && value) {
        const gfCopy = _cloneDeep(platformForm);
        // @ts-ignore
        gfCopy.priceCharting.case = value;
        setPlatformForm(gfCopy);
      }
    },
    [platformForm]
  );

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

  const updateIgdbPlatformData = (e: MouseEventHandler<HTMLButtonElement>) => {
    // @ts-ignore
    e.preventDefault();
    igdbUpdatePlatformById(platform)
      .then(result => {
        console.log(
          'new Date(platformForm.datePurchased)',
          platformForm?.datePurchased ? new Date(platformForm?.datePurchased) : 'no  date'
        );
        if (result?.data) {
          const userFields = getUserFields();
          setPlatformForm({ ...result.data, ...userFields });
        } else {
          setNotify({
            severity: 'error',
            detail: 'Error updating IGDB data (empty response).',
            summary: 'ERROR'
          });
        }
      })
      .catch(error => {
        setNotify({
          severity: 'error',
          detail: 'Error fetching platforms with ids.',
          summary: 'ERROR'
        });
        console.log('update platform error', error);
      });
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
          <h3>Data from IGDB</h3>
          {!addMode && (
            <div className='crud-form--form__row'>
              <Button
                // @ts-ignore
                onClick={updateIgdbPlatformData}
                label='Update IGDB Data'
                className='p-button-primary'
                icon='pi pi-arrow-circle-up'
              />
            </div>
          )}
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
            <label htmlFor='company'>Company</label>
            <Dropdown
              value={platformForm?.company}
              options={companies}
              onChange={e => handleDropdown(e, 'company')}
              attr-which='company'
              id='company'
            />
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
          <div className='divider'>
            <hr />
            <h3>PriceCharting Data</h3>
          </div>
          {platformForm?.priceCharting && (
            <div className='crud-form--form__row'>
              <Button
                // @ts-ignore
                onClick={updatePcData}
                label='Update PriceCharting Data'
                disabled={!platformForm?.priceCharting?.id}
                className='p-button-primary'
              />
            </div>
          )}
          <div className='crud-form--form__row'>
            <label htmlFor='pc-input'>Price Charting</label>
            <PcPriceComponent
              data-id='pc-input'
              item={formatFormResult(platformForm as IConsole, 'CONSOLE')}
              onSelectionMade={setPricechartingData}
            />
          </div>
          {/** eslint-disable-next-line */}
          {platformForm?.priceCharting && (
            <PcPriceDetailsComponent
              pcData={platformForm?.priceCharting}
              caseChangeCb={caseManuallyChanged}
            />
          )}
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
