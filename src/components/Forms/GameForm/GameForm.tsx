import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext,
  MouseEventHandler
} from 'react';
import { IGame } from '@/models/games.model';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { cloneDeep as _cloneDeep, set as _set, find as _find } from 'lodash';
import HelpersService, {
  filterCaseTypesByConsole,
  gameCaseSubTypes
} from '../../../services/helpers.service';
import { handleChange } from '@/services/forms.service';
import { igdbGameSearch, igdbUpdateById, saveGame } from '@/services/gamesCrud.service';
import { getPlatformsWithIds } from '@/services/platformsCrud.service';
import { NotificationContext } from '@/context/NotificationContext';
import { Chips } from 'primereact/chips';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import changeUserState from '../../../actionCreators/userState';
import GameFormGameService from './GameFormGameService';
import moment from 'moment';
import PcPriceComponent from '../PcPriceComponent/PcPriceComponent';
import { formatFormResult, formatUpdateData, getPriceById } from '@/services/pricecharting.service';
import { IPriceChartingData } from '@/models/pricecharting.model';
import PcPriceDetailsComponent from '../PcPriceDetails/PcPriceDetailsComponent';

interface IProps extends MapDispatchProps, MapStateProps {
  game: IGame;
  closeDialog: Function;
  closeConfirmation: () => void;
  howAcquiredOptions: string[];
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
const GameForm: FunctionComponent<IProps> = ({
  game,
  closeDialog,
  closeConfirmation,
  howAcquiredOptions
}: IProps) => {
  const loggedIn = useSelector((state: any) => state.userState);
  const [gameForm, setGameForm] = useState<IGameEdit>();
  const [addMode, setAddMode] = useState<boolean>(false);
  const [igdbGames, setIgdbGames] = useState<any[]>();
  const [platformIdArr, setPlatformIdArr] = useState<any>();
  const [searchPlatform, setSearchPlatform] = useState<any>();
  const [fuzzySearch, setFuzzySearch] = useState(false);
  const [vrStatus, setVrStatus] = useState<string>('');
  const [caseSubTypes, setCaseSubTypes] = useState<any>(gameCaseSubTypes);
  const [haOptions, setHaOptions] = useState<string[]>([]);
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

  const vrOptions = [
    { name: 'None', value: 'none' },
    { name: 'VR Only', value: 'vrOnly' },
    { name: 'VR Compatible', value: 'vrCompatible' }
  ];

  const userChange = (e: any) => {
    closeConfirmation();
    const newState = handleChange(e, gameForm);
    if (newState) {
      setGameForm(newState);
    }
  };

  const handleDropdown = useCallback(
    (e: any, which: string) => {
      closeConfirmation();
      const copy = _cloneDeep(gameForm);
      if (copy) {
        _set(copy, which, e.value);
        setGameForm(copy);
      }
    },
    [closeConfirmation, gameForm]
  );

  const searchIgdb = useCallback(async () => {
    closeConfirmation();
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
  }, [closeConfirmation, gameForm, searchPlatform, setNotify]);

  const searchHowAcquired = (event: any) => {
    const query = event?.query;
    if (query && howAcquiredOptions?.length) {
      const newOptions = howAcquiredOptions.filter(opt => {
        return opt.match(new RegExp(query, 'gi'));
      });
      setHaOptions(newOptions);
    } else {
      setHaOptions(howAcquiredOptions);
    }
  };

  const isUpdate = useCallback(() => {
    return !addMode && gameForm?.hasOwnProperty('_id');
  }, [addMode, gameForm]);

  const updateGame = useCallback(() => {
    const gameCopy = _cloneDeep(gameForm as IGameEdit);

    const isPatch = isUpdate();
    if (!isPatch) {
      // @ts-ignore
      gameCopy.datePurchased = moment(gameCopy.newDatePurchased).format('YYYY-MM-DD');
    }
    if (!game.consoleName && searchPlatform) {
      const platformName = _find(platformIdArr, p => p.value === searchPlatform);
      if (platformName) {
        gameCopy.consoleName = platformName.label;
      } else {
        // @TODO: throw error
      }
    }
    saveGame(gameCopy, isPatch)
      .then(result => {
        closeDialog(gameForm?.name, true, 'added');
      })
      .catch(error => {
        console.log('save error', error);
        closeDialog(gameForm?.name, false, 'added');
      });
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
  }, [gameForm, isUpdate, game, searchPlatform, platformIdArr, closeDialog]);

  const cancelClicked = () => {
    closeConfirmation();
    resetGameForm();
    closeDialog(null);
  };

  const resetGameForm = useCallback(() => {
    // @ts-ignore
    setGameForm(HelpersService.resetGameForm());
  }, [setGameForm]);

  const searchSelection = (e: any) => {
    closeConfirmation();
    if (e?.value) {
      const game = e.value;
      // setSelectedFromSearch(game);
      const gfCopy = _cloneDeep(gameForm);
      // @ts-ignore
      setGameForm(Object.assign(gfCopy, game));
    }
  };

  const platformSelected = (e: any): void => {
    const gfCopy = _cloneDeep(gameForm);
    if (gfCopy) {
      const name = _find(platformIdArr, p => p.value === e.value);
      gfCopy.consoleName = name.label;
      setGameForm(gfCopy);
    }
    setSearchPlatform(e.value);
    setCaseSubTypes(filterCaseTypesByConsole(e.value));
  };

  const vrChange = (e: any) => {
    if (gameForm) {
      setVrStatus(e.value);
      const gCopy = _cloneDeep(gameForm);
      switch (e.value) {
        case 'none':
          gCopy.vr = { vrOnly: false, vrCompatible: false };
          break;
        case 'vrOnly':
          gCopy.vr = { vrOnly: true, vrCompatible: false };
          break;
        case 'vrCompatible':
          gCopy.vr = { vrOnly: false, vrCompatible: true };
          break;
        default:
          gCopy.vr = { vrOnly: false, vrCompatible: false };
      }
      setGameForm(gCopy);
    }
  };

  const setPricechartingData = (data: IPriceChartingData) => {
    if (gameForm) {
      const updatedGame = { ...gameForm, priceCharting: data };
      setGameForm(updatedGame);
    }
  };

  const updatePcData = async (e: MouseEventHandler<HTMLButtonElement>) => {
    // @ts-ignore
    e.preventDefault();
    if (gameForm?.priceCharting?.id) {
      const newData = await getPriceById(gameForm?.priceCharting?.id);
      const formatted = formatUpdateData(newData.data, gameForm.priceCharting, gameForm.manual);
      setGameForm({ ...gameForm, priceCharting: formatted });
    }
  };

  const caseManuallyChanged = useCallback(
    value => {
      if (gameForm?.priceCharting && value) {
        const gfCopy = _cloneDeep(gameForm);
        // @ts-ignore
        gfCopy.priceCharting.case = value;
        setGameForm(gfCopy);
      }
    },
    [gameForm]
  );

  const updateIgdbData = (e: MouseEventHandler<HTMLButtonElement>) => {
    // @ts-ignore
    e.preventDefault();
    igdbUpdateById(game)
      .then(result => {
        if (result?.data) {
          setGameForm(result.data);
        } else {
          setNotify({
            severity: 'error',
            detail: 'Error updating IGDB data (empty response).',
            summary: 'ERROR'
          });
        }
      })
      .catch(error => {
        setNotify({
          severity: 'error',
          detail: 'Error fetching platforms with ids.',
          summary: 'ERROR'
        });
        console.log('update game error', error);
      });
  };

  useEffect(() => {
    if (game && (game.name === '' || game.name === 'Add Game')) {
      setAddMode(true);
    }
    if (game) {
      const vrLoad = game.vr || { vrOnly: false, vrCompatible: false };
      if (vrLoad?.vrOnly) {
        setVrStatus('vrOnly');
      } else if (vrLoad?.vrCompatible) {
        setVrStatus('vrCompatible');
      } else {
        setVrStatus('none');
      }
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
        .catch(error => {
          console.log('ERROR FETCHING PLATFORMS WITH IDS', error);
          setNotify({
            severity: 'error',
            detail: 'Error fetching platforms with ids.',
            summary: 'ERROR'
          });
        });
    }
  }, [setPlatformIdArr, setNotify, platformIdArr]);

  return (
    <div className='crud-form game-form--wrapper'>
      <div className='crud-form--flex-wrapper'>
        <form className='crud-from--form game-form--form'>
          <div className='crud-form--form__row'>
            {addMode && loggedIn && (
              <div className='igdb-search-fields'>
                <h3>Search IGDB</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '.5rem' }}>
                  <label htmlFor='fuzzy'>Fuzzy Search</label>
                  <InputSwitch
                    id='fuzzy'
                    checked={!!fuzzySearch}
                    onChange={() => setFuzzySearch(!fuzzySearch)}
                  />
                </div>
                <Dropdown
                  className='search-field'
                  value={searchPlatform}
                  options={platformIdArr}
                  onChange={platformSelected}
                  id='search-platform'
                  placeholder='Platform to search'
                  disabled={fuzzySearch}
                />
                <AutoComplete
                  dropdown
                  className='search-field'
                  delay={600}
                  id='name'
                  value={gameForm?.name}
                  onChange={userChange}
                  onSelect={searchSelection}
                  attr-which='name'
                  suggestions={igdbGames}
                  completeMethod={searchIgdb}
                  field='name'
                  disabled={!searchPlatform && !fuzzySearch}
                />
                <hr />
              </div>
            )}
          </div>
          {!addMode && loggedIn && (
            <div className='divider'>
              <hr />
            </div>
          )}
          <div className='crud-form--form__row'>
            <label htmlFor='name'>Name</label>
            <InputText
              id='name'
              value={gameForm?.name}
              onChange={userChange}
              attr-which='name'
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='consoleName'>For Console</label>
            <InputText
              id='consoleName'
              value={gameForm?.consoleName}
              attr-which='consoleName'
              readOnly
            />
          </div>
          <div className='divider'>
            <hr />
          </div>
          <h3>Data from IGDB</h3>
          {!addMode && loggedIn && (
            <div className='crud-form--form__row'>
              <Button
                // @ts-ignore
                onClick={updateIgdbData}
                label='Update IGDB Data'
                className='p-button-primary'
                icon='pi pi-arrow-circle-up'
              />
            </div>
          )}
          <div className='crud-form--form__row'>
            <label htmlFor='total_rating'>Total Rating</label>
            <InputText
              id='total_rating'
              value={gameForm?.total_rating}
              onChange={userChange}
              attr-which='total_rating'
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='videos'>Videos</label>
            <Chips
              id='videos'
              value={gameForm?.videos || []}
              onChange={userChange}
              attr-which='videos'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='genres'>Genres</label>
            <Chips
              id='genres'
              value={gameForm?.genres || []}
              onChange={userChange}
              attr-which='genres'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='esrb'>ESRB Rating</label>
            <Dropdown
              value={gameForm?.esrb}
              options={esrbOptions}
              onChange={e => handleDropdown(e, 'esrb')}
              attr-which='esrb'
              id='esrb'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='playerPerspectives'>Player Perspectives</label>
            <Chips
              id='playerPerspectives'
              value={gameForm?.player_perspectives || []}
              onChange={userChange}
              attr-which='player_perspectives'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='maxMultiplayer'>Max Multiplayer</label>
            <InputText
              id='maxMultiplayer'
              value={gameForm?.maxMultiplayer || 1}
              onChange={userChange}
              attr-which='maxMultiplayer'
              type='number'
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='multiplayerOffline'>Multiplayer: Offline VS</label>
            <InputText
              id='multiplayerOffline'
              value={gameForm?.multiplayer_modes?.offlinemax}
              onChange={userChange}
              attr-which='multiplayer_modes.offlinemax'
              type='number'
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='multiplayerCoop'>Multiplayer: Offline Coop</label>
            <InputText
              id='multiplayerCoop'
              value={gameForm?.multiplayer_modes?.offlinecoopmax}
              onChange={userChange}
              attr-which='multiplayer_modes.offlinecoopmax'
              type='number'
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='splitscreen'>Splitscreen?</label>
            <InputSwitch
              id='multiplayer_modes.splitscreen'
              checked={!!gameForm?.multiplayer_modes?.splitscreen}
              onChange={userChange}
              attr-which='multiplayer_modes.splitscreen'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='image'>Image URL</label>
            <InputText
              id='image'
              value={gameForm?.image}
              onChange={userChange}
              attr-which='image'
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='description'>Description</label>
            <InputTextarea
              className='long-text-area'
              id='description'
              value={gameForm?.description}
              onChange={userChange}
              attr-which='description'
              autoResize={true}
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='story'>Storyline</label>
            <InputTextarea
              className='long-text-area'
              id='story'
              value={gameForm?.story}
              onChange={userChange}
              attr-which='story'
              autoResize={true}
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='divider'>
            <hr />
            <h3>Collection Data</h3>
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='howAcquired'>How Acquired</label>
            <AutoComplete
              dropdown
              className='search-field'
              delay={100}
              id='howAcquired'
              value={gameForm?.howAcquired}
              onChange={userChange}
              attr-which='howAcquired'
              suggestions={haOptions}
              completeMethod={searchHowAcquired}
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='pricePaid'>Price Paid</label>
            <InputText
              id='pricePaid'
              value={gameForm?.pricePaid}
              onChange={userChange}
              attr-which='pricePaid'
              type='number'
              keyfilter='pnum'
              min={0}
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='date-purchased'>Date Purchased</label>
            <Calendar
              id='newDatePurchased'
              showIcon={true}
              value={gameForm?.newDatePurchased}
              onChange={userChange}
              attr-which='newDatePurchased'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='condition'>Condition</label>
            <Dropdown
              value={gameForm?.condition}
              options={conditionOptions}
              onChange={e => handleDropdown(e, 'condition')}
              attr-which='condition'
              id='condition'
              scrollHeight='400'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='case'>Case</label>
            <Dropdown
              value={gameForm?.case}
              options={caseOptions}
              onChange={e => handleDropdown(e, 'case')}
              attr-which='case'
              id='case'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='caseType'>Case Type</label>
            <Dropdown
              value={gameForm?.caseType}
              options={caseSubTypes}
              onChange={e => handleDropdown(e, 'caseType')}
              attr-which='caseType'
              id='caseType'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='cib'>CIB?</label>
            <InputSwitch
              id='cib'
              checked={!!gameForm?.cib}
              onChange={userChange}
              attr-which='cib'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='manual'>Manual?</label>
            <InputSwitch
              id='manual'
              checked={!!gameForm?.manual}
              onChange={userChange}
              attr-which='manual'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='physical'>Physical Copy?</label>
            <InputSwitch
              id='physical'
              checked={!!gameForm?.physical}
              onChange={userChange}
              attr-which='physical'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='handheld'>Handheld?</label>
            <InputSwitch
              id='handheld'
              checked={!!gameForm?.handheld}
              onChange={userChange}
              attr-which='handheld'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='compilation'>Compilation?</label>
            <InputSwitch
              id='compilation'
              checked={!!gameForm?.compilation}
              onChange={userChange}
              attr-which='compilation'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='vr-only'>VR?</label>
            <SelectButton
              value={vrStatus}
              options={vrOptions}
              onChange={vrChange}
              optionLabel='name'
            />
          </div>
          <div className='crud-form--form__row'>
            <label htmlFor='notes'>Notes</label>
            <InputTextarea
              id='description'
              value={gameForm?.notes}
              onChange={userChange}
              attr-which='notes'
              autoResize={true}
              cols={50}
              onFocus={() => closeConfirmation()}
            />
          </div>
          <div className='divider'>
            <hr />
            <h3>PriceCharting Data</h3>
          </div>
          {gameForm?.priceCharting && loggedIn && !addMode && (
            <div className='crud-form--form__row'>
              <Button
                // @ts-ignore
                onClick={updatePcData}
                label='Update PriceCharting Data'
                disabled={!gameForm?.priceCharting?.id}
                className='p-button-primary'
                icon='pi pi-arrow-circle-up'
              />
            </div>
          )}
          {gameForm?.physical && (
            <div className='crud-form--form__row'>
              <label htmlFor='pc-input'>Price Charting</label>
              <PcPriceComponent
                data-id='pc-input'
                item={formatFormResult(gameForm as IGame, 'GAME')}
                onSelectionMade={setPricechartingData}
              />
            </div>
          )}
          {/** eslint-disable-next-line */}
          {gameForm?.priceCharting && (
            <PcPriceDetailsComponent
              pcData={gameForm.priceCharting}
              caseChangeCb={caseManuallyChanged}
              hasManual={gameForm.manual}
            />
          )}
          {gameForm && (
            <GameFormGameService addMode={addMode} userChange={userChange} game={gameForm} />
          )}
        </form>
        <div className='crud-form--image-and-data'>
          {gameForm?.image && <img src={gameForm?.image} alt='game cover art or logo' />}
          {gameForm?.extraData && gameForm.extraData.length > 0 && (
            <div className='crud-form--image-and-data__extra-data'>
              {gameForm.extraData.map((data, index) => (
                <p key={index}>{data}</p>
              ))}
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className='crud-form--footer'>
        <Button
          label='Close'
          onClick={cancelClicked}
          icon='pi pi-times'
          className='p-button-info'
        />
        <Button
          label={`Save ${gameForm?.name}`}
          onClick={updateGame}
          icon='pi pi-save'
          className='p-button-success'
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
