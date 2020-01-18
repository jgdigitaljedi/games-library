import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './components/DatTable/DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';
import changeMasterData from './actionCreators/masterData';
import changeFilteredData from './actionCreators/filteredData';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import axios from 'axios';
// import get from 'lodash/get';
import FilterGroup from './components/filterGroup/FilterGroup';

interface IInputOptions {
  label: string;
  value: string;
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

interface IData {
  data: any[];
}
interface IProps extends MapDispatchProps, MapStateProps {}

const Library: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
  const viewWhat = useSelector((state: any) => state.viewWhat);
  // const masterData = useSelector((state: any) => state.masterData);
  const filteredData = useSelector((state: any) => state.filteredData);
  const [view, setView]: [string, any] = useState('');
  const [data, setData]: [IData, any] = useState({ data: [{}] });

  if (view !== viewWhat) {
    setView(viewWhat);
    getData();
  }
  const viewChoices: IInputOptions[] = [
    { label: 'Games', value: 'games' },
    { label: 'Consoles', value: 'consoles' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Clones', value: 'clones' },
    { label: 'Collectibles', value: 'collectibles' },
    { label: 'Hardware', value: 'hardware' }
  ];

  function cleanedData(data: any): any[] {
    return data.data.map((d: any) => {
      // const keys = Object.keys(d);
      // keys.forEach((key: string) => {
      //   if (typeof d[key] === 'boolean') {
      //     d[key] = d[key].toString();
      //   }
      // });
      if (props.viewWhat === 'games') {
        d.genres = d.igdb.genres.join(', ');
      }
      return d;
    });
  }

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
    const cleaned = cleanedData(result);
    setData({ data: cleaned });
    if (props && props.setMasterData && props.setFilteredData) {
      props.setMasterData(cleaned);
      props.setFilteredData(cleaned);
    }
  }

  return (
    <section className="library">
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
      <div className="button-container">
        <FilterGroup />
      </div>
      <DatTable data={filteredData}></DatTable>
    </section>
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
