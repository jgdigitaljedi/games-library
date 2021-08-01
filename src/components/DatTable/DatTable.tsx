import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { connect } from 'react-redux';
import ErrorBoundary from '../ErrorBoundary';
import tableProps from '../../services/tableProps.service';
import get from 'lodash/get';

interface IProps {
  data: any[];
  viewWhat?: string;
  rowClicked?: Function;
}

interface MapStateProps {
  viewWhat: string;
}
const TheTable: FunctionComponent<IProps> = ({ data, viewWhat, rowClicked }) => {
  const [dynamicColumns, setDynamicColumns] = useState<any>();
  const [selected, setSelected] = useState<any>();
  const tableRef = useRef<any>();

  const updateDimensions = useCallback(() => {
    const theTable = tableRef?.current?.container.querySelector(
      '.p-datatable-scrollable-body-table'
    );
    if (theTable) {
      if (window.innerWidth <= 640) {
        theTable.style.width = '100%';
        theTable.style.width = 'auto';
      } else if (theTable?.style) {
        tableRef.current.container.style.width = '100%';
      }
    } else {
      setTimeout(() => {
        updateDimensions();
      }, 60);
    }
  }, []);

  const tableItemBody = (rowData: any, info: any) => {
    const fieldData = get(rowData, info.field);
    return (
      <React.Fragment>
        <span className='p-column-title mobile-header'>{info.header}</span>
        {typeof fieldData === 'boolean' ? `${fieldData}` : fieldData}
      </React.Fragment>
    );
  };

  const rowSelected = (row: any) => {
    setSelected(row);
    rowClicked && rowClicked(row);
  };

  const _imageTemplate = (rowData: { gb: { image: string } }): JSX.Element => {
    return (
      <img
        src={
          get(rowData, 'gb.image') ||
          get(rowData, 'image') ||
          get(rowData, 'logo') ||
          'http://localhost:3000/Video-Game-Controller-Icon.svg.png'
        }
        alt='Game cover'
        className='table-image'
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = 'Video-Game-Controller-Icon.svg.png';
        }}
      />
    );
  };

  useEffect(() => {
    if (viewWhat) {
      const colProps = tableProps(viewWhat);
      setDynamicColumns(
        colProps.map((col, i) => {
          if (col.header === 'Image' || col.header === 'Logo') {
            return (
              <Column key={col.field} header={col.header} body={_imageTemplate} field={col.field} />
            );
          }
          return (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              sortable={col.sortable}
              body={tableItemBody}
            />
          );
        })
      );
      updateDimensions();
    }

    window.addEventListener('resize', updateDimensions);

    return function cleanup() {
      window.removeEventListener('resize', updateDimensions);
    };
    // eslint-disable-next-line
  }, [viewWhat]);

  return (
    <div className='data-table-container'>
      <DataTable
        value={data}
        paginator={true}
        rows={20}
        pageLinkSize={10}
        scrollable={true}
        selectionMode='single'
        selection={selected}
        onSelectionChange={e => rowSelected(e.value)}
        className='p-datatable-gridlines p-datatable-lg'
        ref={tableRef}
        onValueChange={e => {
          console.log('valueChange', e);
        }}
      >
        {dynamicColumns}
      </DataTable>
    </div>
  );
};

const mapStateToProps = ({ viewWhat }: { viewWhat: string }): MapStateProps => {
  return {
    viewWhat
  };
};

const WrappedTable = connect(mapStateToProps)(TheTable);

export default function DatTable(props: IProps) {
  return (
    <ErrorBoundary>
      <WrappedTable {...props} />
    </ErrorBoundary>
  );
}
