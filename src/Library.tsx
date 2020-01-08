import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import axios from 'axios';

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
  let data;
  const viewChoices: IInputOptions[] = [
    { label: 'Games', value: 'games' },
    { label: 'Consoles', value: 'consoles' },
    { label: 'Accessories', value: 'accessories' }
  ];

  async function getData() {
    if (props.viewWhat === 'games') {
      data = await axios.get('http://localhost:4001/api/games');
      console.log('data', data);
    }
  }
  getData();
  return (
    <section className="library">
      <SelectButton
        value={props.viewWhat}
        onChange={e => (props.setViewWhat ? props.setViewWhat(e.value) : null)}
        options={viewChoices}
      ></SelectButton>
      {/* <DatTable {...data}></DatTable> */}
      {/* <DatTable data={data}></DatTable> */}
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
