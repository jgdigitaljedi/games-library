import React, { FunctionComponent } from 'react';
import { IConsole } from '@/models/platforms.model';
import { IGame } from '@/models/games.model';
import { flatten as _flatten, get as _get, uniq as _uniq } from 'lodash';
import { consoleGenerationYears } from '@/services/helpers.service';

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
            cellData = _uniq(
              _flatten(
                game.extraDataFull?.map(d =>
                  Array.isArray(d.isExclusive)
                    ? d.isExclusive?.map(i => i?.name + ' exclusive' || '')
                    : ''
                ) || []
              )
            ).join(', ');
          }
          if (!cellData || cellData === 'undefined exclusive') {
            cellData = game.extraData?.filter(g => g.indexOf('exclusive') >= 0)[0] || '';
          }
          break;
        case 'launch':
          if (game.extraDataFull?.length && game.extraDataFull[0].isLaunchTitle) {
            cellData = _uniq(
              _flatten(
                game.extraDataFull?.map(d =>
                  Array.isArray(d.isLaunchTitle)
                    ? d.isLaunchTitle?.map(i => i?.name + ' launch title' || '')
                    : ''
                ) || []
              )
            ).join(', ');
          }
          if (!cellData || cellData === 'undefined launch title') {
            cellData = game.extraData?.filter(g => g.indexOf('launch title') >= 0)[0] || '';
          }
          break;
        case 'special':
          cellData = _uniq(
            _flatten(game.extraDataFull?.map(d => d.special?.map(i => i.value)))
          ).join(', ');
          break;
        case 'multiplayer':
          cellData = `${game?.maxMultiplayer || '?'} players`;
          break;
        case 'multiplatform':
          cellData = `${_uniq(game.consoleArr?.map(con => con.consoleName)).join(', ')}`;
          break;
        case 'cib':
          cellData = game?.consoleArr
            // @ts-ignore
            ?.filter(g => g.cib)
            .map(g => `CIB for ${g.consoleName}`)
            .join(', ');
          break;
        default:
          cellData = _get(game, whichData);
          break;
      }
    } else {
      // it is a console or it isn't a game with extra data
      if (whichData === 'multiplatform') {
        // @ts-ignore
        cellData = `${game.consoleArr?.map(con => con.consoleName).join(', ')}`;
      } else if (whichData === 'cib') {
        // @ts-ignore
        if (game.consoleArr?.length) {
          // @ts-ignore
          cellData = game?.consoleArr
            ?.filter((g: IGame) => g.cib)
            .map((g: IGame) => `CIB for ${g.consoleName}`)
            .join(', ');
        } else {
          // @ts-ignore
          cellData = `CIB for ${game.consoleName}`;
        }
      } else if (whichData === 'multiplayer') {
        // @ts-ignore
        cellData = `${game?.maxMultiplayer || '?'} players`;
      } else {
        cellData = _get(game, whichData);
      }
    }
    return cellData || '';
  };

  return (
    <div className='list-view'>
      {data &&
        !isPlatform &&
        (data as Array<IGame>).map((game: IGame, index: number) => {
          return (
            <div className='list-view--row' onClick={e => rowClicked(e, game)} key={index}>
              <img src={game.image} alt={`${game.name} art`} />
              <div className='list-view--row__cell item-name info-text'>{game.name}</div>
              <div className='list-view--row__cell info-text'>{getData(game)}</div>
            </div>
          );
        })}
      {data &&
        isPlatform &&
        (data as Array<IConsole>).map((con: IConsole, index: number) => {
          return (
            <div className='list-view--row' onClick={e => rowClicked(e, con)} key={index}>
              <img src={con.logo || ''} alt={`${con.name} art`} />
              <div className='list-view--row__cell item-name info-text'>{con.name}</div>
              <div className='list-view--row__cell info-text'>{getData(con)}</div>
            </div>
          );
        })}
    </div>
  );
};

export default ListView;
