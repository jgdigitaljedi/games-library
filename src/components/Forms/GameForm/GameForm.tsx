import React, { FunctionComponent, useState, useEffect } from 'react';
import { IGame } from '../../../common.model';
import { InputText } from 'primereact/inputtext';

interface IProps {
  game: IGame;
  saveClicked: Function;
}

const GameForm: FunctionComponent<IProps> = ({ game, saveClicked }: IProps) => {
  const [gameForm, setGameForm] = useState<IGame>();

  useEffect(() => {
    setGameForm(game);
  }, [game]);
  console.log('gameForm', gameForm);
  return (
    <div className="crud-form game-form--wrapper">
      <hr />
      <form className="crud-from--form game-form--form">
        <h3>IGDB Section</h3>
        <label htmlFor="igdb-name">Name</label>
        <InputText id="igdb-name" value={gameForm?.igdb?.name} onChange={(e: any) => {
          const copy = gameForm?.igdb;
          if (e?.value && copy) {
            copy.name = e.value;
            const newName = Object.assign(gameForm, { igdb: copy });
            setGameForm(newName);
          }
        }} />
      </form>
    </div>
  );
};

export default GameForm;
