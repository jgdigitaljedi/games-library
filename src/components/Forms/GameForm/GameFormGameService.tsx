import React, { FunctionComponent, Fragment, useEffect, useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { IGame } from '@/models/games.model';
import {
  isGamePassConsole,
  isPrimeFreeConsole,
  isPsPlusConsole,
  isSwitchFreeConsole,
  isXbGoldConsole
} from '@/services/consoleSpecifics.service';

interface IGameEdit extends IGame {
  newDatePurchased: Date;
}

interface IProps {
  addMode: boolean;
  userChange: (e: any) => void;
  game: IGameEdit;
}

const GameFormGameService: FunctionComponent<IProps> = ({ addMode, game, userChange }: IProps) => {
  const [gamePassPlatform, setGamePassPlatform] = useState(false);
  const [goldPlatform, setGoldPlatform] = useState(false);
  const [psPlusPlatform, setPsPlusPlatform] = useState(false);
  const [primeFreePlatform, setPrimeFreePlatform] = useState(false);
  const [switchPlatform, setSwitchPlatform] = useState(false);
  const [atLeastOne, setAtLeastOne] = useState(false);

  useEffect(() => {
    if (game?.consoleId) {
      const canBePsPlus = isPsPlusConsole(game.consoleId);
      const canBeGold = isXbGoldConsole(game.consoleId);
      const canBeGamePass = isGamePassConsole(game.consoleId);
      const canBePrime = isPrimeFreeConsole(game.consoleId);
      const canBeSwitch = isSwitchFreeConsole(game.consoleId);

      setPsPlusPlatform(canBePsPlus);
      setGoldPlatform(canBeGold);
      setGamePassPlatform(canBeGamePass);
      setPrimeFreePlatform(canBePrime);
      setSwitchPlatform(canBeSwitch);

      if (canBeGamePass || canBeGold || canBePsPlus || canBePrime || canBeSwitch) {
        setAtLeastOne(true);
      }
    }
  }, [game]);
  /**
   * - only PlayStation 3, 4, and 5 games can have PS Plus switch
   * - Xbox 360, Xbox One, and Xbox Series S/X games ALONG WITH PC games can have Game Pass
   * - Xbox 360, Xbox One, and Xbox Series S/X games can have Games w/ Gold
   * - PC can have Amazon Prime Loot
   * - only Nintendo Switch can have Nintendo Switch Online
   */

  if (!atLeastOne) {
    return <></>;
  }

  return (
    <Fragment>
      <div className="divider">
        <hr />
      </div>
      <h3>Games Services Data</h3>
      {gamePassPlatform && (
        <div className="crud-form--form__row">
          <label htmlFor="GSxbPass">Xbox Game Pass?</label>
          <InputSwitch id="GSxbPass" checked={!!game?.gamesService.xbPass} onChange={userChange} />
        </div>
      )}
      {goldPlatform && (
        <div className="crud-form--form__row">
          <label htmlFor="GSxbGold">Xbox Games w/ Gold?</label>
          <InputSwitch id="GSxbGold" checked={!!game?.gamesService.xbGold} onChange={userChange} />
        </div>
      )}
      {psPlusPlatform && (
        <div className="crud-form--form__row">
          <label htmlFor="GSpsPlus">PlayStation Plus?</label>
          <InputSwitch id="GSpsPlus" checked={!!game?.gamesService.psPlus} onChange={userChange} />
        </div>
      )}
      {primeFreePlatform && (
        <div className="crud-form--form__row">
          <label htmlFor="GSprimeFree">Amazon Prime Loot?</label>
          <InputSwitch
            id="GSprimeFree"
            checked={!!game?.gamesService.primeFree}
            onChange={userChange}
          />
        </div>
      )}
      {switchPlatform && (
        <div className="crud-form--form__row">
          <label htmlFor="GSswitchOnline">Nintendo Switch Online?</label>
          <InputSwitch
            id="GSswitchOnline"
            checked={!!game?.gamesService.switchFree}
            onChange={userChange}
          />
        </div>
      )}
    </Fragment>
  );
};

export default GameFormGameService;
