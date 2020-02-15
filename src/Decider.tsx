import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import axios from 'axios';
// import flatten from 'lodash/flatten';
// import cloneDeep from 'lodash/cloneDeep';
// import sortBy from 'lodash/sortBy';
// import { filters } from './services/deciderFiltering.service';
// import debounce from 'lodash/debounce';
import GameCard from './components/GameCard/GameCard';
import { Dialog } from 'primereact/dialog';
import { IGame } from './common.model';
import GameDialog from './components/GameDialog/GameDialog';
import DeciderHeader from './components/DeciderHeader/DeciderHeader';

const Decider: FunctionComponent<RouteComponentProps> = () => {
  const [masterData, setMasterData]: [any[], any] = useState([{}]);
  const [data, setData]: [any[], any] = useState([{}]);
  const [selectedCard, setSelectedCard]: [IGame | null, any] = useState(null);
  const [showModal, setShowModal]: [boolean, any] = useState(false);

  const getData = useCallback(async (ed?: boolean) => {
    const result = await axios.post('http://localhost:4001/api/gamescombined', {
      everDrive: ed
    });
    if (result && result.data) {
      setData(result.data);
      setMasterData(result.data);
    }
  }, []);

  const cardClicked = useCallback((card: IGame) => {
    setSelectedCard(card);
    setShowModal(true);
  }, []);

  useEffect(() => {
    if (!masterData || masterData.length === 1) {
      getData();
      // getGenreArray();
      // getEsrbArray();
      // getPlatformArray();
    }
  });

  // useEffect(() => {
  //   filterResults();
  // }, [formState, filterResults]);

  return (
    <div className="decider-container">
      <DeciderHeader data />
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
    </div>
  );
};

export default Decider;
