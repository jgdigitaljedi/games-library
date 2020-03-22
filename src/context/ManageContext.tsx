import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
// @TODO: figure out types for this as I build out that view

const ManageContext = createContext<[any, Dispatch<SetStateAction<any>>]>([{}, () => {}]);

const ManageContextProvider = (props: any) => {
  const [dc, setDc] = useState({});
  return <ManageContext.Provider value={[dc, setDc]}>{props.children}</ManageContext.Provider>;
};

export { ManageContext, ManageContextProvider };
