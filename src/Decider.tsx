import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import flatten from 'lodash/flatten';

interface IFormState {
  name: string;
  players: number;
  wireless: number;
  // location: string | null;
  hd: number;
  genre: string;
  esrb: string;
}

const Decider: FunctionComponent<RouteComponentProps> = () => {
  const [formState, setFormState]: [IFormState, any] = useState({
    name: '',
    players: 0,
    wireless: 0,
    // location: null,
    hd: 0,
    genre: '',
    esrb: ''
  });
  const [masterData, setMasterData]: [any[], any] = useState([{}]);
  const [data, setData]: [any[], any] = useState([{}]);
  const [genreArray, setGenreArray]: [string[], any] = useState([]);
  const [esrbArray, setEsrbArray]: [string[], any] = useState([]);

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
      setEsrbArray(newRatings);
      console.log('esrb', esrbArray);
    }
  }

  function filterResults() {
    // getGenreArray();
    // getEsrbArray();
  }

  return (
    <section className="decider">
      <form className="decider--form">
        <div className="decider--form__input-group">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={formState.name || ''}
            onChange={e => {
              const target = e.target as HTMLInputElement;
              setFormState({ name: target.value });
              filterResults();
            }}
          />
        </div>
        <div className="decider--form__input-group">
          <label htmlFor="players">Min # Players</label>
          <InputText
            type="number"
            id="players"
            value={formState.players || ''}
            onChange={e => {
              const target = e.target as HTMLInputElement;
              setFormState({ players: target.value });
              filterResults();
            }}
          />
        </div>
        <div className="decider--form__input-group stack">
          <div>
            <RadioButton
              inputId="wireless"
              name="wireless"
              value={1}
              onChange={e => {
                setFormState({ wireless: 1 });
                filterResults();
              }}
              checked={formState.wireless === 1}
            />
            <label htmlFor="wireless" className="p-radiobutton-label">
              Wireless Controllers
            </label>
          </div>
          <div>
            <RadioButton
              inputId="wired"
              name="wired"
              value={2}
              onChange={e => {
                setFormState({ wireless: 2 });
                filterResults();
              }}
              checked={formState.wireless === 2}
            />
            <label htmlFor="wired" className="p-radiobutton-label">
              Wired Controllers
            </label>
          </div>
          <div>
            <RadioButton
              inputId="nomatter"
              name="nomatter"
              value={0}
              onChange={e => {
                setFormState({ wireless: 0 });
                filterResults();
              }}
              checked={formState.wireless === 0}
            />
            <label htmlFor="nomatter" className="p-radiobutton-label">
              No Preference
            </label>
          </div>
        </div>
        <div className="decider--form__input-group">
          <label htmlFor="genre">Genre</label>
          <Dropdown
            id="genre"
            name="genre"
            value={formState.genre || ''}
            onChange={e => {
              setFormState({ genre: e.value });
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
              setFormState({ esrb: e.value });
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
