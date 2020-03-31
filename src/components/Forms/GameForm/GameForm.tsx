import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { IGame } from '../../../common.model';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { cloneDeep as _cloneDeep, set as _set } from 'lodash';

interface IProps {
  game: IGame;
  saveClicked: Function;
}

const GameForm: FunctionComponent<IProps> = ({ game, saveClicked }: IProps) => {
  const [gameForm, setGameForm] = useState<IGame>();
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
    const { value } = e.value ? e : e.target;
    const propPath = e.target.getAttribute('attr-which');
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
            keyfilter="pnum"
            min={0}
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
          <img src={gameForm?.image} alt="game cover art or logo" />
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
    </div>
  );
};

export default GameForm;
