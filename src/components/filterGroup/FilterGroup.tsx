import React, { FunctionComponent, useState, FormEvent, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { connect, useSelector } from 'react-redux';
import changeFilteredData from '../../actionCreators/filteredData';
import filterPropsService from '../../services/filterProps.service';
import { Dispatch } from 'redux';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

interface MapStateProps {
  viewWhat: string;
  masterData: object[];
  filteredData: object[];
}

interface MapDispatchProps {
  setFilteredData: (filteredData: object[]) => void;
}

interface IProps extends MapStateProps, MapDispatchProps {}

const FilterGroup: FunctionComponent<IProps> = (props: IProps) => {
  const viewWhat = useSelector((state: any) => state.viewWhat);
  const masterData = useSelector((state: any) => state.masterData);
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

  const debounceFiltering = useCallback(
    debounce((value: string, sf: any) => {
      const newData = masterData.filter((d: any) => {
        return (
          get(d, sf)
            .toLowerCase()
            .indexOf(value.toLowerCase()) >= 0
        );
      });
      props.setFilteredData(newData);
    }, 500),
    [masterData]
  );

  const handleChange = (e: FormEvent<any>) => {
    const target = e.target as HTMLInputElement;
    setFilterStr(target.value);
    debounceFiltering(target.value, selectedFilter);
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
        onChange={handleChange}
        placeholder="Filter String"
        disabled={!selectedFilter || !selectedFilter.length}
      />
    </div>
  );
};

const mapStateToProps = ({
  viewWhat,
  masterData,
  filteredData
}: {
  viewWhat: string;
  masterData: object[];
  filteredData: object[];
}): MapStateProps => {
  return {
    viewWhat,
    masterData,
    filteredData
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setFilteredData: (filteredData: object[]) => dispatch(changeFilteredData(filteredData))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroup);
