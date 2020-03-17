import React, { FunctionComponent } from 'react';
import { Card } from 'primereact/card';
import { IGame } from '../../common.model';

interface IProps {
  data: IGame;
  cardClicked: Function;
}

const GameCard: FunctionComponent<IProps> = ({ data, cardClicked }: IProps) => {
  return (
    <Card className={`game-card ${!data.physical ? 'digital-copy' : ''}`}>
      {data && data.igdb ? (
        <div className="game-card--content" onClick={() => cardClicked(data)}>
          <img
            src={data.gb.image || ''}
            alt={data.igdb.name || ''}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = 'Video-Game-Controller-Icon.svg.png';
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
