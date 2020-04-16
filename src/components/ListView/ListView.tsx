import React, { FunctionComponent } from 'react';
import { IGame, IConsole } from '../../common.model';
import { flatten as _flatten, get as _get } from 'lodash';

interface IProps {
  data: IGame[] | IConsole[];
  listRowClick: Function;
  whichData: string;
  isPlatform?: boolean;
}

const ListView: FunctionComponent<IProps> = ({
  data,
  listRowClick,
  whichData,
  isPlatform
}: IProps) => {
  const rowClicked = (e: any, game: IGame | IConsole) => {
    e.preventDefault();
    listRowClick(game);
  };

  const getData = (game: IGame | IConsole): string => {
    let cellData;
    if ('extraDataFull' in game) {
      // is it a game?
      switch (whichData) {
        case 'exclusives':
          if (game.extraDataFull?.length && game.extraDataFull[0].isExclusive) {
            cellData = _flatten(
              game.extraDataFull?.map(d =>
                Array.isArray(d.isExclusive)
                  ? d.isExclusive?.map(i => i?.name + ' exclusive' || '')
                  : ''
              ) || []
            ).join(', ');
          }
          if (!cellData || cellData === 'undefined exclusive') {
            cellData = game.extraData?.filter(g => g.indexOf('exclusive') >= 0)[0] || '';
          }
          break;
        case 'launch':
          if (game.extraDataFull?.length && game.extraDataFull[0].isLaunchTitle) {
            cellData = _flatten(
              game.extraDataFull?.map(d =>
                Array.isArray(d.isLaunchTitle)
                  ? d.isLaunchTitle?.map(i => i?.name + ' launch title' || '')
                  : ''
              ) || []
            ).join(', ');
          }
          if (!cellData || cellData === 'undefined launch title') {
            cellData = game.extraData?.filter(g => g.indexOf('launch title') >= 0)[0] || '';
          }
          break;
        case 'special':
          cellData = _flatten(game.extraDataFull?.map(d => d.special?.map(i => i.value))).join(
            ', '
          );
          break;
        case 'multiplayer':
          cellData = `${game.multiplayerNumber} players`;
          break;
        default:
          cellData = _get(game, whichData);
          break;
      }
    } else {
      // it is a console
      cellData = _get(game, whichData);
    }
    return cellData || '';
  };

  return (
    <div className="list-view">
      {data &&
        !isPlatform &&
        (data as Array<IGame>).map((game: IGame, index: number) => {
          return (
            <div className="list-view--row" onClick={e => rowClicked(e, game)} key={index}>
              <img src={game.gb.image} alt={`${game.igdb.name} art`} />
              <div className="list-view--row__cell item-name info-text">{game.igdb.name}</div>
              <div className="list-view--row__cell info-text">{getData(game)}</div>
            </div>
          );
        })}
      {data &&
        isPlatform &&
        (data as Array<IConsole>).map((con: IConsole, index: number) => {
          return (
            <div className="list-view--row" onClick={e => rowClicked(e, con)} key={index}>
              <img src={con.gb.image} alt={`${con.igdb.name} art`} />
              <div className="list-view--row__cell item-name info-text">{con.igdb.name}</div>
              <div className="list-view--row__cell info-text">{getData(con)}</div>
            </div>
          );
        })}
    </div>
  );
};

export default ListView;
