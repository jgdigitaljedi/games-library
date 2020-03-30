import React, { FunctionComponent, useState, useEffect } from 'react';
import { IGame } from '../../../common.model';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { cloneDeep as _cloneDeep, set as _set } from 'lodash';

interface IProps {
  game: IGame;
  saveClicked: Function;
}

const GameForm: FunctionComponent<IProps> = ({ game, saveClicked }: IProps) => {
  const [gameForm, setGameForm] = useState<IGame>();

  const handleChange = (e: any) => {
    const { value } = e.target;
    const propPath = e.target.getAttribute('attr-which');
    const copy = _cloneDeep(gameForm);
    if (copy) {
      _set(copy, propPath, value);
      setGameForm(copy);
    }
  };

  useEffect(() => {
    setGameForm(game);
  }, [game]);

  return (
    <div className="crud-form game-form--wrapper">
      <hr />
      <form className="crud-from--form game-form--form">
        <div className="crud-form--form__row">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={gameForm?.name} onChange={handleChange} attr-which="name" />
        </div>
        <div className="crud-form--form__row">
          <label htmlFor="how-acquired">How Acquired</label>
          <InputText
            id="how-acquired"
            value={gameForm?.howAcquired}
            onChange={handleChange}
            attr-which="howAcquired"
          />
        </div>
        <div className="crud-form--form__row">
          <label htmlFor="price-paid">Price Paid</label>
          <InputText
            id="price-paid"
            value={gameForm?.pricePaid}
            onChange={handleChange}
            attr-which="pricePaid"
            type="number"
          />
        </div>
        <div className="crud-form--form__row">
          <label htmlFor="multiplayer-number">Max # of Players</label>
          <InputText
            id="multiplayer-number"
            value={gameForm?.multiplayerNumber}
            onChange={handleChange}
            attr-which="multiplayerNumber"
            type="number"
          />
        </div>
        <div className="crud-form--form__row">
          <label htmlFor="cib">CIB</label>
          <InputSwitch
            id="cib"
            checked={!!gameForm?.cib}
            onChange={handleChange}
            attr-which="cib"
          />
        </div>
        <div className="crud-form--form__row">
          <label htmlFor="notes">Notes</label>
          <InputTextarea
            id="notes"
            value={gameForm?.notes}
            onChange={handleChange}
            attr-which="notes"
          />
        </div>
      </form>
    </div>
  );
};

export default GameForm;
