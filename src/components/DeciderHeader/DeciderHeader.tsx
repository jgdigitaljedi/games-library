import React, { FunctionComponent } from 'react';
import FilterBar from './FilterBar/FilterBar';
import SortBar from './SortBar/SortBar';

const DeciderHeader: FunctionComponent<any> = props => {
  return (
    <section className="filter-sort-header">
      <FilterBar data={props.data} />
      <SortBar data={props.data} />
    </section>
  );
};

export default DeciderHeader;
