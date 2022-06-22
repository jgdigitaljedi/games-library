import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Rating } from 'primereact/rating';
import './GameDialog.scss';
import { IConsoleArr } from '@/models/platforms.model';
import { IGame } from '@/models/games.model';
import {
  platformLogos,
  parentalRatings,
  canBePlayedOn,
  LogoReturn
} from '../../services/assets.service';
import UrlService from '../../services/url.service';
import helpersService, { gameCaseSubTypes } from '../../services/helpers.service';
import ReadMore from '../ReadMore/ReadMore';
import { Button } from 'primereact/button';
import VideoGallery from '../VideoGallery/VideoGallery';
import { uniq as _uniq } from 'lodash';
import { uniqBy as _uniqBy } from 'lodash';
import { IPriceChartingData } from '@/models/pricecharting.model';
import { CurrencyUtils } from 'stringman-utils';

interface IRatings {
  [key: string]: string;
}

interface IConsolesOwned {
  consoleName: string;
  physical?: boolean;
  consoleId: number;
  datePurchased?: string;
  cib?: boolean;
  case?: string;
  caseType?: string;
  howAcquired?: string;
  pricePaid?: number;
  condition?: string;
  priceCharting?: IPriceChartingData;
}

const GameDialog: FunctionComponent<PropsWithChildren<any>> = ({ game }: { game: IGame }) => {
  const urlPrefix = UrlService.assets;
  const [showVideos, setShowVideos] = useState(false);
  const [vrStatus, setVrStatus] = useState<string>('');
  const [gameTotals, setGameTotals] = useState({ amount: 0, paid: 0, value: 0 });
  const ratingImages = (letter: string): string => {
    const ratings: IRatings = parentalRatings;
    return ratings.hasOwnProperty(letter) ? ratings[letter] : '';
  };
  const [consolesOwnedFor, setConsolesOwnedFor] = useState<IConsolesOwned[]>([]);

  const currencyUtils = new CurrencyUtils({ language: 'en', country: 'US' }, 'USD');

  const loadVideos = (load?: boolean) => {
    if (load) {
      setShowVideos(true);
    } else {
      setShowVideos(false);
    }
  };

  const getVrStatus = useCallback(() => {
    if (game) {
      const vr = game.vr;
      if (!vr || (!vr.vrOnly && !vr.vrCompatible)) {
        setVrStatus('NO VR');
      } else if (vr.vrOnly) {
        setVrStatus('VR ONLY');
      } else if (vr.vrCompatible) {
        setVrStatus('VR COMPATIBLE');
      }
    }
  }, [game]);

  const getExtraData = () => {
    if (game?.extraData) {
      return _uniq(game.extraData)
        .map((g, ind) => {
          if (g) {
            return <div key={ind}>{g}</div>;
          } else {
            return null;
          }
        })
        .filter(p => p);
    } else {
      return <></>;
    }
  };

  const everdriveConsole = () => {
    return (
      <div className='game-dialog--everdrive-platform'>
        <h4 className='game-dialog--everdrive-platform__label'>Original Platform</h4>
        <div>{game.consoleName}</div>
      </div>
    );
  };

  const formatCaseType = (type: string) => {
    return gameCaseSubTypes.find(gct => gct.value === type)?.label;
  };

  const gameCanBePlayedOn = useMemo(
    (consoleArr?: IConsoleArr[]) => {
      if (game?.consoleArr) {
        const compatiblePlatforms = canBePlayedOn(game?.consoleArr);
        console.log('comp', compatiblePlatforms);
        return compatiblePlatforms;
      }
      return [];
    },
    [game]
  );

  useEffect(() => {
    if (game) {
      // getCanBePlayedOn(game.consoleArr);
      const owned =
        game.consoleArr && game.consoleArr.length
          ? game.consoleArr.filter(g => g.hasOwnProperty('physical'))
          : [];
      setConsolesOwnedFor(owned);
      getVrStatus();
      const totalPaid: number = owned.reduce((acc, item) => {
        if (acc === undefined) {
          acc = 0;
        }
        if (item.pricePaid) {
          acc += parseFloat(`${item.pricePaid}`);
        }
        return acc;
      }, 0);
      const totalPcPrice: number = owned.reduce((acc, item) => {
        if (acc === undefined) {
          acc = 0;
        }
        if (item.priceCharting?.price) {
          acc += parseFloat(`${item.priceCharting.price}`);
        }
        return acc;
      }, 0);
      setGameTotals({
        amount: owned.length,
        paid: totalPaid || 0,
        value: totalPcPrice || 0
      });
    }
  }, [game, getVrStatus]);

  return game ? (
    <section className='game-dialog' role='dialog'>
      <div className='game-dialog--body'>
        <div className='game-dialog--body__image-and-deck'>
          <img
            src={game.image}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = `${urlPrefix}Video-Game-Controller-Icon.svg.png`;
            }}
            alt={game.name + ' cover image'}
          />
          {!showVideos && (
            <div className='right-container'>
              {game.description?.length && <ReadMore textString={game.description} />}

              <div className='card-row tables-row'>
                <table style={{ marginRight: '2rem' }} className='card-row--table'>
                  <tbody>
                    <tr>
                      <td className='table-cat'>Originally released</td>
                      <td>{game.first_release_date}</td>
                    </tr>
                    <tr>
                      <td className='table-cat'>Perspectives</td>
                      <td>{game.player_perspectives?.join(', ') || 'Unknown'}</td>
                    </tr>
                    <tr>
                      <td className='table-cat'>Rating</td>
                      <td>
                        <Rating
                          value={Math.round(game.total_rating / 20)}
                          readOnly
                          stars={5}
                          cancel={!game.total_rating}
                          disabled={!game.total_rating}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className='table-cat'>VR Status</td>
                      <td>{vrStatus}</td>
                    </tr>
                  </tbody>
                </table>
                <table className='card-row--table'>
                  <tbody>
                    <tr>
                      <td className='table-cat'>Multiplayer</td>
                      {game?.multiplayer_modes && (
                        <td>
                          VS: {game.multiplayer_modes.offlinemax} / Co-op:{' '}
                          {game.multiplayer_modes.offlinecoopmax} / Splitscreen:
                          {game.multiplayer_modes.splitscreen ? ' YES' : ' NO'}
                        </td>
                      )}
                      {!game.multiplayer_modes && game.maxMultiplayer && (
                        <td>{game.maxMultiplayer}</td>
                      )}
                      {!game.multiplayer_modes && !game.maxMultiplayer && <td>NO</td>}
                    </tr>
                    <tr>
                      <td className='table-cat'>Genres</td>
                      <td>{game.genres.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className='table-cat'>Physical/Digital/BC</td>
                      <td>{helpersService.physicalDigitalBcText(game)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {consolesOwnedFor && consolesOwnedFor.length > 0 && (
                <table className='owned-for'>
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Price Paid</th>
                      <th>PC Price</th>
                      <th>PC Date</th>
                      <th>Physical</th>
                      <th>Condition</th>
                      <th>Case</th>
                      <th>CIB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolesOwnedFor.map((con, index) => (
                      <tr key={`con-row-${index}`}>
                        <td>{con.consoleName}</td>
                        <td>
                          {con.pricePaid
                            ? currencyUtils.formatCurrencyDisplay(con.pricePaid)
                            : '??'}
                        </td>
                        <td>
                          {con.priceCharting?.price
                            ? currencyUtils.formatCurrencyDisplay(con.priceCharting?.price)
                            : '??'}
                        </td>
                        <td>{con.priceCharting?.lastUpdated || '??'}</td>
                        <td>{con.physical ? 'Physical' : 'Digital'}</td>
                        <td>{con.condition}</td>
                        <td>{`${con.case}${
                          con.caseType && con.caseType !== 'none'
                            ? ' - ' + formatCaseType(con.caseType)
                            : ''
                        }`}</td>
                        <td>{con.cib ? 'Y' : 'N'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>{gameTotals.amount}</td>
                      <td>{currencyUtils.formatCurrencyDisplay(gameTotals.paid)}</td>
                      <td>{currencyUtils.formatCurrencyDisplay(gameTotals.value)}</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  </tfoot>
                </table>
              )}
              {game.physicalDigital.indexOf('EverDrive') >= 0 && everdriveConsole()}
              {game.notes && game.notes.length && (
                <div className='game-notes'>
                  <div className='game-notes--head'>Notes</div>
                  <div>{game.notes}</div>
                </div>
              )}
            </div>
          )}
          {/* @ts-ignore */}
          {showVideos && game?.videos?.length > 0 && <VideoGallery videos={game.videos} />}
        </div>
        {!!game?.videos?.length && (
          <div style={{ marginLeft: '1rem' }}>
            {!showVideos && (
              <Button icon='pi pi-video' label='Videos' onClick={() => loadVideos(true)} />
            )}
            {showVideos && (
              <Button icon='pi pi-th-large' label='Data' onClick={() => loadVideos(false)} />
            )}
          </div>
        )}
        <div className='image-container'>
          <img
            src={`${urlPrefix}${ratingImages(game.esrb)}`}
            alt='ESRB Rating'
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = `${urlPrefix}Video-Game-Controller-Icon.svg.png`;
            }}
          />
          {game && game.esrb ? <></> : <h3>NO RATING</h3>}
          {/*@ts-ignore */}
          <div className='extra-data'>{game.extraData?.length >= 1 && getExtraData()}</div>
        </div>
        <h4>{game && game.name ? game.name : ''} can be played on:</h4>
        <div className='game-dialog--body__consoles'>
          {gameCanBePlayedOn ? (
            gameCanBePlayedOn.map((img: LogoReturn, index: number) => (
              <img
                src={`${urlPrefix}${img.img}`}
                alt={img.name}
                key={`image-${index}`}
                style={{
                  maxWidth: `${90 / (gameCanBePlayedOn ? gameCanBePlayedOn.length : 1)}%`,
                  objectFit: 'contain'
                }}
                title={img.name}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default GameDialog;
