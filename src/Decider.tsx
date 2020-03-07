import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction
} from 'react';
import axios from 'axios';
import GameCard from './components/GameCard/GameCard';
import { Dialog } from 'primereact/dialog';
import { IGame } from './common.model';
import GameDialog from './components/GameDialog/GameDialog';
import DeciderHeader from './components/DeciderHeader/DeciderHeader';
import { RouteComponentProps } from '@reach/router';
import { DataContext } from './context/DataContext';
import { filters } from './services/deciderFiltering.service';
import { cloneDeep as _cloneDeep } from 'lodash';
import { SortContext } from './context/SortContext';
import sortsService from './services/sorts.service';

const Decider: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<any>) => {
  const [dc] = useContext(DataContext);
  const [sc] = useContext(SortContext);
  const [masterData, setMasterData]: [any[], Dispatch<SetStateAction<any[]>>] = useState([{}]);
  const [data, setData]: [any[], Dispatch<SetStateAction<any[]>>] = useState([{}]);
  const [everDrives, setEverDrives]: [any[], Dispatch<SetStateAction<any[]>>] = useState([{}]);
  const [selectedCard, setSelectedCard]: [IGame | null, any] = useState(null);
  const [showModal, setShowModal]: [boolean, any] = useState(false);

  const getEverdrives = useCallback(async () => {
    const result = await axios.get('http://localhost:4001/api/everdrives');
    if (result && result.data) {
      setEverDrives(result.data);
    }
  }, []);

  const sortData = useCallback(
    dat => {
      setData(sortsService.sortData([...dat], sc.prop, sc.dir));
    },
    [sc.dir, sc.prop]
  );

  const getData = useCallback(
    async (ed?: boolean) => {
      const result = await axios.post('http://localhost:4001/api/gamescombined', {
        everDrive: ed
      });
      if (result && result.data) {
        setData(result.data);
        setMasterData(result.data);
        sortData(result.data);
      }
    },
    [setData, setMasterData, sortData]
  );

  const cardClicked = useCallback((card: IGame) => {
    setSelectedCard(card);
    setShowModal(true);
  }, []);

  const checkForReset = useCallback(form => {
    const keys = Object.entries(form);
    return keys.filter(([key, value]) => value && value !== '').length === 0;
  }, []);

  const filterResults = useCallback(() => {
    let newData = dc.everDrive ? [...masterData, ...everDrives] : _cloneDeep(masterData);
    if (checkForReset(dc)) {
      setData(newData);
      sortData(newData);
      return;
    }
    if (dc.name !== '') {
      newData = filters.filterName([...newData], dc.name);
    }
    if (dc.platform !== '') {
      newData = filters.filterPlatform([...newData], dc.platform);
    }
    if (dc.players !== 0) {
      newData = filters.filterPlayers([...newData], dc.players);
    }
    if (dc.genre !== '') {
      newData = filters.filterGenre([...newData], dc.genre);
    }
    if (dc.esrb !== '') {
      newData = filters.filterEsrb([...newData], dc.esrb);
    }
    setData(newData);
    sortData(newData);
    //eslint-disable-next-line
  }, [dc, masterData, checkForReset, everDrives, sortData]);

  useEffect(() => {
    filterResults();
  }, [dc, filterResults]);

  useEffect(() => {
    if (!data || data.length === 1 || !masterData || masterData.length === 1) {
      getData();
    }
    if (!everDrives || everDrives.length === 1) {
      getEverdrives();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    sortData(data);
    // eslint-disable-next-line
  }, [sc, sortData]);

  return (
    <div className="decider-container">
      <div className="decioder-bar-wrapper">
        <DeciderHeader data={data} />
      </div>
      <div className="decider--counter">
        <h3>{data.length} games</h3>
      </div>
      <div className="decider--results">
        {data.map((d, index) => (
          <GameCard
            data={d}
            key={`${index}-${d?.igdb?.name || 'game'}`}
            cardClicked={cardClicked}
          />
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
