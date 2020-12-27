import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Rating } from 'primereact/rating';
import './GameDialog.scss';
import { IConsoleArr } from '@/models/platforms.model';
import { IGame } from '@/models/games.model';
import assetsService from '../../services/assets.service';
import UrlService from '../../services/url.service';
import helpersService from '../../services/helpers.service';
import ReadMore from '../ReadMore/ReadMore';
import { Button } from 'primereact/button';
import VideoGallery from '../VideoGallery/VideoGallery';
// import { getEbayPrices } from '../../services/globalData.service';

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
  howAcquired?: string;
  pricePaid?: number;
  condition?: string;
}

const GameDialog: FunctionComponent<PropsWithChildren<any>> = ({ game }: { game: IGame }) => {
  const urlPrefix = UrlService.assets;
  const [showVideos, setShowVideos] = useState(false);
  const ratingImages = (letter: string): string => {
    const ratings: IRatings = assetsService.ratings;
    return ratings.hasOwnProperty(letter) ? ratings[letter] : '';
  };
  const [consolesOwnedFor, setConsolesOwnedFor] = useState<IConsolesOwned[]>([]);

  // const getEbayPrice = () => {
  //   const queryString = `${game.name} ${game.consoleName}`;
  //   getEbayPrices(queryString)
  //     .then((result: any) => {
  //       console.log('ebay', result);
  //     })
  //     .catch((error: any) => {
  //       console.log('ebay error', error);
  //     });
  // };

  const loadVideos = (load?: boolean) => {
    if (load) {
      setShowVideos(true);
    } else {
      setShowVideos(false);
    }
  };

  useEffect(() => {
    if (game) {
      const owned =
        game.consoleArr && game.consoleArr.length
          ? game.consoleArr.filter((g) => g.hasOwnProperty('physical'))
          : [];
      setConsolesOwnedFor(owned);
      // getEbayPrice();
    }
  }, [game]);

  return game ? (
    <section className="game-dialog" role="dialog">
      <div className="game-dialog--body">
        <div className="game-dialog--body__image-and-deck">
          <img
            src={game.image}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = `${urlPrefix}Video-Game-Controller-Icon.svg.png`;
            }}
            alt={game.name + ' cover image'}
          />
          {!showVideos && (
            <div className="right-container">
              {game.description?.length && <ReadMore textString={game.description} />}

              <div className="card-row tables-row">
                <table style={{ marginRight: '2rem' }} className="card-row--table">
                  <tbody>
                    <tr>
                      <td className="table-cat">Originally released</td>
                      <td>{game.first_release_date}</td>
                    </tr>
                    <tr>
                      <td className="table-cat">Perspectives</td>
                      <td>{game.player_perspectives?.join(', ') || 'Unknown'}</td>
                    </tr>
                    <tr>
                      <td className="table-cat">Rating</td>
                      <td>
                        <Rating
                          value={Math.round(game.total_rating / 20)}
                          readonly
                          stars={5}
                          cancel={!game.total_rating}
                          disabled={!game.total_rating}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="card-row--table">
                  <tbody>
                    <tr>
                      <td className="table-cat">Multiplayer</td>
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
                      <td className="table-cat">Genres</td>
                      <td>{game.genres.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="table-cat">Physical/Digital/BC</td>
                      <td>{helpersService.physicalDigitalBcText(game)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {consolesOwnedFor && consolesOwnedFor.length && (
                <table className="owned-for">
                  <tr>
                    <th>Platform</th>
                    <th>Price Paid</th>
                    <th>Date Purchased</th>
                    <th>How Acquired</th>
                    <th>Physical</th>
                    <th>Condition</th>
                    <th>Case</th>
                    <th>CIB</th>
                  </tr>
                  <tbody>
                    {consolesOwnedFor.map((con, index) => (
                      <tr>
                        <td>{con.consoleName}</td>
                        <td>${con.pricePaid}</td>
                        <td>{con.datePurchased}</td>
                        <td>{con.howAcquired}</td>
                        <td>{con.physical ? 'Physical' : 'Digital'}</td>
                        <td>{con.condition}</td>
                        <td>{con.case}</td>
                        <td>{con.cib ? 'YES' : 'NO'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {game.notes && game.notes.length && (
                <div className="game-notes">
                  <div className="game-notes--head">Notes</div>
                  <div>{game.notes}</div>
                </div>
              )}
            </div>
          )}
          {showVideos && game.videos?.length && <VideoGallery videos={game.videos} />}
        </div>
        {game.videos && (
          <div style={{ marginLeft: '2.5rem' }}>
            {!showVideos && <Button icon="pi pi-video" label="Videos" onClick={() => loadVideos(true)} />}
            {showVideos && <Button icon="pi pi-th-large" label="Data" onClick={() => loadVideos(false)} />}
          </div>
        )}
        <div className="image-container">
          <img
            src={
              game && game.esrb
                ? `${urlPrefix}/${ratingImages(game.esrb)}`
                : `${urlPrefix}Video-Game-Controller_Icon.svg.png`
            }
            alt="ESRB Rating"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = `${urlPrefix}Video-Game-Controller-Icon.svg.png`;
            }}
          />
          {game && game.esrb ? <></> : <h3>NO RATING</h3>}
          <div className="extra-data">
            {game.extraData &&
              game.extraData.length > 0 &&
              game.extraData.map((g, ind) => {
                if (g) {
                  return <div key={ind}>{g}</div>;
                } else {
                  return null;
                }
              })}
          </div>
        </div>
        <h4>{game && game.name ? game.name : ''} can be played on:</h4>
        <div className="game-dialog--body__consoles">
          {game && game.consoleArr ? (
            game.consoleArr.map((con: IConsoleArr, index: number) => (
              <img
                src={`${urlPrefix}${(assetsService.platformLogos as IRatings)[con.consoleName]}`}
                alt={con.consoleName}
                key={index}
                style={{
                  maxWidth: `${90 / (game && game.consoleArr ? game.consoleArr.length : 1)}%`,
                  objectFit: 'contain'
                }}
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
