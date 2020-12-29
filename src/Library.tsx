import React, { FunctionComponent, useState, useCallback, useEffect, useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './components/DatTable/DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';
import changeMasterData from './actionCreators/masterData';
import changeFilteredData from './actionCreators/filteredData';
import changePlatformsArr from './actionCreators/platformsArr';
import FilterGroup from './components/filterGroup/FilterGroup';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { IDropdown } from './models/common.model';
import { IGame } from './models/games.model';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import GameForm from './components/Forms/GameForm/GameForm';
import PlatformForm from './components/Forms/PlatformForm/PlatformForm';
import helpersService from './services/helpers.service';
import AccForm from './components/Forms/AccForm/AccForm';
import CollForm from './components/Forms/CollForm/CollForm';
import HardwareForm from './components/Forms/HardwareForm/HardwareForm';
import CloneForm from './components/Forms/CloneForm/CloneForm';
import { getPlatformArr } from './services/globalData.service';
import { NotificationContext } from './context/NotificationContext';
import {cleanupGames} from "./services/dataMassaging.service";
import axios from "axios";
import {deleteGame} from "./services/gamesCrud.service";

interface IInputOptions {
  label: string;
  value: string;
  singular?: string;
}

interface MapStateProps {
  viewWhat: string;
  masterData: object[];
  filteredData: object[];
  platformsArr: IDropdown[];
  userState: boolean;
}

interface MapDispatchProps {
  setViewWhat: (viewWhat: string) => void;
  setMasterData: (masterData: object[]) => void;
  setFilteredData: (filteredData: object[]) => void;
  setPlatformsArr: (platformsArr: IDropdown[]) => void;
}

interface IProps extends MapDispatchProps, MapStateProps {}

const Library: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
  // eslint-disable-next-line
  const [notify, setNotify] = useContext(NotificationContext);
  const viewWhat: string = useSelector((state: any) => state.viewWhat);
  const filteredData: IGame[] = useSelector((state: any) => state.filteredData);
  const platformsArr: IDropdown[] = useSelector((state: any) => state.platformsArr);
  const [view, setView] = useState<any>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const isLoggedIn = useSelector((state: any) => state.userState);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const closeConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  if (view !== viewWhat) {
    setView(viewWhat);
    getData();
  }
  const viewChoices: IInputOptions[] = [
    { label: 'Games', value: 'games', singular: 'Game' },
    { label: 'Consoles', value: 'consoles', singular: 'Console' },
    { label: 'Accessories', value: 'accessories', singular: 'Accessory' },
    { label: 'Clones', value: 'clones', singular: 'Clone' },
    { label: 'Collectibles', value: 'collectibles', singular: 'Collectible' },
    { label: 'Hardware', value: 'hardware', singular: 'Item' }
  ];

  const getSingular = useCallback(() => {
    return viewChoices.filter((v) => v.value === view)[0]?.singular;
  }, [view, viewChoices]);

  const openFormDialog = useCallback(
    (selected?: any) => {
      setShowModal(true);
    },
    [setShowModal]
  );

  const addSomething = useCallback(() => {
    closeConfirmation();
    if (view === 'games') {
      setSelectedItem(helpersService.resetGameForm());
    } else {
      setSelectedItem({ name: `Add ${getSingular()}` });
    }
    openFormDialog();
  }, [openFormDialog, getSingular, view]);

  const rowClicked = useCallback(
    (clicked) => {
      const selected = { ...clicked, ...{ name: clicked?.igdb?.name || clicked?.name } };
      setSelectedItem(selected);
      openFormDialog(clicked);
    },
    [openFormDialog]
  );

  const closeDialog = useCallback(
    async (name: string, success: boolean, action: string) => {
      closeConfirmation();
      hookedGetData();
      if (name && success) {
        setNotify({
          severity: 'success',
          detail: `Successfully ${action} ${name} ${action?.toLowerCase() === 'removed' ? 'from' : 'to'} your collection!`,
          summary: `${name} Saved`
        });
        // const masterCopy = _cloneDeep(masterData);
        setSelectedItem(null);
        // @ts-ignore
        // props.setFilteredData(masterCopy);
      } else if (name) {
        setNotify({
          severity: 'error',
          detail: `Failed to ${action} ${name}!`,
          summary: 'ERROR'
        });
      }
      // if no name sent then just exit (cancel clicked). Exit for others too
      setSelectedItem(null);
      setShowModal(false);
    },
    [setShowModal, setNotify]
  );

  async function getData() {
    closeConfirmation();
    let url = '';
    switch (props.viewWhat) {
      case 'games':
        url = `${window.urlPrefix}/api/vg/games`;
        break;
      case 'consoles':
        url = `${window.urlPrefix}/api/vg/consoles`;
        break;
      case 'accessories':
        url = `${window.urlPrefix}/api/vg/acc`;
        break;
      case 'clones':
        url = `${window.urlPrefix}/api/vg/clones`;
        break;
      case 'collectibles':
        url = `${window.urlPrefix}/api/vg/collectibles`;
        break;
      case 'hardware':
        url = `${window.urlPrefix}/api/vg/hardware`;
        break;
    }
    const result = await axios.get(url);
    if (props && props.setMasterData && props.setFilteredData) {
      if (result?.data) {
        // inserting another conditional here because data massaging needs to happen now that backend is simplified a bit
        let parsedResults;
        if (props?.viewWhat === 'games') {
          parsedResults = cleanupGames(result.data);
        } else {
          parsedResults = result.data;
        }
        props.setMasterData(parsedResults);
        props.setFilteredData(parsedResults);
      } else {
        setNotify({
          severity: 'error',
          detail: 'Failed to fetch data for library view!',
          summary: 'ERROR'
        });
      }
    }
  }

  const hookedGetData = async () => {
    await getData();
  };

  const deleteItem = async () => {
    if (viewWhat === 'games') {
      deleteGame(selectedItem)
          .then(result => {
              // @ts-ignore
              if (result.status === 200) {
                closeConfirmation();
                closeDialog(selectedItem.name, true, 'removed');
                getData();
              }
          })
          .catch(error => {
            console.log('delete game error', error);
            closeConfirmation();
            setNotify({
              severity: 'error',
              detail: 'Failed to delete game from collection!',
              summary: 'ERROR'
            });
          });
    }
  };

  useEffect(() => {
    closeConfirmation();
    if (!platformsArr?.length) {
      getPlatformArr()
        .then((result: IDropdown[]) => {
          if (result && props?.setPlatformsArr) {
            props.setPlatformsArr(result);
          }
        })
        .catch((error: any) => {
          setNotify({
            severity: 'error',
            detail: error,
            summary: 'ERROR'
          });
          console.error('ERROR FETCHING PLATFORMS ARR', error);
        });
    }
  }, [props, platformsArr, setNotify, isLoggedIn]);

  return (
    <div className="library">
      <div className="button-container">
        <SelectButton
          value={props.viewWhat}
          onChange={(e) =>
            props.setViewWhat
              ? e.value
                ? props.setViewWhat(e.value)
                : props.setViewWhat('games')
              : null
          }
          options={viewChoices}
        />
      </div>
      <div className="filter-add">
        <div className="items-count">
          {filteredData.length} {viewWhat}
        </div>
        <FilterGroup />
        <Button
          icon="pi pi-plus"
          label={`Add ${getSingular()}`}
          className="p-button-raised p-button-rounded"
          onClick={addSomething}
          disabled={!isLoggedIn}
        />
      </div>
      <DatTable data={filteredData} rowClicked={rowClicked}/>
      <Dialog
        visible={showModal}
        header={selectedItem?.name}
        modal={true}
        closeOnEscape={true}
        onHide={() => {
          closeConfirmation();
          setSelectedItem(null);
          setShowModal(false);
        }}
      >
        <div className={`crud-form-outer-wrapper form-dialog--header${showDeleteConfirmation ? ' confirmation' : ''}`}>
          {selectedItem &&
            selectedItem.name &&
            selectedItem.name !== 'Add Game' &&
            selectedItem.name !== 'Add Platform' &&
            !showDeleteConfirmation && (
              <Button
                label={`Remove ${selectedItem?.name} from collection`}
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => setShowDeleteConfirmation((true))}
                disabled={!isLoggedIn}
              />
            )}
          {selectedItem && showDeleteConfirmation && (
              <div className="deletion-confirmation">
                <div className="deletion-confirmation--question">Are you sure you want to remove <div className="item-name">{selectedItem.name}</div> from your collection?</div>&nbsp;
                <Button
                    icon="pi pi-check"
                    label="Yes"
                    className="p-button-primary"
                    onClick={deleteItem}/>
                <Button
                    icon="pi pi-times"
                    label="No"
                    className="p-button-info"
                    onClick={closeConfirmation}/>
              </div>
          )}
        </div>
        {view === 'games' && <GameForm game={selectedItem} closeDialog={closeDialog} closeConfirmation={closeConfirmation}/>}
        {view === 'consoles' && <PlatformForm platform={selectedItem} closeDialog={closeDialog} />}
        {view === 'accessories' && <AccForm acc={selectedItem} closeDialog={closeDialog} />}
        {view === 'collectibles' && (
          <CollForm collectible={selectedItem} closeDialog={closeDialog} />
        )}
        {view === 'hardware' && <HardwareForm hardware={selectedItem} closeDialog={closeDialog} />}
        {view === 'clones' && <CloneForm clone={selectedItem} closeDialog={closeDialog} />}
      </Dialog>
    </div>
  );
};

const mapStateToProps = ({
  viewWhat,
  masterData,
  filteredData,
  platformsArr,
    userState
}: {
  viewWhat: string;
  masterData: object[];
  filteredData: object[];
  platformsArr: IDropdown[];
  userState: boolean;
}): MapStateProps => {
  return {
    viewWhat,
    masterData,
    filteredData,
    platformsArr,
    userState
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setViewWhat: (viewWhat: string) => dispatch(changeViewWhat(viewWhat)),
  setMasterData: (masterData: object[]) => dispatch(changeMasterData(masterData)),
  setFilteredData: (filteredData: object[]) => dispatch(changeFilteredData(filteredData)),
  setPlatformsArr: (platformsArr: IDropdown[]) => dispatch(changePlatformsArr(platformsArr))
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
