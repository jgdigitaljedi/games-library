import React from 'react';
import { DataContext, DataContextProvider } from './DataContext';
import { SortContext, SortContextProvider } from './SortContext';
import { IDropdown, IFormState } from '../models/common.model';
import { IGame } from '../models/games.model';

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
