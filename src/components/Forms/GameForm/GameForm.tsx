import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { IGame } from '../../../common.model';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { cloneDeep as _cloneDeep, set as _set } from 'lodash';
import HelpersService from '../../../services/helpers.service';

interface IProps {
  game: IGame;
  closeDialog: Function;
}

interface IGameEdit extends IGame {
  newDatePurchased: Date;
}

const GameForm: FunctionComponent<IProps> = ({ game, closeDialog }: IProps) => {
  const [gameForm, setGameForm] = useState<IGameEdit>();
  const caseOptions = [
    { label: 'Original', value: 'original' },
    { label: 'Custom', value: 'custom' },
    { label: 'None', value: 'none' }
  ];
  const conditionOptions = [
    { label: 'Excellent', value: 'Excellent' },
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
    { label: 'Poor', value: 'Poor' },
    { label: 'Other', value: 'Other' }
  ];

  const handleChange = (e: any) => {
    const isSwitch = e.hasOwnProperty('value');
    const { value } = isSwitch ? e : e.target;
    const propPath = isSwitch ? e.target.id : e.target.getAttribute('attr-which');
    const copy = _cloneDeep(gameForm);
    if (copy) {
      _set(copy, propPath, value);
      setGameForm(copy);
    }
  };

  const handleDropdown = useCallback(
    (e: any, which: string) => {
      const copy = _cloneDeep(gameForm);
      if (copy) {
        _set(copy, which, e.value);
        setGameForm(copy);
      }
    },
    [gameForm, setGameForm]
  );

  const updateGame = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('gameForm in save', gameForm);
    closeDialog(gameForm?.name);
  }, [gameForm, closeDialog]);

  const cancelClicked = () => {
    closeDialog(null);
  };

  useEffect(() => {
    if (game?.datePurchased) {
      (game as IGameEdit).newDatePurchased = HelpersService.getTodayYMD(game.datePurchased);
    }
    setGameForm(game as IGameEdit);
  }, [game]);

  return (
    <div className="crud-form game-form--wrapper">
      {/* <hr /> */}
      <div className="crud-form--flex-wrapper">
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
              keyfilter="pnum"
              min={0}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="date-purchased">Date Purchased</label>
            <Calendar
              id="newDatePurchased"
              showIcon={true}
              value={gameForm?.newDatePurchased}
              onChange={handleChange}
              attr-which="newDatePurchased"
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
              keyfilter="pnum"
              min={1}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="cib">CIB?</label>
            <InputSwitch
              id="cib"
              checked={!!gameForm?.cib}
              onChange={handleChange}
              attr-which="cib"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="physical">Physical Copy?</label>
            <InputSwitch
              id="physical"
              checked={!!gameForm?.physical}
              onChange={handleChange}
              attr-which="physical"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="notes"
              value={gameForm?.notes}
              onChange={handleChange}
              attr-which="notes"
              autoResize={true}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="case">Case</label>
            <Dropdown
              value={gameForm?.case}
              options={caseOptions}
              onChange={e => handleDropdown(e, 'case')}
              attr-which="case"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="condition">Condition</label>
            <Dropdown
              value={gameForm?.condition}
              options={conditionOptions}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which="condition"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="image">Image URL</label>
            <InputText
              id="image"
              value={gameForm?.image}
              onChange={handleChange}
              attr-which="image"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={gameForm?.description}
              onChange={handleChange}
              attr-which="description"
              autoResize={true}
              cols={50}
            />
          </div>
        </form>
        <img src={gameForm?.image} alt="game cover art or logo" />
      </div>
      <hr />
      <div className="crud-form--footer">
        <Button
          label="Cancel"
          onClick={cancelClicked}
          icon="pi pi-times"
          className="p-button-info"
        />
        <Button
          label={`Save ${gameForm?.name}`}
          onClick={updateGame}
          icon="pi pi-save"
          className="p-button-success"
        />
      </div>
    </div>
  );
};

export default GameForm;
