import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { IGame } from '../../../models/games.model';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { cloneDeep as _cloneDeep, set as _set } from 'lodash';
import HelpersService from '../../../services/helpers.service';
import { handleChange } from '../../../services/forms.service';

interface IProps {
  game: IGame;
  closeDialog: Function;
}

interface IGameEdit extends IGame {
  newDatePurchased: Date;
}

const GameForm: FunctionComponent<IProps> = ({ game, closeDialog }: IProps) => {
  const [gameForm, setGameForm] = useState<IGameEdit>();
  const [addMode, setAddMode] = useState<boolean>(false);
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

  const userChange = (e: any) => {
    const newState = handleChange(e, gameForm);
    if (newState) {
      setGameForm(newState);
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
    closeDialog(gameForm?.name);
  }, [gameForm, closeDialog]);

  const cancelClicked = () => {
    resetGameForm();
    closeDialog(null);
  };

  const resetGameForm = useCallback(() => {
    setGameForm(HelpersService.resetGameForm());
  }, [setGameForm]);

  useEffect(() => {
    if (game && (game.name === '' || game.name === 'Add Game')) {
      setAddMode(true);
    }
    setGameForm(game as IGameEdit);
    if (game?.datePurchased) {
      (game as IGameEdit).newDatePurchased = HelpersService.getTodayYMD(game.datePurchased);
    }
  }, [game, setAddMode]);

  return (
    <div className="crud-form game-form--wrapper">
      <div className="crud-form--flex-wrapper">
        <form className="crud-from--form game-form--form">
          <div className="crud-form--form__row">
            <label htmlFor="name">Name</label>
            {!addMode && (
              <InputText id="name" value={gameForm?.name} onChange={userChange} attr-which="name" />
            )}
            {addMode && (
              // <InputText
              //   id="name"
              //   value={gameForm?.name}
              //   onChange={userChange}
              //   attr-which="name"
              // />
              <span>CHANGE TO AUTONCOMPLETE USING IGDB</span>
            )}
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="consoleName">For Console</label>
            <InputText
              id="consoleName"
              value={gameForm?.consoleName}
              onChange={userChange}
              attr-which="consoleName"
              readOnly
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="howAcquired">How Acquired</label>
            <InputText
              id="howAcquired"
              value={gameForm?.howAcquired}
              onChange={userChange}
              attr-which="howAcquired"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="pricePaid">Price Paid</label>
            <InputText
              id="pricePaid"
              value={gameForm?.pricePaid}
              onChange={userChange}
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
              onChange={userChange}
              attr-which="newDatePurchased"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="genres">Genres/Tags</label>
            <InputText
              id="genres"
              value={gameForm?.genres}
              onChange={userChange}
              attr-which="genres"
              readOnly
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="multiplayer-number">Max # of Players</label>
            <InputText
              id="multiplayer-number"
              value={gameForm?.multiplayerNumber}
              onChange={userChange}
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
              onChange={userChange}
              attr-which="cib"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="physical">Physical Copy?</label>
            <InputSwitch
              id="physical"
              checked={!!gameForm?.physical}
              onChange={userChange}
              attr-which="physical"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="notes"
              value={gameForm?.notes}
              onChange={userChange}
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
              id="case"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="condition">Condition</label>
            <Dropdown
              value={gameForm?.condition}
              options={conditionOptions}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which="condition"
              id="condition"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="image">Image URL</label>
            <InputText
              id="image"
              value={gameForm?.image}
              onChange={userChange}
              attr-which="image"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="description">Description</label>
            <InputTextarea
              id="description"
              value={gameForm?.description}
              onChange={userChange}
              attr-which="description"
              autoResize={true}
              cols={50}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="notes">Notes</label>
            <InputTextarea
              id="description"
              value={gameForm?.notes}
              onChange={userChange}
              attr-which="notes"
              autoResize={true}
              cols={50}
            />
          </div>
        </form>
        <div className="crud-form--image-and-data">
          {gameForm?.image && <img src={gameForm?.image} alt="game cover art or logo" />}
          {gameForm?.extraData?.length && (
            <div className="crud-form--image-and-data__extra-data">
              {gameForm.extraData.map((data, index) => (
                <p key={index}>{data}</p>
              ))}
            </div>
          )}
        </div>
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
