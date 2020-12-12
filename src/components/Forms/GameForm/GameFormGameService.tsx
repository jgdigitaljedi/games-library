import React, { FunctionComponent, Fragment } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { IGame } from '../../../models/games.model';

interface IGameEdit extends IGame {
  newDatePurchased: Date;
}

interface IProps {
  addMode: boolean;
  userChange: (e: any) => void;
  game: IGameEdit;
}

const GameFormGameService: FunctionComponent<IProps> = ({ addMode, game, userChange }: IProps) => {
  // @TODO: add some simple logic to disable some switches
  /**
   * - only PlayStation 3, 4, and 5 games can have PS Plus switch
   * - Xbox 360, Xbox One, and Xbox Series S/X games ALONG WITH PC games can have Game Pass
   * - Xbox 360, Xbox One, and Xbox Series S/X games can have Games w/ Gold
   * - PC can have Amazon Prime Loot
   */
  return (
    <Fragment>
      <div className="divider">
        <hr />
      </div>
      <h3>Games Services Data</h3>
      <div className="crud-form--form__row">
        <label htmlFor="gamePass">Xbox Game Pass?</label>
        <InputSwitch
          id="gamePass"
          checked={!!game?.gamesService.xbPass}
          onChange={userChange}
          attr-which="gamePass"
        />
      </div>
      <div className="crud-form--form__row">
        <label htmlFor="xbGold">Xbox Games w/ Gold?</label>
        <InputSwitch
          id="xbGold"
          checked={!!game?.gamesService.xbGold}
          onChange={userChange}
          attr-which="xbGold"
        />
      </div>
      <div className="crud-form--form__row">
        <label htmlFor="psPlus">PlayStation Plus?</label>
        <InputSwitch
          id="psPlus"
          checked={!!game?.gamesService.psPlus}
          onChange={userChange}
          attr-which="psPlus"
        />
      </div>
      <div className="crud-form--form__row">
        <label htmlFor="primeFree">Amazon Prime Loot?</label>
        <InputSwitch
          id="primeFree"
          checked={!!game?.gamesService.primeFree}
          onChange={userChange}
          attr-which="primeFree"
        />
      </div>
    </Fragment>
  );
};

export default GameFormGameService;
