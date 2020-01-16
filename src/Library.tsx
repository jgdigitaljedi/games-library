import React, { FunctionComponent, useState, SetStateAction } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './components/DatTable/DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import axios from 'axios';
import get from 'lodash/get';
import FilterGroup from './components/filterGroup/FilterGroup';

interface IInputOptions {
  label: string;
  value: string;
}

interface MapStateProps {
  viewWhat: string;
}

interface MapDispatchProps {
  setViewWhat: (viewWhat: string) => void;
}

interface IData {
  data: any[];
}
interface IProps extends MapDispatchProps, MapStateProps {}

const Library: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
  const viewWhat = useSelector((state: any) => state.viewWhat);
  const [view, setView]: [string, any] = useState('');
  const [data, setData]: [IData, any] = useState({ data: [{}] });
  const [ogData, setOgData]: [any[], any] = useState([]);
  console.log('viewWhat', viewWhat);
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
      const keys = Object.keys(d);
      keys.forEach((key: string) => {
        if (typeof d[key] === 'boolean') {
          d[key] = d[key].toString();
        }
      });
      if (props.viewWhat === 'games') {
        d.genres = d.igdb.genres.join(', ');
      }
      return d;
    });
  }

  function filterCallback(value: string, selectedFilter: any): void {
    console.log('value from cb', value);
    console.log('sf from cb', selectedFilter);
    console.log('data', data);
    if (value) {
      const filteredData = ogData.filter((d: any) => {
        console.log('d', d);
        return d;
        // get(d, selectedFilter).toLowerCase().indexOf(value)
      });
    }
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
    console.log('cleaned', cleaned);
    setOgData(cleaned);
    // result.data = cleaned;
    setData({ data: cleaned });
    console.log('ogData', ogData);
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
        <FilterGroup filterCallback={filterCallback} />
      </div>
      <DatTable data={data.data}></DatTable>
    </section>
  );
};

const mapStateToProps = ({ viewWhat }: { viewWhat: string }): MapStateProps => {
  return {
    viewWhat
  };
};

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps => ({
  setViewWhat: (viewWhat: string) => dispatch(changeViewWhat(viewWhat))
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
