import React, { FunctionComponent, useState } from 'react';
import { IGame } from '../../../common.model';
import { InputText } from 'primereact/inputtext';

interface IProps {
  game: IGame;
  saveClicked: Function;
}

const GameForm: FunctionComponent<IProps> = ({ game, saveClicked }: IProps) => {
  const [gameForm, setGameForm] = useState<IGame>({ ...game });
  return (
    <div className="crud-form game-form--wrapper">
      <div>Game Form</div>
      <form className="crud-from--form game-form--form">
        <h3>IGDB Section</h3>
        <label htmlFor="igdb-name">Name</label>
        <InputText id="igdb-name" value={gameForm?.igdb?.name} />
      </form>
    </div>
  );
};

export default GameForm;
