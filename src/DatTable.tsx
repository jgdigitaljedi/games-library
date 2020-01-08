import React, { FunctionComponent } from 'react';
import { DataTable } from 'primereact/datatable';

const DatTable: FunctionComponent = props => {
  console.log('props from dat', props);
  return (
    <div className="data-table-container">
      <DataTable></DataTable>
    </div>
  );
};

export default DatTable;
