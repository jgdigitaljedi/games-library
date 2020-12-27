import React, { FunctionComponent, useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import { IGame } from '@/models/games.model';
import SortService from '../../../services/sorts.service';
import { Dropdown } from 'primereact/dropdown';
import { SortContext } from '@/context/SortContext';

interface IProps extends RouteComponentProps {
  data: IGame[];
}

const SortBar: FunctionComponent<IProps> = (props: IProps) => {
  const categories = SortService.sortDropdownCats();
  const directions = SortService.sortDropdownDirections();
  const [sc, setSc] = useContext(SortContext);

  return (
    <form className="sort-bar">
      <div className="sort-bar--input-group">
        <label htmlFor="category" className="info-text">
          Category
        </label>
        <Dropdown
            className="info-text"
            id="cateogry"
            name="category"
            value={sc.prop}
            options={categories}
            onChange={e => {
                setSc({prop: e.value, dir: sc.dir});
            }}
        />
      </div>
      <div className="sort-bar--input-group">
        <label htmlFor="direction" className="info-text">
          Direction
        </label>
        <Dropdown
          className="info-text"
          id="direction"
          name="direction"
          value={sc.dir}
          options={directions}
          onChange={e => {
            setSc({ dir: e.value, prop: sc.prop });
          }}
        />
      </div>
    </form>
  );
};

export default SortBar;
