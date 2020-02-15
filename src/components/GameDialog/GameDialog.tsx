import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Rating } from 'primereact/rating';
import './GameDialog.scss';
import { IConsoleArr, IGame } from '../../common.model';
import assetsService from '../../services/assets.service';

interface IRatings {
  [key: string]: string;
}

const GameDialog: FunctionComponent<PropsWithChildren<any>> = props => {
  const game: IGame = props.game;
  const ratingImages = (letter: string): string => {
    const ratings: IRatings = assetsService.ratings;
    return ratings.hasOwnProperty(letter) ? ratings[letter] : '';
  };

  return game ? (
    <section className="game-dialog" role="dialog">
      <div className="game-dialog--body">
        <div className="game-dialog--body__image-and-deck">
          <img
            src={game.gb.image}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = 'Video-Game-Controller-Icon.svg.png';
            }}
            alt={game.igdb.name + ' cover image'}
          />
          <div className="right-container">
            <p>{game.gb.deck}</p>
            <div className="card-row">
              <table style={{ marginRight: '2rem' }}>
                <tbody>
                  <tr>
                    <td className="table-cat">Originally released</td>
                    <td>{game.igdb.first_release_date}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Developer</td>
                    <td>{game.igdb['developers']}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Max # Players</td>
                    <td>{game.multiplayerNumber}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Genres</td>
                    <td>{game.igdb.genres.join(', ')}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Physical Copy</td>
                    <td>{game.physical ? 'YES' : 'NO'}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">CIB</td>
                    <td>{game.cib ? 'YES' : 'NO'}</td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td className="table-cat">Case</td>
                    <td>{game.case}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Condition</td>
                    <td>{game.condition}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Purchase Date</td>
                    <td>{game.datePurchased}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Purchase Price</td>
                    <td>$ {game.pricePaid}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">How Acquired</td>
                    <td>{game.howAcquired}</td>
                  </tr>
                  <tr>
                    <td className="table-cat">Rating</td>
                    <td>
                      <Rating
                        value={Math.round(game.igdb.total_rating / 20)}
                        readonly
                        stars={5}
                        cancel={!game.igdb.total_rating}
                        disabled={!game.igdb.total_rating}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="image-container">
          <img
            src={
              game && game.igdb && game.igdb.esrb
                ? ratingImages(game.igdb.esrb)
                : 'Video-Game-Controller_Icon.svg.png'
            }
            alt="ESRB Rating"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = 'Video-Game-Controller-Icon.svg.png';
            }}
          />
          {game && game.igdb && game.igdb.esrb ? <></> : <h3>NO RATING</h3>}
          <div className="extra-data">
            {game.extraData &&
              game.extraData.length > 0 &&
              game.extraData.map(g => {
                if (g) {
                  return <div>{g}</div>;
                } else {
                  return null;
                }
              })}
          </div>
        </div>
        <h4>{game && game.igdb ? game.igdb.name : ''} can be played on:</h4>
        <div className="game-dialog--body__consoles">
          {game && game.consoleArr ? (
            game.consoleArr.map((con: IConsoleArr, index: number) => (
              <img
                src={(assetsService.platformLogos as IRatings)[con.consoleName]}
                alt={con.consoleName}
                key={index}
                style={{
                  maxWidth: `${90 / (game && game.consoleArr ? game.consoleArr.length : 1)}%`
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
