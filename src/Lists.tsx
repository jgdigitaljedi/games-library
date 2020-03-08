import React, { FunctionComponent, useCallback, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import { IGame } from './common.model';
import { Dropdown } from 'primereact/dropdown';
import GameCard from './components/GameCard/GameCard';
import GameDialog from './components/GameDialog/GameDialog';
import { Dialog } from 'primereact/dialog';

const Lists: FunctionComponent<RouteComponentProps> = () => {
  const lists = [
    { label: 'Platform Exclusives', value: 'exclusives' },
    { label: 'Games with extra data', value: 'extraData' },
    { label: 'Platform Launch Titles', value: 'launch' },
    { label: 'Multiplayer with adapters', value: 'multiplayer' },
    { label: 'Special games', value: 'special' }
  ];
  const [whichList, setWhichList]: [string, any] = useState(lists[0].value);
  const [data, setData]: [IGame[], any] = useState([]);
  const [selectedGame, setSelectedGame]: [IGame | null, any] = useState(null);
  const [showModal, setShowModal]: [boolean, any] = useState(false);

  const cardClicked = (game: IGame) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const getList = useCallback(which => {
    setWhichList(which);
    Axios.post('http://localhost:4001/api/lists', { which })
      .then(result => {
        if (result && result.data) {
          setData(result.data);
        }
      })
      .catch(error => {
        if (error) {
        }
      });
  }, []);

  useEffect(() => {
    getList(whichList);
  }, []);

  return (
    <div className="lists">
      <div className="lists-head">
        <label>Select a list:</label>
        <Dropdown value={whichList} onChange={e => getList(e.value)} options={lists} />
      </div>
      <div className="list-container">
        {data.map((d, index) => {
          return (
            <GameCard
              data={d}
              key={`${index}-${d?.igdb?.name || 'game'}`}
              cardClicked={cardClicked}
            />
          );
        })}
      </div>
      <Dialog
        visible={showModal}
        header={selectedGame ? selectedGame['igdb']['name'] : ''}
        modal={true}
        closeOnEscape={true}
        dismissableMask={true}
        onHide={() => {
          setSelectedGame(null);
          setShowModal(false);
        }}
      >
        <GameDialog game={selectedGame} />
      </Dialog>
    </div>
  );
};

export default Lists;
