import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { dstyles } from './../Constants/deviceStyle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import GGConsts from '../Constants';
import EnhancedTableHead from './EnhancedTableHead';
import loadDevices from './../Services/API';
import DeviceDetail from './../PrimeContent/DeviceDetail';
import AppContext from './../Services/Context';
import { connect } from "react-redux";
import { storeErrors } from "./../Services/store";
import LiveTableRow from './LiveTableRow';
import ManualTableRow from './ManualTableRow';

import { desc, 
         stableSort, 
         getSorting } from './table-sort-helpers';

import { checkStatus,
         getLastPingHours,
         precisionRound, 
         statusDisplay, 
         statusBg, 
         tempuratureShape, 
         timechecker48 } from './table-display-helpers';

const mockData = [
  {
    brand: "Other - Mains",
    district: "District C",
    errors: "",
    facility: "Facility F",
    holdover: [0],
    id: "2919100717866156140",
    lastping: "12 days, 3 hours ago",
    lasttemp: 4,
    status: 'green',
    sensor: {
      contact: {
        email: 'some.body123@gmail.com',
        name: 'John Doe',
        phone: '+1231231234' 
      },
      facility: {
        city: 'City 3',
        country: 'Country T',
        district: 'District E',
        name: 'Facility O',
        region: 'Region K'
      },
      holdover: '12.233434',
      id: '2919100717866156140',
      manufacturer: 'Other',
      model: 'Mains',
      status: 'green',
      temperature: {
        timestamp: '2018-09-05T23:24:22.66Z',
        value: 4.5
      }
    },
    errorcount: 4,
    uploaddate: '3 - 10 - 2018'
  },
    {
    brand: "Aucma - Mains",
    district: "District E",
    errors: "",
    facility: "Facility O",
    holdover: [0],
    id: "2919100717866156140",
    lastping: "4 days, 6 hours ago",
    lasttemp: 9,
    status: 'red',
    sensor: {
      contact: {
        email: 'some.body123@gmail.com',
        name: 'John Doe',
        phone: '+1231231234' 
      },
      facility: {
        city: 'City 3',
        country: 'Country T',
        district: 'District E',
        name: 'Facility O',
        region: 'Region K'
      },
      holdover: '12.233434',
      id: '29191007234366156140',
      manufacturer: 'Other',
      model: 'Mains',
      status: 'red',
      temperature: {
        timestamp: '2018-09-05T23:24:22.66Z',
        value: 4.5
      }
    },
    errorcount: 22,
    uploaddate: '8 - 10 - 2018'
  }
]

class LiveTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'status',
      data: mockData,
      errors: [],
      page: 0,
      rowsPerPage: 10,
      isDetailOpen: false,
      selectedDevice: null
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleRowClick = (event, device) => {
    console.log(event, device);
    this.setState({isDetailOpen: true, selectedDevice: device });
  }

  handleDetailOpen = () => {
    this.setState({isDetailOpen: true});
  };

  handleDetailClose = () => {
    this.setState({isDetailOpen: false, selectedDevice: null});
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => {
    this.state.selected && this.state.selected.indexOf(id) !== -1;
  }

  render() {
    const { classes, 
            columns,
            table } = this.props;

    const { data, 
            order, 
            orderBy, 
            selected, 
            rowsPerPage, 
            page } = this.state;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Container>
        <DeviceDetail isOpen={this.state.isDetailOpen}
                      handleOpen={this.handleDetailOpen}
                      handleClose={this.handleDetailClose}
                      device={this.state.selectedDevice} />
        <TableWrapper>
          {(!this.state.data.length)
          ?<div>Loading...</div>
          :<Table className="table" aria-labelledby="tableTitle">
            <EnhancedTableHead columns={columns}
                               tableCols={columns}
                               numSelected={selected && selected.length}
                               order={order}
                               orderBy={orderBy}
                               onRequestSort={this.handleRequestSort}
                               rowCount={data.length}/>
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(d => {
                  const isSelected = this.isSelected(d.id);
                  return(
                    (table === 'live') 
                    ? <LiveTableRow d={d} isSelected={isSelected} handleRowClick={this.handleRowClick} />
                    : <ManualTableRow d={d} isSelected={isSelected} handleRowClick={this.handleRowClick} />
                  )
                })}
           
            </TableBody>
          </Table>}
        </TableWrapper>
  
      </Container>
    );
  }
}

LiveTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Container = styled.div`
    width: 80vw;
    margin: 0px auto;
    background-color: white;
    margin-top: 15px;
`;
const TableWrapper = styled.div`
    overflow-x: auto;
`;

const mapDispatchToProps = dispatch => ({
  storeErrors: (errors) => dispatch(storeErrors(errors))
});

export default connect(null, mapDispatchToProps)(LiveTable);
