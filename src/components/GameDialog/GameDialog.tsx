import React, { FunctionComponent } from 'react';
import './GameDialog.scss';
import { IConsoleArr } from '../../common.model';

const GameDialog: FunctionComponent<any> = ({ game }) => {
  return (
    <section className="game-dialog">
      <h2>{game && game.igdb ? game.igdb.name : ''}</h2>
      <div className="game-dialog--body">
        <div className="game-dialog--body__image"></div>
        <div className="game-dialog--body__desc"></div>
        <h4>{game && game.igdb ? game.igdb.name : ''} can be played on:</h4>
        <div className="game-dialog--body__consoles">
          {game && game.consoleArr ? (
            game.consoleArr.map((con: IConsoleArr) => <h5>{con.consoleName}</h5>)
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
};

export default GameDialog;
