import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import DatTable from './DatTable';
import { SelectButton } from 'primereact/selectbutton';
import changeViewWhat from './actionCreators/viewWhat';

interface IInputOptions {
  label: string;
  value: string;
}

interface IProps {
  viewWhat: string;
}

const Library: FunctionComponent<RouteComponentProps> = (props: RouteComponentProps<IProps>) => {
  const viewChoices: IInputOptions[] = [
    { label: 'Games', value: 'games' },
    { label: 'Consoles', value: 'consoles' },
    { label: 'Accessories', value: 'accessories' }
  ];
  return (
    <section className="library">
      <SelectButton
        value={props.viewWhat}
        onChange={e => changeViewWhat(e.value)}
        options={viewChoices}
      ></SelectButton>
      <DatTable></DatTable>
    </section>
  );
};

export default Library;
