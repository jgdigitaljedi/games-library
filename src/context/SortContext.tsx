import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

export interface ISortContext {
  prop: string;
  dir: string;
}

const defaultSortState = { prop: 'igdb.first_release_date', dir: 'descending' };

const SortContext = createContext<[ISortContext, Dispatch<SetStateAction<ISortContext>>]>([
  defaultSortState,
  () => defaultSortState
]);

const SortContextProvider = (props: any) => {
  const [sc, setSc] = useState(defaultSortState);
  return <SortContext.Provider value={[sc, setSc]}>{props.children}</SortContext.Provider>;
};

export { SortContext, SortContextProvider };
