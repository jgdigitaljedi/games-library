import React, { FunctionComponent } from 'react';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';

const DeciderHeader: FunctionComponent<any> = props => {
  return (
    <section className="filter-sort-header">
      <div className="filter-sort-header--section">
        <div className="filter-sort-header--section-head">
          <i className="pi pi-filter"></i>
          <h3>Filter</h3>
        </div>
        <FilterBar data={props.data} />
      </div>
      <div className="filter-sort-header--section">
        <div className="filter-sort-header--section-head">
          <i className="pi pi-sort-alt"></i>
          <h3>Sort</h3>
        </div>
        <SortBar data={props.data} />
      </div>
    </section>
  );
};

export default DeciderHeader;
