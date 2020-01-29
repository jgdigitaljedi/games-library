import React, { FunctionComponent } from 'react';
import { Card } from 'primereact/card';

const GameCard: FunctionComponent<any> = props => {
  return (
    <Card className="game-card">
      {props && props.data && props.data.igdb ? (
        <div className="game-card--content" onClick={() => props.cardClicked(props.data)}>
          <img
            src={props.data.gb.image || ''}
            alt={props.data.igdb.name || ''}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = 'Video-Game-Controller-Icon.svg.png';
            }}
          />
          <div className="game-card--content__title">
            <h5>{props.data.igdb.name}</h5>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default GameCard;
