import React, {
  FunctionComponent,
  useState,
  useCallback,
  useEffect,
  FormEvent,
  useContext,
  Dispatch,
  SetStateAction
} from 'react';
import { RouteComponentProps } from '@reach/router';
import { IDropdown, IFormState } from '@/models/common.model';
import { IGame } from '@/models/games.model';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import debounce from 'lodash/debounce';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { DataContext } from '@/context/DataContext';
import changePlatformsArr from '../../../actionCreators/platformsArr';
import { connect, useSelector } from 'react-redux';
import { Dispatch as ReduxDispatch } from 'redux';
import { MultiSelect } from 'primereact/multiselect';

interface MapStateProps {
  platformsArr: IDropdown[];
}

interface MapDispatchProps {
  setPlatformsArr: (platformsArr: IDropdown[]) => void;
}

interface IProps extends RouteComponentProps, MapDispatchProps, MapStateProps {
  data: IGame[];
}

const FilterBar: FunctionComponent<IProps> = ({ data }: IProps) => {
  const [dc, setDc]: [IFormState, Dispatch<SetStateAction<IFormState>>] = useContext(DataContext);
  const masterData: IGame[] = data;
  const [genreArray, setGenreArray] = useState<IDropdown[]>([{ label: 'NOT SET', value: '' }]);
  const [esrbArray, setEsrbArray] = useState<IDropdown[]>([{ label: 'NOT SET', value: '' }]);
  const [filteredPlatforms, setFilteredPlatforms] = useState<IDropdown[]>([]);
  // const [masterPa, setMasterPa] = useState<IDropdown[]>([{ label: 'NOT SET', value: '' }]);
  const [nameStr, setNameStr] = useState<string>('');
  const [acValue, setAcValue] = useState<string>('');
  const masterPa: IDropdown[] = useSelector((state: any) => state.platformsArr);

  const locationArr = [
    { label: 'No Preference', value: null },
    { label: 'Upstairs', value: 'upstairs' },
    { label: 'Downstairs', value: 'downstairs' },
    { label: 'Both/Either', value: 'both' }
  ];

  const handheldArr = [
    { label: 'Show All', value: 'show' },
    { label: 'Hide Handhelds', value: 'hide' },
    { label: 'Show Handhelds Only', value: 'only' }
  ];

  const getGenreArray = useCallback((): void => {
    if (masterData && masterData.length > 1) {
      const newGenres = sortBy(
        flatten(masterData.map((d) => d?.genres || []).filter((d: any) => d))
          .reduce((acc: string[], g: string) => {
            if (!acc) {
              acc = [];
            }
            if (acc && acc.indexOf(g) === -1 && g) {
              acc.push(g);
            }
            return acc;
          }, [])
          .map((g: string) => {
            return { label: g, value: g };
          }),
        'label'
      );
      newGenres.unshift({ label: 'NOT SET', value: '' });
      setGenreArray(newGenres);
    }
  }, [masterData, setGenreArray]);

  const getEsrbArray = useCallback((): void => {
    if (masterData && masterData.length > 1) {
      const newRatings = sortBy(
        flatten(masterData.map((d) => d.esrb || null).filter((d: any) => d))
          .reduce((acc: string[], g: any) => {
            if (!acc) {
              acc = [];
            }
            if (acc && acc.indexOf(g) === -1 && g) {
              acc.push(g);
            }
            return acc;
          }, [])
          .map((g: string) => {
            return { label: g, value: g };
          }),
        'label'
      );
      newRatings.unshift({ label: 'NOT SET', value: '' });
      setEsrbArray(newRatings);
    }
  }, [masterData, setEsrbArray]);

  const templateLogic = (value: string, collection: any, placeholder: string) => {
    if (!collection || !collection.length) {
      return <span>{placeholder}</span>;
    } else if (collection?.length === 1 || (collection.length > 1 && value === collection[0])) {
      return <span>{collection[0]}</span>;
    } else if (collection.length > 1 && value === collection[collection.length - 1]) {
      return <span>...({collection.length})</span>;
    } else {
      return <></>;
    }
  };

  const selectedItemTemplate = (value: string) => {
    return templateLogic(value, acValue, 'Select platform(s)');
  };

  const selectedGenreTemplate = (value: string) => {
    return templateLogic(value, dc.genre, 'Select genre(s)');
  };

  useEffect((): void => {
    if (masterData && masterData.length > 1) {
      getGenreArray();
      getEsrbArray();
    }
    setFilteredPlatforms(masterPa);
  }, [masterData, getGenreArray, getEsrbArray, masterPa]);

  const debounceFiltering = useCallback(
    debounce((value: string): void => {
      const fsCopy = Object.assign({}, dc);
      fsCopy.name = value;
      setDc(fsCopy);
    }, 500),
    [dc]
  );

  const handleChange = (e: FormEvent<any>): void => {
    const target = e.target as HTMLInputElement;
    setNameStr(target.value);
    debounceFiltering(target.value);
  };

  return (
    <form className="decider--form">
      <div className="decider--form__input-group">
        <label htmlFor="name" className="info-text">
          Name
        </label>
        <InputText id="name" value={nameStr} onChange={handleChange} className="info-text" />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="players" className="info-text">
          Min # Players
        </label>
        <InputText
          className="info-text"
          type="number"
          id="players"
          value={dc.players || ''}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const fsCopy = Object.assign({}, dc);
            fsCopy.players = target.value ? parseInt(target.value) : 0;
            setDc(fsCopy);
          }}
          style={{ width: '7rem' }}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="platform" className="info-text">
          Platform
        </label>
        <MultiSelect
          value={acValue}
          options={filteredPlatforms}
          optionLabel="label"
          onChange={(e) => {
            setAcValue(e.value);
            const fsCopy = cloneDeep(dc);
            fsCopy.platform = e.value;
            setDc(fsCopy);
          }}
          filter
          name="platform"
          id="platform"
          maxSelectedLabels={30}
          placeholder="Select a platform"
          selectedItemTemplate={selectedItemTemplate}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="genre" className="info-text">
          Genre
        </label>
        <MultiSelect
          value={dc.genre}
          options={genreArray}
          optionLabel="label"
          onChange={(e) => {
            const fsCopy = cloneDeep(dc);
            fsCopy.genre = e.value;
            setDc(fsCopy);
          }}
          name="genre"
          id="genre"
          filter
          maxSelectedLabels={30}
          placeholder="Select a genre"
          selectedItemTemplate={selectedGenreTemplate}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="esrb" className="info-text">
          ESRB Rating
        </label>
        <Dropdown
          className="info-text"
          id="esrb"
          name="esrb"
          value={dc.esrb}
          onChange={(e) => {
            const fsCopy = Object.assign({}, dc);
            fsCopy.esrb = e.value;
            setDc(fsCopy);
          }}
          options={esrbArray || []}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="physical" className="info-text">
          Physical only?
        </label>
        <InputSwitch
          checked={dc.physical}
          onChange={(e) => {
            const fsCopy = { ...dc };
            fsCopy.physical = !!e.value;
            setDc(fsCopy);
          }}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="everdrive" className="info-text">
          EverDrives?
        </label>
        <InputSwitch
          checked={dc.everDrive}
          onChange={(e) => {
            const fsCopy = { ...dc };
            fsCopy.everDrive = !!e.value;
            setDc(fsCopy);
          }}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="handhelds" className="info-text">
          Handhelds
        </label>
        <Dropdown
          className="info-text"
          id="handheld"
          name="handheld"
          value={dc.handheld}
          onChange={(e) => {
            const fsCopy = Object.assign({}, dc);
            fsCopy.handheld = e.value;
            setDc(fsCopy);
          }}
          options={handheldArr || []}
        />
      </div>

      <div className="decider--form__input-group">
        <label htmlFor="esrb" className="info-text">
          Location
        </label>
        <Dropdown
          className="info-text"
          id="location"
          name="location"
          value={dc.location}
          onChange={(e) => {
            const fsCopy = Object.assign({}, dc);
            fsCopy.location = e.value;
            setDc(fsCopy);
          }}
          options={locationArr || []}
        />
      </div>
    </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
