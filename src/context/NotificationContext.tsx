import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
import { INotification, Severity } from '@/models/common.model';

const defaultFormState = { severity: '' as Severity, detail: '' };
const NotificationContext = createContext<[INotification, Dispatch<SetStateAction<INotification>>]>(
  [defaultFormState, () => defaultFormState]
);

const NotificationContextProvider = (props: any) => {
  const [notify, setNotify] = useState(defaultFormState);
  return (
    <NotificationContext.Provider value={[notify, setNotify]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextProvider };
