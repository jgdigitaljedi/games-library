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
}

class TheTable extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { cols: [{ field: '', header: '' }], viewWhat: props.viewWhat || '' };
  }

  public componentDidMount() {
    this._getCols();
  }

  public render() {
    if (this.state.viewWhat !== this.props.viewWhat) {
      this._getCols();
      this.setState({ viewWhat: this.props.viewWhat || '' });
    }

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
        <DataTable value={this.props.data} paginator={true} rows={10} style={{ height: '50%' }}>
          {dynamicColumns}
        </DataTable>
      </div>
    );
  }

  private _imageTemplate(rowData: { gb: { image: string } }): JSX.Element {
    const imageStyle = {
      maxWidth: '6rem',
      maxHeight: '6rem',
      height: 'auto',
      width: 'auto'
    } as CSSProperties;
    return (
      <img
        src={
          get(rowData, 'gb.image') ||
          get(rowData, 'image') ||
          'http://localhost:3000/Video-Game-Controller-Icon.svg.png'
        }
        alt="Game cover"
        style={imageStyle}
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
