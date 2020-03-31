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
import { IGame, IDropdown, IFormState } from '../../../common.model';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import debounce from 'lodash/debounce';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { AutoComplete } from 'primereact/autocomplete';
import { DataContext } from '../../../context/DataContext';

interface IAutoCompleteData {
  originalEvent: Event;
  query: string;
}

interface IProps extends RouteComponentProps {
  data: IGame[];
}

const FilterBar: FunctionComponent<IProps> = ({ data }: IProps) => {
  const [dc, setDc]: [IFormState, Dispatch<SetStateAction<IFormState>>] = useContext(DataContext);
  const masterData: IGame[] = data;
  const [genreArray, setGenreArray] = useState<IDropdown[]>([{ label: 'NOT SET', value: '' }]);
  const [esrbArray, setEsrbArray] = useState<IDropdown[]>([{ label: 'NOT SET', value: '' }]);
  const [filteredPlatforms, setFilteredPlatforms] = useState<IDropdown[]>([
    { label: 'NOT SET', value: '' }
  ]);
  const [masterPa, setMasterPa] = useState<IDropdown[]>([{ label: 'NOT SET', value: '' }]);
  const [nameStr, setNameStr] = useState<string>('');
  const [acValue, setAcValue] = useState<string>('');

  const getGenreArray = useCallback((): void => {
    if (masterData && masterData.length > 1) {
      const newGenres = sortBy(
        flatten(masterData.map(d => d.igdb.genres || null).filter((d: any) => d))
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

  const getPlatformArray = useCallback((): void => {
    if (masterData && masterData.length > 1) {
      const newPlatforms = sortBy(
        flatten(masterData.map(d => d.consoleName || null).filter((d: any) => d))
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
      newPlatforms.unshift({ label: 'NOT SET', value: '' });
      setFilteredPlatforms(newPlatforms);
      setMasterPa(newPlatforms);
    }
  }, [masterData, setMasterPa]);

  const getEsrbArray = useCallback((): void => {
    if (masterData && masterData.length > 1) {
      const newRatings = sortBy(
        flatten(masterData.map(d => d.igdb.esrb || null).filter((d: any) => d))
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

  useEffect((): void => {
    if (masterData && masterData.length > 1) {
      getGenreArray();
      getEsrbArray();
      if (!filteredPlatforms || filteredPlatforms.length === 1) {
        getPlatformArray();
      }
    }
  }, [masterData, getGenreArray, getEsrbArray, getPlatformArray, filteredPlatforms]);

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

  const autoCompletePlatform = (data: IAutoCompleteData): void => {
    if (data.query && data.query.length) {
      const query = data.query.toLowerCase().trim();
      const filteredPlatforms = cloneDeep(masterPa).filter(p => {
        return p.label.toLowerCase().indexOf(query) >= 0;
      });
      setFilteredPlatforms(filteredPlatforms);
    } else {
      setFilteredPlatforms(cloneDeep(masterPa));
    }
  };

  const acKeyUp = (e: any): void => {
    if (e.keyCode === 8) {
      // backspace
      autoCompletePlatform({ originalEvent: e, query: acValue });
      if (!acValue) {
        const fsCopy = cloneDeep(dc);
        fsCopy.platform = '';
        setDc(fsCopy);
        setFilteredPlatforms(cloneDeep(masterPa));
      }
    }
  };

  return (
    <form className="decider--form">
      <div className="decider--form__input-group">
        <label htmlFor="name">Name</label>
        <InputText id="name" value={nameStr} onChange={handleChange} />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="players">Min # Players</label>
        <InputText
          type="number"
          id="players"
          value={dc.players || ''}
          onChange={e => {
            const target = e.target as HTMLInputElement;
            const fsCopy = Object.assign({}, dc);
            fsCopy.players = target.value ? parseInt(target.value) : 0;
            setDc(fsCopy);
          }}
          style={{ width: '7rem' }}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="platform">Platform</label>
        <AutoComplete
          id="platform"
          name="platform"
          value={acValue}
          dropdown={true}
          suggestions={filteredPlatforms || []}
          field="label"
          completeMethod={autoCompletePlatform}
          onClear={e => {
            setFilteredPlatforms(cloneDeep(masterPa));
          }}
          onChange={e => {
            setAcValue(e.value);
          }}
          onSelect={e => {
            const fsCopy = cloneDeep(dc);
            fsCopy.platform = e.value.value;
            setAcValue(e.value.value);
            setDc(fsCopy);
          }}
          onKeyUp={acKeyUp}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="genre">Genre</label>
        <Dropdown
          id="genre"
          name="genre"
          value={dc.genre}
          onChange={e => {
            const fsCopy = cloneDeep(dc);
            fsCopy.genre = e.value;
            setDc(fsCopy);
          }}
          options={genreArray || []}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="esrb">ESRB Rating</label>
        <Dropdown
          id="esrb"
          name="esrb"
          value={dc.esrb}
          onChange={e => {
            const fsCopy = Object.assign({}, dc);
            fsCopy.esrb = e.value;
            setDc(fsCopy);
          }}
          options={esrbArray || []}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="physical">Physical only?</label>
        <InputSwitch
          checked={dc.physical}
          onChange={e => {
            const fsCopy = { ...dc };
            fsCopy.physical = !!e.value;
            setDc(fsCopy);
          }}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="everdrive">EverDrives?</label>
        <InputSwitch
          checked={dc.everDrive}
          onChange={e => {
            const fsCopy = { ...dc };
            fsCopy.everDrive = !!e.value;
            setDc(fsCopy);
          }}
        />
      </div>
    </form>
  );
};

export default FilterBar;
