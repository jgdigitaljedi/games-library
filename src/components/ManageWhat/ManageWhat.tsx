import React, { FunctionComponent, SetStateAction, Dispatch, useState } from 'react';

type ItemType = 'game' | 'platform' | 'accessory' | 'clone' | 'collectible' | 'hardware';
type ActionType = 'add' | 'edit' | 'delete';

const ManageWhat: FunctionComponent<any> = () => {
  const [item, setItem]: [ItemType, Dispatch<SetStateAction<ItemType>>] = useState(
    'game' as ItemType
  );
  const [action, setAction]: [ActionType, Dispatch<SetStateAction<ActionType>>] = useState(
    'add' as ActionType
  );

  return <div className="manage-what">Test</div>;
};

export default ManageWhat;
