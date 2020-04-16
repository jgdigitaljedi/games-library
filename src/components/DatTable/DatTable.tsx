import React, { Component, CSSProperties } from 'react';
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

interface ICols {
  field: string;
  header: string;
  sortable?: boolean;
}

interface IState {
  cols: ICols[];
  viewWhat: string;
  selected: any;
}

class TheTable extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      cols: [{ field: '', header: '' }],
      viewWhat: props.viewWhat || '',
      selected: null
    };
  }

  public componentDidMount() {
    this._getCols();
  }

  public componentDidUpdate() {
    if (this.state.viewWhat !== this.props.viewWhat) {
      this._getCols();
      this.setState({ viewWhat: this.props.viewWhat || '' });
    }
  }

  public render() {
    const colProps = this.state.cols || [{ field: '', header: '' }];

    let dynamicColumns = colProps.map((col, i) => {
      if (col.header === 'Image') {
        return <Column key={col.field} header={col.header} body={this._imageTemplate} />;
      }
      return (
        <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} />
      );
    });
    return (
      <div className="data-table-container">
        <DataTable
          value={this.props.data}
          paginator={true}
          rows={20}
          pageLinkSize={10}
          responsive={true}
          scrollable={true}
          selectionMode="single"
          selection={this.state.selected}
          onSelectionChange={e => this.rowSelected(e.value)}
        >
          {dynamicColumns}
        </DataTable>
      </div>
    );
  }

  private rowSelected(row: any) {
    // console.log('row', row);
    this.setState({ selected: row });
    this.props.rowClicked && this.props.rowClicked(row);
  }

  private _imageTemplate(rowData: { gb: { image: string } }): JSX.Element {
    // const imageStyle = {
    //   width: '100%',
    //   height: '4rem',
    //   objectFit: 'cover',
    //   objectPosition: '50% 0%'
    // } as CSSProperties;
    return (
      <img
        src={
          get(rowData, 'gb.image') ||
          get(rowData, 'image') ||
          'http://localhost:3000/Video-Game-Controller-Icon.svg.png'
        }
        alt="Game cover"
        // style={imageStyle}
        className="table-image"
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = 'Video-Game-Controller-Icon.svg.png';
        }}
      />
    );
  }

  private _getCols() {
    this.setState({ cols: tableProps(this.props.viewWhat || '') });
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
