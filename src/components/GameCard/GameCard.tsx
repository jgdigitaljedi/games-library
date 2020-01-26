import React, { FunctionComponent } from 'react';
import { Card } from 'primereact/card';

const GameCard: FunctionComponent<any> = props => {
  console.log('props', props);
  return (
    <Card className="game-card">
      {props && props.data && props.data.igdb ? (
        <div className="game-card--content">
          <img src={props.data.gb.image || ''} alt={props.data.igdb.name || ''} />
          <h5>{props.data.igdb.name}</h5>
        </div>
      ) : null}
    </Card>
  );
};

export default GameCard;
