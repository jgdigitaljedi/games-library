import React, { FunctionComponent, useState, useCallback, useEffect, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { IGame, IFormState } from '../../../common.model';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { filters } from '../../../services/deciderFiltering.service';
import debounce from 'lodash/debounce';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { AutoComplete } from 'primereact/autocomplete';

interface IDropdown {
  label: string;
  value: string;
}

interface IAutoCompleteData {
  originalEvent: Event;
  query: string;
}

interface IProps extends RouteComponentProps {
  data: IGame[];
}

const FilterBar: FunctionComponent<IProps> = (props: IProps) => {
  const [formState, setFormState]: [IFormState, any] = useState({
    name: '',
    players: 0,
    genre: '',
    esrb: '',
    platform: '',
    everDrive: false
  });
  const masterData = props.data;

  const [data, setData]: [any[], any] = useState(masterData);
  const [genreArray, setGenreArray]: [IDropdown[], any] = useState([
    { label: 'NOT SET', value: '' }
  ]);
  const [esrbArray, setEsrbArray]: [IDropdown[], any] = useState([{ label: 'NOT SET', value: '' }]);
  const [filteredPlatforms, setFilteredPlatforms]: [IDropdown[], any] = useState([
    { label: 'NOT SET', value: '' }
  ]);
  const [masterPa, setMasterPa]: [IDropdown[], any] = useState([{ label: 'NOT SET', value: '' }]);
  const [nameStr, setNameStr]: [string, any] = useState('');
  const [acValue, setAcValue]: [string, any] = useState('');

  const checkForReset = useCallback(() => {
    const keys = Object.entries(formState);
    return keys.filter(([key, value]) => value && value !== '').length === 0;
  }, [formState]);

  const getGenreArray = useCallback(() => {
    if (data && data.length > 1) {
      const newGenres = sortBy(
        flatten(data.map(d => d.igdb.genres || null).filter((d: string) => d))
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
  }, [data, setGenreArray]);

  const getPlatformArray = useCallback(() => {
    if (data && data.length > 1) {
      const newPlatforms = sortBy(
        flatten(data.map(d => d.consoleName || null).filter((d: string) => d))
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
      newPlatforms.unshift({ label: 'NOT SET', value: '' });
      setFilteredPlatforms(newPlatforms);
      setMasterPa(newPlatforms);
    }
  }, [data, setMasterPa]);

  const getEsrbArray = useCallback(() => {
    if (data && data.length > 1) {
      const newRatings = sortBy(
        flatten(data.map(d => d.igdb.esrb || null).filter((d: string) => d))
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
      newRatings.unshift({ label: 'NOT SET', value: '' });
      setEsrbArray(newRatings);
    }
  }, [data, setEsrbArray]);

  const filterResults = useCallback(() => {
    if (checkForReset()) {
      setData(masterData);
      return;
    }
    let newData = cloneDeep(masterData);
    if (formState.name !== '') {
      newData = filters.filterName([...newData], formState.name);
    }
    if (formState.platform !== '') {
      newData = filters.filterPlatform([...newData], formState.platform);
    }
    if (formState.players !== 0) {
      newData = filters.filterPlayers([...newData], formState.players);
    }
    if (formState.genre !== '') {
      newData = filters.filterGenre([...newData], formState.genre);
    }
    if (formState.esrb !== '') {
      newData = filters.filterEsrb([...newData], formState.esrb);
    }
    setData(newData);
  }, [masterData, checkForReset, formState]);

  useEffect(() => {
    if (!masterData || masterData.length === 1) {
      getGenreArray();
      getEsrbArray();
      getPlatformArray();
    }
  });

  useEffect(() => {
    getGenreArray();
    getEsrbArray();
    getPlatformArray();
  }, [data, getGenreArray, getEsrbArray, getPlatformArray]);

  useEffect(() => {
    filterResults();
  }, [formState, filterResults]);

  const debounceFiltering = useCallback(
    debounce((value: string): void => {
      const fsCopy = Object.assign({}, formState);
      fsCopy.name = value;
      setFormState(fsCopy);
    }, 500),
    [formState]
  );

  const handleChange = (e: FormEvent<any>): void => {
    const target = e.target as HTMLInputElement;
    setNameStr(target.value);
    debounceFiltering(target.value);
  };

  const autoCompletePlatform = (data: IAutoCompleteData) => {
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

  const acKeyUp = (e: any) => {
    if (e.keyCode === 8) {
      // backspace
      autoCompletePlatform({ originalEvent: e, query: acValue });
      if (!acValue) {
        const fsCopy = cloneDeep(formState);
        fsCopy.platform = '';
        setFormState(fsCopy);
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
          value={formState.players || ''}
          onChange={e => {
            const target = e.target as HTMLInputElement;
            const fsCopy = Object.assign({}, formState);
            fsCopy.players = target.value ? parseInt(target.value) : 0;
            setFormState(fsCopy);
          }}
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
            const fsCopy = cloneDeep(formState);
            fsCopy.platform = e.value.value;
            setAcValue(e.value.value);
            setFormState(fsCopy);
          }}
          onKeyUp={acKeyUp}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="genre">Genre</label>
        <Dropdown
          id="genre"
          name="genre"
          value={formState.genre}
          onChange={e => {
            const fsCopy = cloneDeep(formState);
            fsCopy.genre = e.value;
            setFormState(fsCopy);
          }}
          options={genreArray || []}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="esrb">ESRB Rating</label>
        <Dropdown
          id="esrb"
          name="esrb"
          value={formState.esrb}
          onChange={e => {
            const fsCopy = Object.assign({}, formState);
            fsCopy.esrb = e.value;
            setFormState(fsCopy);
          }}
          options={esrbArray || []}
        />
      </div>
      <div className="decider--form__input-group">
        <label htmlFor="everdrive">Include EverDrives?</label>
        <InputSwitch
          checked={formState.everDrive}
          onChange={e => {
            const fsCopy = Object.assign({}, formState);
            fsCopy.everDrive = e.value;
            setFormState(fsCopy);
            // getData(e.value);
          }}
        />
      </div>
    </form>
  );
};

export default FilterBar;
