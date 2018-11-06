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
// import loadDevices from './../Services/API';
import DeviceDetail from './../PrimeContent/DeviceDetail';
import AppContext from './../Services/Context';
import { connect } from "react-redux";
import { storeErrors } from "./../Services/store";
import LiveTableRow from './LiveTableRow';
import ManualTableRow from './ManualTableRow';
import axios from 'axios';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { desc, 
         stableSort, 
         getSorting } from './table-sort-helpers';

const moment = extendMoment(Moment);


// TODO: move loadDevices to Redux store

const config = {
    headers: { 'Authorization': `Basic ${GGConsts.HEADER_AUTH}` }
}

const loadDevices = async( uri ) => {
    try {

        let data = await axios.get(uri, config);

        if (data) {
            console.warn('$$$$ DATA $$$$', data);
            return data;
        } else {
            console.warn("@loadDevices sensor data incomplete: ", data);
        }

    } catch (err) {
        console.warn("@loadDevices error: ", err);
    }
}

const formatData = async() => {
  const uri = `${GGConsts.API}:${GGConsts.UPLOADED_DEVICES}/sensor/state/uploaded`;

  const result = await loadDevices(uri);
  const data = result && result.data && result.data.states;

  if (data) {

      const formattedData = data.map(device => {

        // let range = moment.range(device.sample['began-at'], device.sample['ended-at']);

        device = {
            type: device.sample.uploaded,
            brand: device.sensor.manufacturer,
            id: '- id -',
            district: '- district -',
            errors: "",
            facility: "Facility O",
            holdover: [0],
            id: device.sample['sensor-id'],
            lastping: "4 days, 6 hours ago",
            lasttemp: [0, 4, 5, 0, 4, 6, 7, 8, 1, 2, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 5, 0, 6, 9, 8, 8, 9, 4, 4],
            status: device.status,
            sensor: {
                contact: {
                    email: ' - ',
                    name: ' - ',
                    phone: ' - '
                },
                facility: {
                    city: ' - ',
                    country: ' - ',
                    district: ' - ',
                    name: ' - ',
                    region: ' - '
                }
            },
            errorcount: 22,
            alarms: device.alarms,
            meta: device.meta,
            uploaddate: '8 - 10 - 2018'
        }

        return device;
      });

      return formattedData;

    }
}

class LiveTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'status',
      data: null,
      errors: [],
      page: 0,
      rowsPerPage: 10,
      isDetailOpen: false,
      selectedDevice: null
    }
  }

  async componentDidMount() {
    let data = await formatData();
    this.setState({ data });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleRowClick = async(event, device) => {

    const yearAgo = moment.utc().subtract(1, 'year').format();
    const uri = `${GGConsts.API}:${GGConsts.UPLOADED_DEVICES}/sensor/${device.id}/sample?start=${yearAgo}`;
    const sensors = await loadDevices(uri);

    // sensors && sensors.data.samples.forEach(day => {
    //   day['ended-at'] = moment(day['ended-at']).format('YYYYMMDD');
    // });

    this.setState({isDetailOpen: true, selectedDevice: { sensorSampleData: sensors, sensorStateData: device } });
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
    if (!this.state.data) {
      return null;
    }

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
        {this.state.isDetailOpen && <DeviceDetail isOpen={this.state.isDetailOpen}
                  handleOpen={this.handleDetailOpen}
                  handleClose={this.handleDetailClose}
                  device={this.state.selectedDevice} />}

        <TableWrapper>
          {(!data)
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
                })
              }
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
