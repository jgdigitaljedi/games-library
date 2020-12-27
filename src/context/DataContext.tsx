import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
import { IFormState } from '@/models/common.model';
import { filters } from '@/services/deciderFiltering.service';

const defaultFormState = filters.defaultFormState();
const DataContext = createContext<[IFormState, Dispatch<SetStateAction<IFormState>>]>([
  defaultFormState,
  () => defaultFormState
]);

const DataContextProvider = (props: any) => {
  const [dc, setDc] = useState(filters.defaultFormState());
  return <DataContext.Provider value={[dc, setDc]}>{props.children}</DataContext.Provider>;
};

export { DataContext, DataContextProvider };
