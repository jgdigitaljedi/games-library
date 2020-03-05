import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import { IGame } from '../../../common.model';
import SortService from '../../../services/sorts.service';
import { Dropdown } from 'primereact/dropdown';

interface IProps extends RouteComponentProps {
  data: IGame[];
}

const SortBar: FunctionComponent<IProps> = (props: IProps) => {
  const categories = SortService.sortDropdownCats();
  const directions = SortService.sortDropdownDirections();
  const [cat, setCat] = useState(categories[0].value);
  const [dir, setDir] = useState(directions[0].value);

  useEffect(() => {
    const data = SortService.sortData(props.data, cat, dir);
    console.log('sorted', data);
  }, [cat, dir, props.data]);

  return (
    <form className="sort-bar">
      <div className="sort-bar--input-group">
        <label htmlFor="category">Category</label>
        <Dropdown
          id="cateogry"
          name="category"
          value={cat}
          options={categories}
          onChange={e => {
            setCat(e.value);
          }}
        ></Dropdown>
      </div>
      <div className="sort-bar--input-group">
        <label htmlFor="direction">Direction</label>
        <Dropdown
          id="direction"
          name="direction"
          value={dir}
          options={directions}
          onChange={e => {
            setDir(e.value);
          }}
        ></Dropdown>
      </div>
    </form>
  );
};

export default SortBar;
