import React, { Component, CSSProperties } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import { connect } from 'react-redux';
import ErrorBoundary from './ErrorBoundary';
import cloneDeep from 'lodash/cloneDeep';

interface IProps {
  data: any[];
  viewWhat?: string;
}

interface MapStateProps {
  viewWhat: string;
}

interface ICols {}

class TheTable extends Component<IProps> {
  cols: ColumnProps[] | null;
  constructor(props: IProps) {
    super(props);
    this.cols = [{ field: '', header: '' }];
    this._getCols();
  }
  public componentDidUpdate(prevProps: IProps, prevState: any, snapshot: any) {
    this._getCols();
  }

  public render() {
    // let cols = this._getCols();
    if (!this.cols) {
      this._getCols();
    }

    const colProps = cloneDeep(this.cols) || [{ field: '', header: '' }];

    let dynamicColumns = colProps.map((col, i) => {
      if (col.field === 'gb.image') {
        return <Column key={col.field} header={col.header} body={this._imageTemplate} />;
      }
      return (
        <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} />
      );
    });
    return (
      <div className="data-table-container">
        <DataTable value={this.props.data} paginator={true} rows={10}>
          {dynamicColumns}
        </DataTable>
      </div>
    );
  }

  private _imageTemplate(rowData: { gb: { image: string } }, column: object): JSX.Element {
    const imageStyle = {
      maxWidth: '6rem',
      maxHeight: '6rem',
      height: 'auto',
      width: 'auto'
    } as CSSProperties;
    return <img src={rowData.gb.image} alt="Game cover" style={imageStyle} />;
  }

  private _getCols() {
    console.log('getCols called', this.props);
    const gamesCols = [
      { field: 'gb.image', header: 'Image' },
      { field: 'igdb.name', header: 'Name', sortable: true },
      { field: 'consoleName', header: 'Console', sortable: true },
      { field: 'multiplayerNumber', header: 'Players', sortable: true },
      { field: 'igdb.firstReleaseDate', header: 'Release Date' },
      { field: 'datePurchased', header: 'Purchase Date' },
      { field: 'genres', header: 'Genres' },
      { field: 'howAcquired', header: 'How Acquired' },
      { field: 'igdb.total_rating', header: 'Rating', sortable: true },
      { field: 'howAcquired', header: 'How Acquired', sortable: true }
    ];
    let cols;
    switch (this.props.viewWhat) {
      case 'games':
        cols = gamesCols;
        break;
      case 'consoles':
        cols = [{ field: '', header: '' }];
        break;
      default:
        cols = gamesCols;
        break;
    }
    this.cols = cols;
  }
}

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
