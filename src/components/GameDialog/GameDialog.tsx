import React, { FunctionComponent, PropsWithChildren } from 'react';
import './GameDialog.scss';
import { IConsoleArr, IGame } from '../../common.model';

interface IRatings {
  [key: string]: string;
}

const GameDialog: FunctionComponent<PropsWithChildren<any>> = (props) => {
  const game: IGame = props.game;
  const ratingImages = (letter: string): string => {
    const ratings: IRatings  = {
      E: 'ESRB_2013_Everyone.svg',
      M: 'ESRB_2013_Mature.svg',
      T: 'ESRB_2013_Teen.svg',
      RP: 'ESRB_2013_Rating_Pending.svg',
      'E10+': 'ESRB_2013_Everyone_10+.svg',
    };
    return ratings.hasOwnProperty(letter) ?  ratings[letter] : '';
  };

  return game ? (
    <section className="game-dialog">
      <div className="game-dialog--body">
        <div className="game-dialog--body__image-and-deck">
          <img src={game.gb.image} onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = 'Video-Game-Controller-Icon.svg.png';
          }} alt={game.igdb.name + ' cover image'} />
          <div className="right-container">
            <p>{game.gb.deck}</p>
            <div className="card-row">
              <table>
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
                </tbody>
              </table>
              <img src={game && game.igdb && game.igdb.esrb ? ratingImages(game.igdb.esrb) : 'Video-Game-Controller_icon.svg.png'} alt="ESRB Rating" />
            </div>
          </div>
        </div>
        <h4>{game && game.igdb ? game.igdb.name : ''} can be played on:</h4>
        <div className="game-dialog--body__consoles">
          {game && game.consoleArr ? (
            game.consoleArr.map((con: IConsoleArr, index: number) => <h5 key={index}>{con.consoleName}</h5>)
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  ) : <></>;
};

export default GameDialog;
