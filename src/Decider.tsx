import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

interface IFormState {
  name: string;
  players: number | null;
  wireless: string | null;
  location: string | null;
  hd: string | null;
  genre: string | null;
  esrb: string | null;
}

const Decider: FunctionComponent<RouteComponentProps> = () => {
  const [formState, setFormState]: [IFormState, any] = useState({
    name: '',
    players: null,
    wireless: null,
    location: null,
    hd: null,
    genre: null,
    esrb: null
  });
  const [masterData, setMasterData]: [object[], any] = useState([{}]);
  const [data, setData]: [object[], any] = useState([{}]);

  async function getData() {
    const result = await axios.get('http://localhost:4001/api/games');
    if (result && result.data) {
      setData(result.data);
      setMasterData(result.data);
    }
  }

  if (!masterData || !masterData.length) {
    getData();
  }

  function filterResults() {}

  return (
    <section className="decider">
      <form className="decider--form">
        <div className="decider--form__input-group">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={formState.name}
            onChange={e => {
              const target = e.target as HTMLInputElement;
              setFormState({ name: target.value });
              filterResults();
            }}
          />
        </div>
      </form>
      <div className="decider--results"></div>
    </section>
  );
};

export default Decider;
