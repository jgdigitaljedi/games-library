import React, { FunctionComponent, useState, useCallback } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './components/DatTable/DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';
import changeMasterData from './actionCreators/masterData';
import changeFilteredData from './actionCreators/filteredData';
import FilterGroup from './components/filterGroup/FilterGroup';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import axios from 'axios';
import { IGame } from './common.model';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import GameForm from './components/Forms/GameForm/GameForm';
import PlatformForm from './components/Forms/PlatformForm/PlatformForm';

interface IInputOptions {
  label: string;
  value: string;
  singular?: string;
}

interface MapStateProps {
  viewWhat: string;
  masterData: object[];
  filteredData: object[];
}

interface MapDispatchProps {
  setViewWhat: (viewWhat: string) => void;
  setMasterData: (masterData: object[]) => void;
  setFilteredData: (filteredData: object[]) => void;
}

interface IProps extends MapDispatchProps, MapStateProps {}

const Library: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
  const viewWhat: string = useSelector((state: any) => state.viewWhat);
  const filteredData: IGame[] = useSelector((state: any) => state.filteredData);
  const [view, setView] = useState<any>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
    return viewChoices.filter(v => v.value === view)[0]?.singular;
  }, [view, viewChoices]);

  const openFormDialog = useCallback(
    (selected?: any) => {
      console.log('open dialog', selected);
      setShowModal(true);
    },
    [setShowModal]
  );

  const addSomething = useCallback(() => {
    setSelectedItem({ name: `Add ${getSingular()}` });
    openFormDialog();
  }, [openFormDialog, getSingular]);

  const rowClicked = useCallback(
    clicked => {
      console.log('callback', clicked);
      console.log('view', view);
      const selected = { ...clicked, ...{ name: clicked?.igdb?.name || clicked?.name } };
      setSelectedItem(selected);
      openFormDialog(clicked);
      /** Basically I'm gonna wanna open a dialog. This dialog should have a component that handles all forms for each item type.
       * The dialog should take 'selected' and 'view' from here, render the correct for type for the seelcted, and allow the user
       * to do CRUD to the selected item.
       **/
    },
    [view, openFormDialog]
  );

  const saveItem = useCallback((item, which) => {
    console.log('save item', item);
    console.log('save which', which);
  }, []);

  async function getData() {
    let url = '';
    switch (props.viewWhat) {
      case 'games':
        url = 'http://localhost:4001/api/games';
        break;
      case 'consoles':
        url = 'http://localhost:4001/api/consoles';
        break;
      case 'accessories':
        url = 'http://localhost:4001/api/acc';
        break;
      case 'clones':
        url = 'http://localhost:4001/api/clones';
        break;
      case 'collectibles':
        url = 'http://localhost:4001/api/collectibles';
        break;
      case 'hardware':
        url = 'http://localhost:4001/api/hardware';
        break;
    }
    const result = await axios.get(url);
    if (props && props.setMasterData && props.setFilteredData) {
      props.setMasterData(result.data);
      props.setFilteredData(result.data);
    }
  }

  return (
    <div className="library">
      <div className="button-container">
        <SelectButton
          value={props.viewWhat}
          onChange={e =>
            props.setViewWhat
              ? e.value
                ? props.setViewWhat(e.value)
                : props.setViewWhat('games')
              : null
          }
          options={viewChoices}
        ></SelectButton>
      </div>
      <div className="filter-add">
        <div></div>
        <FilterGroup />
        <Button
          icon="pi pi-plus"
          label={`Add ${getSingular()}`}
          className="p-button-raised p-button-rounded"
          onClick={addSomething}
        />
      </div>
      <DatTable data={filteredData} rowClicked={rowClicked}></DatTable>
      <Dialog
        visible={showModal}
        header={selectedItem?.name}
        modal={true}
        closeOnEscape={true}
        dismissableMask={true}
        onHide={() => {
          setSelectedItem(null);
          setShowModal(false);
        }}
      >
        <div className="form-dialog--header">
          <Button
            label={`Remove ${selectedItem?.name} from collection`}
            icon="pi pi-trash"
            className="p-button-danger"
          />
        </div>
        {view === 'games' && <GameForm game={selectedItem} saveClicked={saveItem} />}
        {view === 'consoles' && <PlatformForm platform={selectedItem} saveClicked={saveItem} />}
        {/* <GameDialog game={selectedCard} /> */}
      </Dialog>
    </div>
  );
};

const mapStateToProps = ({
  viewWhat,
  masterData,
  filteredData
}: {
  viewWhat: string;
  masterData: object[];
  filteredData: object[];
}): MapStateProps => {
  return {
    viewWhat,
    masterData,
    filteredData
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setViewWhat: (viewWhat: string) => dispatch(changeViewWhat(viewWhat)),
  setMasterData: (masterData: object[]) => dispatch(changeMasterData(masterData)),
  setFilteredData: (filteredData: object[]) => dispatch(changeFilteredData(filteredData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
