import React, { FunctionComponent, useState, FormEvent } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { connect, useSelector } from 'react-redux';
import filterPropsService from '../../services/filterProps.service';
import debounce from 'lodash/debounce';

interface MapStateProps {
  viewWhat: string;
}

interface IProps extends MapStateProps {}

const FilterGroup: FunctionComponent<IProps> = (props: IProps) => {
  const viewWhat = useSelector((state: any) => state.viewWhat);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [view, setView] = useState('');
  const [filters, setFilters] = useState(filterPropsService(viewWhat));
  const [filterStr, setFilterStr] = useState('');

  if (viewWhat !== view) {
    setView(viewWhat);
    setSelectedFilter('');
    setFilterStr('');
    setFilters(filterPropsService(viewWhat));
  }

  const debounceFiltering = debounce(val => {
    console.log('debounce', val);
  }, 500);

  const handleChange = (e: FormEvent<any>) => {
    const target = e.target as HTMLInputElement;
    setFilterStr(target.value);
    // debounceFiltering(target.value);
    // return debounce(() => {
    //   return console.log('debounce', target);
    // }, 500);
  };

  return (
    <div className="filter-group">
      <Dropdown
        value={selectedFilter}
        onChange={e => setSelectedFilter(e.value)}
        options={filters}
      />
      <InputText
        value={filterStr}
        onChange={handleChange && debounceFiltering}
        placeholder="Filter String"
        disabled={!selectedFilter || !selectedFilter.length}
      />
    </div>
  );
};

const mapStateToProps = ({ viewWhat }: { viewWhat: string }): MapStateProps => {
  return {
    viewWhat
  };
};

export default connect(mapStateToProps)(FilterGroup);
