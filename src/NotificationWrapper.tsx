import React, { Dispatch, SetStateAction, useContext } from 'react';
import Notification from './components/Notification/Notification';
import { NotificationContext } from './context/NotificationContext';
import { INotification } from './models/common.model';

const NotificationWrapper = (props: any) => {
  const [notify]: [INotification, Dispatch<SetStateAction<INotification>>] = useContext(
    NotificationContext
  );

  return (
    <>
      {props.children}
      <Notification
        summary={notify.summary}
        severity={notify.severity}
        detail={notify.detail}
        life={notify.life}
      />
    </>
  );
};

export default NotificationWrapper;
