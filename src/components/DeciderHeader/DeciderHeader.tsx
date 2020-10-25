import React, { FunctionComponent, memo } from 'react';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';
import { IGame } from '../../models/games.model';

interface IProps {
  data: IGame[];
}

const DeciderHeader: FunctionComponent<IProps> = memo(({ data }: IProps) => {
  return (
    <section className="filter-sort-header">
      <div className="filter-sort-header--section">
        <div className="filter-sort-header--section-head">
          <i className="pi pi-filter"></i>
          <h3>Filter</h3>
        </div>
        <FilterBar data={data} />
      </div>
      <div className="filter-sort-header--section">
        <div className="filter-sort-header--section-head">
          <i className="pi pi-sort-alt"></i>
          <h3>Sort</h3>
        </div>
        <SortBar data={data} />
      </div>
    </section>
  );
});

export default DeciderHeader;
