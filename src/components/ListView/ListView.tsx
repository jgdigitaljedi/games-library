import React, { FunctionComponent } from 'react';
import { IGame } from '../../common.model';
import { flatten as _flatten } from 'lodash';

const ListView: FunctionComponent<any> = ({
  data,
  listRowClick,
  whichData
}: {
  data: IGame[];
  listRowClick: Function;
  whichData: string;
}) => {
  const rowClicked = (e: any, game: IGame) => {
    e.preventDefault();
    listRowClick(game);
  };

  const getData = (game: IGame): string => {
    let cellData;
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
        cellData = _flatten(game.extraDataFull?.map(d => d.special?.map(i => i.value))).join(', ');
        break;
      case 'multiplayer':
        cellData = `${game.multiplayerNumber} players`;
        break;
    }
    return cellData || '';
  };

  return (
    <div className="list-view">
      {data &&
        data.map((game: IGame, index: number) => {
          return (
            <div className="list-view--row" onClick={e => rowClicked(e, game)} key={index}>
              <img src={game.gb.image} alt={`${game.igdb.name} art`} />
              <div className="list-view--row__cell item-name">{game.igdb.name}</div>
              <div className="list-view--row__cell">{getData(game)}</div>
            </div>
          );
        })}
    </div>
  );
};

export default ListView;
