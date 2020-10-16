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
import { ProgressSpinner } from 'primereact/progressspinner';
import { IFormState, IDropdown } from './models/common.model';
import { IGame } from './models/games.model';
import GameDialog from './components/GameDialog/GameDialog';
import DeciderHeader from './components/DeciderHeader/DeciderHeader';
import { RouteComponentProps } from '@reach/router';
import { DataContext } from './context/DataContext';
import { filters } from './services/deciderFiltering.service';
import { cloneDeep as _cloneDeep } from 'lodash';
import { SortContext, ISortContext } from './context/SortContext';
import sortsService from './services/sorts.service';
import { connect, useSelector } from 'react-redux';
import changePlatformsArr from './actionCreators/platformsArr';
import { Dispatch as ReduxDispatch } from 'redux';
import { getPlatformArr } from './services/globalData.service';

interface MapStateProps {
  platformsArr: IDropdown[];
}

interface MapDispatchProps {
  setPlatformsArr: (platformsArr: IDropdown[]) => void;
}

interface IProps extends RouteComponentProps, MapDispatchProps, MapStateProps {}

const Decider: FunctionComponent<IProps> = (props: IProps) => {
  const [dc]: [IFormState, Dispatch<SetStateAction<IFormState>>] = useContext(DataContext);
  const [sc]: [ISortContext, Dispatch<SetStateAction<ISortContext>>] = useContext(SortContext);
  const [masterData, setMasterData] = useState<any[]>([{}]);
  const [data, setData] = useState<any[]>([{}]);
  const [everDrives, setEverDrives] = useState<any[]>([{}]);
  const [selectedCard, setSelectedCard] = useState<IGame | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const platformsArr: IDropdown[] = useSelector((state: any) => state.platformsArr);

  const getEverdrives = useCallback(async () => {
    const result = await axios.get(`${window.urlPrefix}/api/vg/everdrives`);
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
      const result = await axios.post(`${window.urlPrefix}/api/vg/gamescombined`, {
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
    if (dc.physical) {
      newData = _cloneDeep(newData).filter(g => g.physical);
    }
    if (dc.location) {
      newData = filters.filterLocation([...newData], dc.location);
    }
    if (dc.handheld) {
      newData = filters.filterHandhelds([...newData], dc.handheld);
    }
    setData(newData);
    sortData(newData);
    //eslint-disable-next-line
  }, [dc, masterData, checkForReset, everDrives, sortData]);

  useEffect(() => {
    filterResults();
  }, [dc, filterResults]);

  useEffect(() => {
    if (
      !data ||
      (data.length === 1 && !data[0].hasOwnProperty('_id')) ||
      !masterData ||
      (masterData.length === 1 && !masterData[0].hasOwnProperty('_id'))
    ) {
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

  useEffect(() => {
    if (!platformsArr?.length) {
      getPlatformArr()
        .then((result: IDropdown[]) => {
          props.setPlatformsArr(result);
        })
        .catch((error: any) => {
          console.error('ERROR FETCHING PLATFORMS ARR', error);
        });
    }
  }, [props, platformsArr]);

  return (
    <div className="decider-container">
      <div className="decioder-bar-wrapper">
        <DeciderHeader data={data} />
      </div>
      <div className="decider--counter">
        <h3>{data.length} games</h3>
      </div>
      <div className="decider--results">
        {data &&
          data.length &&
          data[0].hasOwnProperty('_id') &&
          data.map((d, index) => (
            <GameCard
              data={d}
              key={`${index}-${d?.igdb?.name || 'game'}`}
              cardClicked={cardClicked}
            />
          ))}
        {(!data || (data.length === 1 && !data[0].hasOwnProperty('_id'))) && <ProgressSpinner />}
      </div>
      <Dialog
        visible={showModal}
        header={selectedCard ? selectedCard['igdb']['name'] : ''}
        modal={true}
        closeOnEscape={true}
        dismissableMask={true}
        position="top"
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

const mapStateToProps = ({ platformsArr }: { platformsArr: IDropdown[] }): MapStateProps => {
  return {
    platformsArr
  };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): MapDispatchProps => ({
  setPlatformsArr: (platformsArr: IDropdown[]) => dispatch(changePlatformsArr(platformsArr))
});

export default connect(mapStateToProps, mapDispatchToProps)(Decider);
