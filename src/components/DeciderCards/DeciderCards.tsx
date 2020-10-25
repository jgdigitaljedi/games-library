import { Dialog } from 'primereact/dialog';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { IGame } from '../../models/games.model';
import GameCard from '../GameCard/GameCard';
import GameDialog from '../GameDialog/GameDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import { calculateNumToLoad } from '../../services/scroller.service';
import './DeciderCards.scss';

interface IProps {
  data: IGame[];
}

const DeciderCards: FunctionComponent<IProps> = ({ data }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<IGame | null>(null);
  const [loaded, setLoaded] = useState<IGame[]>([]);
  const [magicNumber, setMagicNumber] = useState(0);

  const cardClicked = useCallback((card: IGame) => {
    setSelectedCard(card);
    setShowModal(true);
  }, []);

  const loadMore = () => {
    const newAmount = loaded.length + magicNumber;
    setLoaded(data.slice(0, newAmount));
  };

  const items = () => {
    return (
      <>
        {loaded.map((d, index) => (
          <GameCard
            data={d}
            key={`${index}-${d?.igdb?.name || 'game'}`}
            cardClicked={cardClicked}
          />
        ))}
      </>
    );
  };

  const scrollerMessages = (message: string) => {
    return (
      <div className="scroller-message">
        <h4>{message}</h4>
      </div>
    );
  };

  window.addEventListener('resize', () => {
    setMagicNumber(calculateNumToLoad(window.innerHeight, window.innerWidth));
  });

  useEffect(() => {
    if (!magicNumber) {
      setMagicNumber(calculateNumToLoad(window.innerHeight, window.innerWidth));
    }
  }, [magicNumber]);

  useEffect(() => {
    if (magicNumber) {
      setLoaded(data.slice(0, magicNumber));
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <div className="decider-cards">
      {loaded && loaded.length && loaded[0].hasOwnProperty('_id') && (
        <InfiniteScroll
          className="decider-cards--scroller"
          dataLength={loaded.length}
          next={loadMore}
          hasMore={data.length > loaded.length}
          loader={scrollerMessages('Scroll down to load more')}
          endMessage={scrollerMessages(`That's all, folks!`)}
          scrollThreshold={0.85}
          scrollableTarget="scrollableDiv"
        >
          {items()}
        </InfiniteScroll>
      )}
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
        <GameDialog game={selectedCard} />
      </Dialog>
    </div>
  );
};

export default DeciderCards;
