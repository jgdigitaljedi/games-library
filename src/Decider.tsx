import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import GameCard from './components/GameCard/GameCard';
import { Dialog } from 'primereact/dialog';
import { IGame, IFormState } from './common.model';
import GameDialog from './components/GameDialog/GameDialog';
import DeciderHeader from './components/DeciderHeader/DeciderHeader';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import changeDeciderFilters from './actionCreators/deciderFilters';
import { RouteComponentProps } from '@reach/router';

interface MapStateProps {
  deciderFilters: IFormState;
}

interface MapDispatchProps {
  setDeciderFilters: (deciderFilters: IFormState) => void;
}

interface IProps extends MapDispatchProps, MapStateProps {}

const Decider: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
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
    }
  });

  // useEffect(() => {
  //   filterResults();
  // }, [formState, filterResults]);

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

const mapStateToProps = ({ deciderFilters }: { deciderFilters: IFormState }): MapStateProps => {
  return {
    deciderFilters
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setDeciderFilters: (deciderFilters: IFormState) => dispatch(changeDeciderFilters(deciderFilters))
});

export default connect(mapStateToProps, mapDispatchToProps)(Decider);
