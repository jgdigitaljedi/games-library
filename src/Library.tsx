import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

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

interface IProps extends MapDispatchProps, MapStateProps {}

const Library: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
  const viewWhat = useSelector((state: any) => state.viewWhat);
  const [data, setData] = useState({ data: [] });
  const viewChoices: IInputOptions[] = [
    { label: 'Games', value: 'games' },
    { label: 'Consoles', value: 'consoles' },
    { label: 'Accessories', value: 'accessories' }
  ];

  async function getData() {
    if (props.viewWhat === 'games') {
      const data = await axios.get('http://localhost:4001/api/games');
      console.log('data', data);
      const dCopy = cloneDeep(data.data);
      data.data = dCopy.map((d: any) => {
        d.genres = d.igdb.genres.join(', ');
        return d;
      });
      setData(data);
    } else if (props.viewWhat === 'consoles') {
      const data = await axios.get('http://localhost:4001/api/consoles');
      setData(data);
    }
  }
  if (!data || !data.data || !data.data.length) {
    getData();
  }
  return (
    <section className="library">
      <SelectButton
        value={props.viewWhat}
        onChange={e => (props.setViewWhat ? props.setViewWhat(e.value) : null)}
        options={viewChoices}
      ></SelectButton>
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
