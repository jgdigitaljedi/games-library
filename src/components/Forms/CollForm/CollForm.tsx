import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { ICollectible } from '../../../common.model';
import { handleChange } from '../../../services/forms.service';
import helpersService from '../../../services/helpers.service';

interface IProps {
  collectible: ICollectible;
  closeDialog: Function;
}

const CollForm: FunctionComponent<IProps> = ({ collectible, closeDialog }) => {
  const [collForm, setCollForm] = useState<ICollectible>();
  // eslint-disable-next-line
  const [addMode, setAddMode] = useState<boolean>(false);

  const userChange = (e: any) => {
    const newState = handleChange(e, CollForm);
    if (newState) {
      setCollForm(newState);
    }
  };

  useEffect(() => {
    if (collectible && (collectible.name === '' || collectible.name === 'Add Game')) {
      setAddMode(true);
    }
    setCollForm(collectible as ICollectible);
    if (collectible?.purchaseDate) {
      (collectible as ICollectible).newPurchaseDate = helpersService.getTodayYMD(
        collectible.purchaseDate
      );
    }
  }, [collectible, setAddMode]);

  const updateColl = useCallback(() => {
    // make save call
    // also, convert newDatePurchased to formatted string for datePurchased (or do I make the backend do this which is probably the better choice)
    console.log('collFormin save', collForm);
    closeDialog(collForm?.name);
  }, [collForm, closeDialog]);

  const cancelClicked = () => {
    // resetGameForm();
    closeDialog(null);
  };
  return <></>;
};

export default CollForm;
