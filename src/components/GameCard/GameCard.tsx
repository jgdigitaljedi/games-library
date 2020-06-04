import React, { FunctionComponent } from 'react';
import { Card } from 'primereact/card';
import { IGame } from '../../common.model';
import UrlService from '../../services/url.service';

interface IProps {
  data: IGame;
  cardClicked: Function;
}

const GameCard: FunctionComponent<IProps> = ({ data, cardClicked }: IProps) => {
  const urlPrefix = UrlService.assets;

  const physicalDigitalClass = (game: IGame): string => {
    const which = game.physicalDigital;
    if (which === 'digital') {
      return 'digital-copy';
    } else if (which === 'both') {
      return 'both-copies';
    }
    return 'physical-copy';
  };

  return (
    // <Card className={`game-card ${!data.physical ? 'digital-copy' : ''}`}>
    <Card className={`game-card ${physicalDigitalClass(data)}`}>
      {data && data.igdb ? (
        <div className="game-card--content" onClick={() => cardClicked(data)}>
          <img
            src={data.gb.image || ''}
            alt={data.igdb.name || ''}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = `${urlPrefix}Video-Game-Controller-Icon.svg.png`;
            }}
          />
          <div className="game-card--content__title">
            <h5>{data.igdb.name}</h5>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default GameCard;
