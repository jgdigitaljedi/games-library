import React from 'react';
import { DataContext, DataContextProvider } from './DataContext';
import { SortContext, SortContextProvider } from './SortContext';
import { IGame, IDropdown, IFormState } from '../common.model';

interface ICombined {
  data: IFormState;
  sortData: {
    prop: string;
    dir: string;
  };
}

// const defaultSortState = { prop: 'igdb.first_release_date', dir: 'descending' };
// const defaultFormState = filters.defaultFormState();
// const CombinedContext = createContext<[ICombined, Dispatch<SetStateAction<ICombined>>]>([
//   { data: defaultFormState, sortData: defaultSortState },
//   () => ({ data: defaultFormState, sortData: defaultSortState })
// ]);

const CombinedContextProvider = ({
  children,
  data,
  sortData
}: {
  children: JSX.Element[];
  data?: IGame[];
  sortData?: IDropdown;
}) => (
  <DataContextProvider>
    <SortContextProvider>{children}</SortContextProvider>
  </DataContextProvider>
);

const CombinedContextConsumer = ({
  children,
  data,
  sortData
}: {
  children: any;
  data?: IGame[];
  sortData?: IDropdown;
}) => (
  <DataContext.Consumer>
    {data => (
      <SortContext.Consumer>{sortData => children({ data, sortData })}</SortContext.Consumer>
    )}
  </DataContext.Consumer>
);

export { CombinedContextProvider, CombinedContextConsumer };
