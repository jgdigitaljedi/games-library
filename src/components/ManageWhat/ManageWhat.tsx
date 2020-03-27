import React, { FunctionComponent, useState } from 'react';

type ItemType = 'game' | 'platform' | 'accessory' | 'clone' | 'collectible' | 'hardware';
type ActionType = 'add' | 'edit' | 'delete';

const ManageWhat: FunctionComponent<any> = () => {
  const [item, setItem] = useState<ItemType>('game');
  const [action, setAction] = useState<ActionType>('add');

  return <div className="manage-what">Test</div>;
};

export default ManageWhat;
