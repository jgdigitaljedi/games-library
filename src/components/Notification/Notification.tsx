import React, { FunctionComponent, memo, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { INotification } from '@/models/common.model';

const Notification: FunctionComponent<INotification> = memo(
  ({ detail, severity, life = 3000, summary }) => {
    const toast = useRef(null);

    useEffect(() => {
      console.log('hook', severity);
      if (severity && detail) {
        // @ts-ignore
        toast.current.show({ detail, severity, life, summary, closeable: true });
      }
      console.log('notifying', summary);
    }, [severity, detail, summary, life]);

    return <Toast ref={toast} position="bottom-right" />;
  }
);

export default Notification;
