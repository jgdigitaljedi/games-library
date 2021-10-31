import React, { FunctionComponent, useState, FormEvent, useCallback } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { connect, useSelector } from 'react-redux';
import changeFilteredData from '../../actionCreators/filteredData';
import filterPropsService from '../../services/filterProps.service';
import { Dispatch } from 'redux';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { IDropdown, ViewWhatType } from '@/models/common.model';
import { IGame } from '@/models/games.model';

interface MapStateProps {
  viewWhat: ViewWhatType;
  masterData: object[];
  filteredData: object[];
}

interface MapDispatchProps {
  setFilteredData: (filteredData: object[]) => void;
}

interface IProps extends MapStateProps, MapDispatchProps {}

const FilterGroup: FunctionComponent<IProps> = (props: IProps) => {
  const viewWhat: string = useSelector((state: any) => state.viewWhat);
  const masterData: IGame[] = useSelector((state: any) => state.masterData);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [view, setView] = useState<string>('');
  const [filters, setFilters] = useState<IDropdown[] | undefined>(filterPropsService(viewWhat));
  const [filterStr, setFilterStr] = useState<string>('');

  if (viewWhat !== view) {
    setView(viewWhat);
    setSelectedFilter('');
    setFilterStr('');
    setFilters(filterPropsService(viewWhat));
  }

  const debounceFiltering = useCallback(
    debounce((value: string, sf: any): void => {
      const newData = masterData.filter((d: any) => {
        return get(d, sf).toLowerCase().indexOf(value.toLowerCase()) >= 0;
      });
      props.setFilteredData(newData);
    }, 500),
    [masterData]
  );

  const handleChange = (e: FormEvent<any>): void => {
    const target = e.target as HTMLInputElement;
    setFilterStr(target.value);
    debounceFiltering(target.value, selectedFilter);
  };

  return (
    <div className='filter-group'>
      <Dropdown
        value={selectedFilter}
        onChange={e => setSelectedFilter(e.value)}
        options={filters}
      />
      <InputText
        value={filterStr}
        onChange={handleChange}
        placeholder='Filter String'
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
  viewWhat: ViewWhatType;
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
