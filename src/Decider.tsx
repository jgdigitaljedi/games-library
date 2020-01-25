import React, { FunctionComponent, useState, useEffect, FormEvent, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import { filters } from './services/deciderFiltering.service';
import debounce from 'lodash/debounce';

interface IFormState {
  name: string;
  players: number;
  genre: string;
  esrb: string;
}

interface IDropdown {
  label: string;
  value: string;
}

const Decider: FunctionComponent<RouteComponentProps> = () => {
  const [formState, setFormState]: [IFormState, any] = useState({
    name: '',
    players: 0,
    genre: '',
    esrb: ''
  });
  const [masterData, setMasterData]: [any[], any] = useState([{}]);
  const [data, setData]: [any[], any] = useState([{}]);
  const [genreArray, setGenreArray]: [IDropdown[], any] = useState([
    { label: 'NOT SET', value: '' }
  ]);
  const [esrbArray, setEsrbArray]: [IDropdown[], any] = useState([{ label: 'NOT SET', value: '' }]);
  const [nameStr, setNameStr]: [string, any] = useState('');

  async function getData() {
    const result = await axios.get('http://localhost:4001/api/games');
    if (result && result.data) {
      setData(result.data);
      setMasterData(result.data);
    }
  }
  useEffect(() => {
    if (!masterData || masterData.length === 1) {
      getData();
      getGenreArray();
      getEsrbArray();
    }
  });

  function getGenreArray() {
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
  }

  function getEsrbArray() {
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
  }

  function checkForReset() {
    const keys = Object.entries(formState);
    return keys.filter(([key, value]) => value && value !== '').length === 0;
  }

  function filterResults() {
    if (checkForReset()) {
      setData(masterData);
      return;
    }
    console.log('formState', formState);
    let newData = cloneDeep(masterData);
    if (formState.name !== '') {
      newData = filters.filterName([...newData], formState.name);
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
    console.log('data', data);
    getGenreArray();
    getEsrbArray();
  }

  const debounceFiltering = useCallback(
    debounce((value: string): void => {
      const fsCopy = Object.assign({}, formState);
      fsCopy.name = value;
      setFormState(fsCopy);
      filterResults();
      console.log('value', value);
    }, 500),
    [formState]
  );

  const handleChange = (e: FormEvent<any>): void => {
    const target = e.target as HTMLInputElement;
    setNameStr(target.value);
    debounceFiltering(target.value);
  };

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
              filterResults();
            }}
          />
        </div>
        <div className="decider--form__input-group">
          <label htmlFor="genre">Genre</label>
          <Dropdown
            id="genre"
            name="genre"
            value={formState.genre || ''}
            onChange={e => {
              console.log('e', e);
              const fsCopy = cloneDeep(formState);
              fsCopy.genre = e.value;
              console.log('target.value', e.value);
              setFormState(fsCopy);
              filterResults();
            }}
            options={genreArray || []}
          />
        </div>
        <div className="decider--form__input-group">
          <label htmlFor="esrb">ESRB Rating</label>
          <Dropdown
            id="esrb"
            name="esrb"
            value={formState.esrb || ''}
            onChange={e => {
              const fsCopy = Object.assign({}, formState);
              fsCopy.esrb = e.value;
              setFormState(fsCopy);
              filterResults();
            }}
            options={esrbArray || []}
          />
        </div>
      </form>
      <div className="decider--results"></div>
    </section>
  );
};

export default Decider;
