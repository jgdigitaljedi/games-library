import React, { FunctionComponent } from 'react';
import { Card } from 'primereact/card';
import { IGame } from '../../common.model';
import UrlService from '../../services/url.service';
import helpersService from '../../services/helpers.service';

interface IProps {
  data: IGame;
  cardClicked: Function;
}

const GameCard: FunctionComponent<IProps> = ({ data, cardClicked }: IProps) => {
  const urlPrefix = UrlService.assets;

  return (
    <Card className={`game-card ${helpersService.physicalDigitalBc(data)}`}>
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
