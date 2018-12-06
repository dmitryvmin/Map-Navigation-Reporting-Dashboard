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

class LiveTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'status',
      data: [],
      errors: [],
      page: 0,
      rowsPerPage: 10,
      isDetailOpen: false,
      selectedDevice: null
    }

    this.intervalId = null; 
  }

  async componentDidMount() {
    this.loadData();
    if ( !this.state.selectedDevice ) {
      this.intervalId = setInterval( this.loadData, 10000 );  
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.selectedDevice = null;
  }

  loadData = async () => {
    try {
      const sensors = await loadDevices();

      if (sensors != null && sensors != "undefined") {

        const data = this.mapPropsToTableColumns(sensors);
        this.props.storeErrors(this.state.errors);
        console.log('@@@', data);
        this.setState({ data });
      }
    } catch (err) {
      console.warn("@componentDidMount error: ", err);
    }
  }

  mapPropsToTableColumns = (data) => {
    const device_info = [];

    data.forEach(d => {
      const obj = {
        id : d.id,
        sensor : d,
        status : checkStatus(d),
        errors : this.getErrors(d),
        brand : `${d.manufacturer} - ${d.model}`,
        facility : d.facility.name,
        district : d.facility.district,
        holdover : (this.state.device_info && this.state.device_info[d.id] && this.state.device_info[d.id].holdover)
            ? [...this.state.device_info[d.id].holdover, precisionRound(d.holdover, 0)]
            : [precisionRound(d.holdover, 0)],

        lastping : this.getLastPing(d),
        lastpingstyle : timechecker48(d.temperature) ? dstyles.redPing : dstyles.clearPing,
        lasttemp : parseInt(`${Math.round(parseFloat(d.temperature.value))}`),
        uploaded: false
      }

      device_info.push(obj);

    });

    return device_info;
  }

  getLastPing = (sensor: any) => {
    let lastping = getLastPingHours(sensor);

    if (lastping !== null && lastping <= 26) {
      let time: any = ( lastping === 1 ) ? 'hour' : 'hours';

      return `${lastping} ${time} ago`;

    } else if (lastping !== null && lastping > 26) {
      let days: any = Math.floor(lastping / 24);
      let daycount: any = (days === 1) ? 'day' : 'days';
      let hours: any = Math.round(lastping - (days * 24));
      let hourscount: any = (hours === 1) ? 'hour' : 'hours';

      return `${days} ${daycount}, ${hours && hours} ${hourscount} ago`;

    } else {
      console.warn('getLastPing - no timestamp. sensor: ', sensor);
      return '-';
    }
  }

  getErrors = (sensor: any) => {
    let lastping = getLastPingHours(sensor);

    // TODO: sensor object should return errors...
    if (lastping > 26) {
      let error = `Over 26 hours since any data has been received`;
      let sensorErrorPresent = false;

      // this.state.errors && Object.keys(this.state.errors).map((e: any) => {
      //   if (sensor.id === e) sensorErrorPresent = true;
      // });
      // if (!sensorErrorPresent) this.setState({ errors: {...this.state.errors, [sensor.id]: error } });
      this.setState({ errors: {...this.state.errors, [sensor.id]: error } });

      return error;

    } else  {
      return null;
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
                               numSelected={0}
                               order={order}
                               orderBy={orderBy}
                               onRequestSort={this.handleRequestSort}
                               rowCount={data.length}/>
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d, i) => {
                  const isSelected = this.isSelected(d.id);
                  return(
                    (table === 'live') 
                    ? <LiveTableRow d={d} key={`${d}-${i}`} isSelected={isSelected} handleRowClick={this.handleRowClick} />
                    : <ManualTableRow d={d} key={`${d}-${i}`} isSelected={isSelected} handleRowClick={this.handleRowClick} />
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>}
        </TableWrapper>
        <TablePagination component="div"
                         rowsPerPageOptions={[10,20,50]}
                         count={data.length}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         backIconButtonProps={{
                           'aria-label': 'Previous Page',
                         }}
                         nextIconButtonProps={{
                           'aria-label': 'Next Page',
                         }}
                         onChangePage={this.handleChangePage}
                         onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
      </Container>
    );
  }
}

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
