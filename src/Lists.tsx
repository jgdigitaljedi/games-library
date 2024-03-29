import React, { FunctionComponent, useCallback, useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import Axios from 'axios';
import { IGame } from './models/games.model';
import { Dropdown } from 'primereact/dropdown';
import GameCard from './components/GameCard/GameCard';
import GameDialog from './components/GameDialog/GameDialog';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import ListView from './components/ListView/ListView';
import { sortBy as _sortBy } from 'lodash';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { NotificationContext } from './context/NotificationContext';

const Lists: FunctionComponent<RouteComponentProps> = () => {
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
  const lists = [
    { label: 'Platform Exclusives', value: 'exclusives' },
    { label: 'Platform Launch Titles', value: 'launch' },
    { label: 'Multiplayer party games', value: 'multiplayer' },
    { label: 'Special games', value: 'special' },
    { label: 'Multi-platform Games', value: 'multiplatform' },
    { label: 'Greatest Hits', value: 'hits' },
    { label: 'Complete in Box Games', value: 'cib' },
    { label: 'Sealed/New Games', value: 'sealed' },
    { label: 'Free Games', value: 'free' }
  ];
  const [whichList, setWhichList] = useState<string>(lists[0].value);
  const [data, setData] = useState<IGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<IGame | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cardView, setCardView] = useState<boolean>(false);
  const [hideDigital, setHideDigital] = useState<boolean>(false);
  const [displayData, setDisplayData] = useState<IGame[]>([]);

  const cardClicked = (game: IGame): void => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const getList = useCallback(
    which => {
      setWhichList(which);
      Axios.post(`${window.urlPrefix}/api/vg/lists`, { which })
        .then(result => {
          if (result && result.data) {
            const results = _sortBy(result.data, 'consoleName');
            setData(results);
            if (hideDigital) {
              setDisplayData(
                results.filter((game: IGame) => game.physicalDigital.indexOf('physical') > -1)
              );
            } else {
              setDisplayData(results);
            }
          }
        })
        .catch(error => {
          if (error) {
            setNotify({
              severity: 'error',
              detail: error,
              summary: 'error'
            });
          }
        });
    },
    [setNotify, hideDigital]
  );

  useEffect((): void => {
    getList(whichList);
  }, [getList, whichList]);

  return (
    <div className='lists'>
      <div className='lists-head'>
        <div className='lists-head--group'>
          <label>Select a list:</label>
          <Dropdown value={whichList} onChange={e => getList(e.value)} options={lists} />
        </div>
        <div className='lists-head--group'>
          <label>Cards?</label>
          <InputSwitch checked={cardView} onChange={e => setCardView(!!e.value)} />
        </div>
        <div className='lists-head--group'>
          <label>Hide Digital?</label>
          <InputSwitch checked={hideDigital} onChange={e => setHideDigital(!!e.value)} />
        </div>
        <div className='lists-head--group'>
          <label>{displayData.length} games</label>
        </div>
      </div>
      <div className='list-container'>
        {cardView &&
          displayData.map((d, index) => {
            return (
              <GameCard data={d} key={`${index}-${d?.name || 'game'}`} cardClicked={cardClicked} />
            );
          })}
        {!cardView && (
          <ListView data={displayData} listRowClick={cardClicked} whichData={whichList} />
        )}
      </div>
      <ScrollToTop position='right' />
      <Dialog
        visible={showModal}
        header={selectedGame ? selectedGame['name'] : ''}
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
