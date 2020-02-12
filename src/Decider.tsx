import React, { FunctionComponent, useState, useEffect, FormEvent, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { AutoComplete } from 'primereact/autocomplete';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { filters } from './services/deciderFiltering.service';
import debounce from 'lodash/debounce';
import GameCard from './components/GameCard/GameCard';
import { Dialog } from 'primereact/dialog';
import { IGame } from './common.model';
import GameDialog from './components/GameDialog/GameDialog';

interface IFormState {
  name: string;
  players: number;
  genre: string;
  esrb: string;
  platform: string;
  everDrive: boolean;
}

interface IDropdown {
  label: string;
  value: string;
}

interface IAutoCompleteData {
  originalEvent: Event;
  query: string;
}

const Decider: FunctionComponent<RouteComponentProps> = () => {
  const [formState, setFormState]: [IFormState, any] = useState({
    name: '',
    players: 0,
    genre: '',
    esrb: '',
    platform: '',
    everDrive: false
  });
  const [masterData, setMasterData]: [any[], any] = useState([{}]);
  const [data, setData]: [any[], any] = useState([{}]);
  const [genreArray, setGenreArray]: [IDropdown[], any] = useState([
    { label: 'NOT SET', value: '' }
  ]);
  const [esrbArray, setEsrbArray]: [IDropdown[], any] = useState([{ label: 'NOT SET', value: '' }]);
  const [platformArray, setPlatformArray]: [IDropdown[], any] = useState([
    { label: 'NOT SET', value: '' }
  ]);
  const [filteredPlatforms, setFilteredPlatforms]: [IDropdown[], any] = useState([
    { label: 'NOT SET', value: '' }
  ]);
  const [nameStr, setNameStr]: [string, any] = useState('');
  const [selectedCard, setSelectedCard]: [IGame | null, any] = useState(null);
  const [showModal, setShowModal]: [boolean, any] = useState(false);
  const [acValue, setAcValue]: [string, any] = useState('');

  const getData = useCallback(async (ed?: boolean) => {
    const result = await axios.post('http://localhost:4001/api/gamescombined', {
      everDrive: ed
    });
    if (result && result.data) {
      setData(result.data);
      setMasterData(result.data);
    }
  }, []);

  const checkForReset = useCallback(() => {
    const keys = Object.entries(formState);
    return keys.filter(([key, value]) => value && value !== '').length === 0;
  }, [formState]);

  const getGenreArray = useCallback(() => {
    if (data && data.length > 1) {
      const newGenres = flatten(data.map(d => d.igdb.genres || null).filter((d: string) => d))
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
        });
      newGenres.unshift({ label: 'NOT SET', value: '' });
      setGenreArray(newGenres);
    }
  }, [data, setGenreArray]);

  const getPlatformArray = useCallback(() => {
    if (data && data.length > 1) {
      const newPlatforms = flatten(data.map(d => d.consoleName || null).filter((d: string) => d))
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
        })
        .sort();
      newPlatforms.unshift({ label: 'NOT SET', value: '' });
      setPlatformArray(sortBy(newPlatforms, 'label'));
      setFilteredPlatforms(cloneDeep(sortBy(newPlatforms, 'label')));
    }
  }, [data, setPlatformArray]);

  const getEsrbArray = useCallback(() => {
    if (data && data.length > 1) {
      const newRatings = flatten(data.map(d => d.igdb.esrb || null).filter((d: string) => d))
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
        });
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

  const cardClicked = useCallback((card: IGame) => {
    setSelectedCard(card);
    setShowModal(true);
  }, []);

  useEffect(() => {
    if (!masterData || masterData.length === 1) {
      getData();
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
    console.log('text', data);
    console.log('platformArray', platformArray);
    if (data.query && data.query.length) {
      const query = data.query.toLowerCase().trim();
      const filteredPlatforms = cloneDeep(platformArray).filter(p => {
        return p.label.toLowerCase().indexOf(query) >= 0;
      });
      console.log('filtered', filteredPlatforms);
      setFilteredPlatforms(filteredPlatforms);
    } else {
      setFilteredPlatforms(cloneDeep(platformArray));
    }
  };

  const acKeyUp = (e: any) => {
    console.log('key', e.keyCode);
    if (e.keyCode === 8) { // backspace
      console.log('key val', acValue);
    }
  };
  /* <Dropdown
            id="platform"
            name="platform"
            value={formState.platform}
            onChange={e => {
              const fsCopy = cloneDeep(formState);
              fsCopy.platform = e.value;
              setFormState(fsCopy);
            }}
            options={platformArray || []}
          /> */

  return (
    <section className="decider">
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
              setFilteredPlatforms(cloneDeep(platformArray));
            }}
            onChange={e => {
              setAcValue(e.value);
            }}
            onSelect={e => {
              console.log('e', e);
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
              getData(e.value);
            }}
          />
        </div>
      </form>
      <div className="decider--counter">
        <h3>{data.length} games</h3>
      </div>
      <div className="decider--results">
        {data.map((d, index) => (
          <GameCard data={d} key={index} cardClicked={cardClicked} />
        ))}
      </div>
      <Dialog
        visible={showModal}
        header={selectedCard ? selectedCard['igdb']['name'] : ''}
        modal={true}
        closeOnEscape={true}
        dismissableMask={true}
        onHide={() => {
          setSelectedCard(null);
          setShowModal(false);
        }}
      >
        {/* Modal {selectedCard ? selectedCard['igdb']['name'] : ""} */}
        <GameDialog game={selectedCard} />
      </Dialog>
    </section>
  );
};

export default Decider;
