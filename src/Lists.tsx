import React, { FunctionComponent, useCallback, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import { IGame } from './common.model';
import { Dropdown } from 'primereact/dropdown';
import GameCard from './components/GameCard/GameCard';
import GameDialog from './components/GameDialog/GameDialog';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import ListView from './components/ListView/ListView';
import { sortBy as _sortBy } from 'lodash';

const Lists: FunctionComponent<RouteComponentProps> = () => {
  const lists = [
    { label: 'Platform Exclusives', value: 'exclusives' },
    // { label: 'Games with extra data', value: 'extraData' },
    { label: 'Platform Launch Titles', value: 'launch' },
    { label: 'Multiplayer party games', value: 'multiplayer' },
    { label: 'Special games', value: 'special' }
  ];
  const [whichList, setWhichList] = useState<string>(lists[0].value);
  const [data, setData] = useState<IGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<IGame | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cardView, setCardView] = useState<boolean>(false);

  const cardClicked = (game: IGame): void => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const getList = useCallback(which => {
    setWhichList(which);
    Axios.post('http://localhost:4001/api/vg/lists', { which })
      .then(result => {
        if (result && result.data) {
          setData(_sortBy(result.data, 'consoleName'));
        }
      })
      .catch(error => {
        if (error) {
        }
      });
  }, []);

  useEffect((): void => {
    getList(whichList);
  }, [getList, whichList]);

  return (
    <div className="lists">
      <div className="lists-head">
        <div className="lists-head--group">
          <label>Select a list:</label>
          <Dropdown value={whichList} onChange={e => getList(e.value)} options={lists} />
        </div>
        <div className="lists-head--group">
          <label>Cards?</label>
          <InputSwitch checked={cardView} onChange={e => setCardView(!!e.value)} />
        </div>
      </div>
      <div className="list-container">
        {cardView &&
          data.map((d, index) => {
            return (
              <GameCard
                data={d}
                key={`${index}-${d?.igdb?.name || 'game'}`}
                cardClicked={cardClicked}
              />
            );
          })}
        {!cardView && <ListView data={data} listRowClick={cardClicked} whichData={whichList} />}
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
