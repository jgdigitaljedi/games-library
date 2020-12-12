import React, { FunctionComponent, useState, useEffect, useCallback, useContext } from 'react';
import { IGame } from '../../../models/games.model';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { cloneDeep as _cloneDeep, set as _set } from 'lodash';
import HelpersService from '../../../services/helpers.service';
import { handleChange } from '../../../services/forms.service';
import { igdbGameSearch } from '../../../services/gamesCrud.service';
import { getPlatformsWithIds } from '../../../services/platformsCrud.service';
import { NotificationContext } from '../../../context/NotificationContext';
import { Chips } from 'primereact/chips';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import changeUserState from '../../../actionCreators/userState';
import GameFormGameService from './GameFormGameService';

interface IProps extends MapDispatchProps, MapStateProps {
  game: IGame;
  closeDialog: Function;
}

interface MapStateProps {
  userState: boolean;
}

interface MapDispatchProps {
  setUserState: (state: boolean) => void;
}

interface IGameEdit extends IGame {
  newDatePurchased: Date;
}

// @TODO: circle back and make some interfaces
const GameForm: FunctionComponent<IProps> = ({ game, closeDialog }: IProps) => {
  const loggedIn = useSelector((state: any) => state.userState);
  const [gameForm, setGameForm] = useState<IGameEdit>();
  const [addMode, setAddMode] = useState<boolean>(false);
  const [igdbGames, setIgdbGames] = useState<any[]>();
  const [platformIdArr, setPlatformIdArr] = useState<any>();
  const [searchPlatform, setSearchPlatform] = useState<any>();
  const [selectedFromSearch, setSelectedFromSearch] = useState<any>();
  const [fuzzySearch, setFuzzySearch] = useState(false);
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
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

  const esrbOptions = [
    { label: 'KA', value: 'KA' },
    { label: 'E', value: 'E' },
    { label: 'E10+', value: 'E10+' },
    { label: 'T', value: 'T' },
    { label: 'M', value: 'M' },
    { label: 'RP', value: 'RP' },
    { label: 'NO RATING', value: null }
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

  const searchIgdb = useCallback(async () => {
    if (gameForm?.name) {
      try {
        const result = await igdbGameSearch(
          gameForm?.name,
          searchPlatform || 99999,
          !searchPlatform
        );
        if (result?.data) {
          setIgdbGames(result.data);
        }
      } catch (error) {
        setNotify({
          severity: 'error',
          detail: 'Error fetching IGDB game data.',
          summary: 'ERROR'
        });
      }
    }
  }, [gameForm, setNotify, searchPlatform]);

  const updateGame = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('new game data', gameForm);
    closeDialog(gameForm?.name);
  }, [gameForm, closeDialog]);

  const cancelClicked = () => {
    resetGameForm();
    closeDialog(null);
  };

  const resetGameForm = useCallback(() => {
    // @ts-ignore
    setGameForm(HelpersService.resetGameForm());
  }, [setGameForm]);

  const searchSelection = (e: any) => {
    console.log('e', e);
    if (e?.value) {
      const game = e.value;
      setSelectedFromSearch(game);
      const gfCopy = _cloneDeep(gameForm);
      setGameForm(Object.assign(gfCopy, game));
    }
  };

  useEffect(() => {
    if (game && (game.name === '' || game.name === 'Add Game')) {
      setAddMode(true);
    }
    setGameForm(game as IGameEdit);
    if (game?.datePurchased) {
      (game as IGameEdit).newDatePurchased = HelpersService.getTodayYMD(game.datePurchased);
    }
  }, [game, setAddMode]);

  useEffect(() => {
    if (!platformIdArr?.length) {
      getPlatformsWithIds()
        .then((platforms: any) => {
          const platformsFormatted = platforms.data.map((p: any) => ({
            label: p.name,
            value: p.id
          }));
          platformsFormatted.unshift({ label: 'NOT SET', value: 99999 });
          setPlatformIdArr(platformsFormatted);
        })
        .catch((error) => {
          console.log('ERROR FETCHING PLATFORMS WITH IDS', error);
          setNotify({
            severity: 'error',
            detail: 'Erro fetching platforms with ids.',
            summary: 'ERROR'
          });
        });
    }
  }, [setPlatformIdArr, setNotify, platformIdArr]);

  return (
    <div className="crud-form game-form--wrapper">
      <div className="crud-form--flex-wrapper">
        <form className="crud-from--form game-form--form">
          <div className="crud-form--form__row">
            {addMode && loggedIn && (
              <div className="igdb-search-fields">
                <h3>Search IGDB</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}>
                  <label htmlFor="fuzzy">Fuzzy Search</label>
                  <InputSwitch
                    id="fuzzy"
                    checked={!!fuzzySearch}
                    onChange={() => setFuzzySearch(!fuzzySearch)}
                  />
                </div>
                <Dropdown
                  className="search-field"
                  value={searchPlatform}
                  options={platformIdArr}
                  onChange={(e) => {
                    setSearchPlatform(e.value);
                  }}
                  id="search-platform"
                  placeholder="Platform to search"
                  disabled={fuzzySearch}
                />
                <AutoComplete
                  dropdown
                  className="search-field"
                  delay={600}
                  id="name"
                  value={gameForm?.name}
                  onChange={userChange}
                  onSelect={searchSelection}
                  attr-which="name"
                  suggestions={igdbGames}
                  completeMethod={searchIgdb}
                  field="name"
                  disabled={!searchPlatform && !fuzzySearch}
                />
                <hr />
              </div>
            )}
          </div>
          {!addMode && (
            <div className="divider">
              <hr />
            </div>
          )}
          <div className="crud-form--form__row">
            <label htmlFor="name">Name</label>
            <InputText id="name" value={gameForm?.name} onChange={userChange} attr-which="name" />
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
          <div className="divider">
            <hr />
          </div>
          <h3>Data from IGDB</h3>
          <div className="crud-form--form__row">
            <label htmlFor="total_rating">Total Rating</label>
            <InputText
              id="total_rating"
              value={gameForm?.total_rating}
              onChange={userChange}
              attr-which="total_rating"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="videos">Videos</label>
            <Chips
              id="videos"
              value={gameForm?.videos || []}
              onChange={userChange}
              attr-which="videos"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="genres">Genres</label>
            <Chips
              id="genres"
              value={gameForm?.genres || []}
              onChange={userChange}
              attr-which="genres"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="esrb">ESRB Rating</label>
            <Dropdown
              value={gameForm?.esrb}
              options={esrbOptions}
              onChange={(e) => handleDropdown(e, 'esrb')}
              attr-which="esrb"
              id="esrb"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="playerPerspectives">Player Perspectives</label>
            <Chips
              id="playerPerspectives"
              value={gameForm?.player_perspectives || []}
              onChange={userChange}
              attr-which="playerPerspectives"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="maxMultiplayer">Max Multiplayer</label>
            <InputText
              id="maxMultiplayer"
              value={gameForm?.maxMultiplayer || 1}
              onChange={userChange}
              attr-which="maxMultiplayer"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="multiplayerOffline">Multiplayer: Offline VS</label>
            <InputText
              id="multiplayerOffline"
              value={gameForm?.multiplayer_modes?.offlinemax || 1}
              onChange={userChange}
              attr-which="multiplayerOffline"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="multiplayerCoop">Multiplayer: Offline Coop</label>
            <InputText
              id="multiplayerCoop"
              value={gameForm?.multiplayer_modes?.offlinecoopmax || 1}
              onChange={userChange}
              attr-which="multiplayerCoop"
              type="number"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="splitscreen">Splitscreen?</label>
            <InputSwitch
              id="splitscreen"
              checked={!!gameForm?.multiplayer_modes?.splitscreen}
              onChange={userChange}
              attr-which="splitscreen"
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
              className="long-text-area"
              id="description"
              value={gameForm?.description}
              onChange={userChange}
              attr-which="description"
              autoResize={true}
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="story">Storyline</label>
            <InputTextarea
              className="long-text-area"
              id="story"
              value={gameForm?.story}
              onChange={userChange}
              attr-which="story"
              autoResize={true}
            />
          </div>
          <div className="divider">
            <hr />
            <h3>Collection Data</h3>
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
            <label htmlFor="condition">Condition</label>
            <Dropdown
              value={gameForm?.condition}
              options={conditionOptions}
              onChange={(e) => handleDropdown(e, 'condition')}
              attr-which="condition"
              id="condition"
              scrollHeight="400"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="case">Case</label>
            <Dropdown
              value={gameForm?.case}
              options={caseOptions}
              onChange={(e) => handleDropdown(e, 'case')}
              attr-which="case"
              id="case"
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
            <label htmlFor="manual">Manual?</label>
            <InputSwitch
              id="manual"
              checked={!!gameForm?.manual}
              onChange={userChange}
              attr-which="manual"
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
            <label htmlFor="handheld">Handheld?</label>
            <InputSwitch
              id="handheld"
              checked={!!gameForm?.handheld}
              onChange={userChange}
              attr-which="handheld"
            />
          </div>
          <div className="crud-form--form__row">
            <label htmlFor="compilation">Compilation?</label>
            <InputSwitch
              id="compilation"
              checked={!!gameForm?.compilation}
              onChange={userChange}
              attr-which="compilation"
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
          {gameForm && (
            <GameFormGameService addMode={addMode} userChange={userChange} game={gameForm} />
          )}
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
          label="Close"
          onClick={cancelClicked}
          icon="pi pi-times"
          className="p-button-info"
        />
        <Button
          label={`Save ${gameForm?.name}`}
          onClick={updateGame}
          icon="pi pi-save"
          className="p-button-success"
          disabled={!loggedIn}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ userState }: { userState: boolean }): MapStateProps => {
  return {
    userState
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setUserState: (state: boolean) => dispatch(changeUserState(state))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameForm);
