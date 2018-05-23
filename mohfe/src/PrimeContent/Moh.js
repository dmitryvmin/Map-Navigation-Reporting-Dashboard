import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
//import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment-timezone';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import DeviceDetail from './DeviceDetail';
import 'typeface-roboto'; //Font
import Alert from './../Alert';
import Table,  {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui-next/Table';
import Tooltip from 'material-ui-next/Tooltip';
import {dstyles} from '../Constants/deviceStyle';
import 'react-tippy/dist/tippy.css'
import { Tooltip as Tippy } from 'react-tippy';

const statusDisplay = (statusString) => {
  switch (statusString) {
    case "red":
      return <div style={dstyles.reddot} />
    case "yellow":
      return <div style={dstyles.yellowdot} />
    case "green":
      return <div style={dstyles.greendot} />
    default:
      return <div style={dstyles.cleardot} />
  }
}

const statusBg = (statusString) => {
  console.log('statusBg', statusString);
  switch (statusString) {
    case "red":
      return {backgroundColor: 'rgba(255, 0, 0, .1)'}
    case "yellow":
      return {backgroundColor: 'rgba(255, 165, 0, .1)'}
    case "green":
      return {backgroundColor: 'rgba(13, 127, 0, 0.1)'}
    default:
      return {}
  }
}

const columnData: any = [
    { id: 'status', label: 'Status'},
    { id: 'lasttemp', label: 'Last Temp (C)'},
    { id: 'holdover', label: 'Holdover Days'},
    { id: 'brand', label: 'Brand/Model'},
    { id: 'facility', label: 'Facility'},
    // { id: 'district', label: 'State/District'},
    { id: 'lastping', label: 'Last Ping'},
]

const tempuratureShape = (temperature) => {
  const tempNum = parseFloat(temperature);
  if ( tempNum < 2.0 ) {
    return <div style={dstyles.coldtemp}>{temperature}&deg;</div>;
  }
  else if (tempNum > 8.0 ) {
    return <div style={dstyles.hottemp}>{temperature}&deg;</div>;
  }
  else if (tempNum > 6.0 && tempNum <= 8.0 ) {
    return <div style={dstyles.warntemp}>{temperature}&deg;</div>;
  }
  else if (tempNum >= 2.0 && tempNum < 4.0 ) {
    return <div style={dstyles.warntemp}>{temperature}&deg;</div>;
  }
  else {
    return <div style={dstyles.goodtemp}>{temperature}&deg;</div>;
  }
}

export default class Moh extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      devices: null,
      isDetailOpen: false,
      selectedDevice: null,
      order: 'asc',
      orderBy: 'messagesPerWeek',
      device_info: this.loadDevices()
    }
    this.loadDevices = this.loadDevices.bind(this);
    this.deviceRowClick = this.deviceRowClick.bind(this);
    this.handleDetailOpen = this.handleDetailOpen.bind(this);
    this.handleDetailClose = this.handleDetailClose.bind(this);
  }

  precisionRound = (number, precision) => {
    if (isNaN(number)) {
      return '-';
    }
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  timechecker48 = (rowtemp) => {
      if (rowtemp && rowtemp.timestamp) {
        let ping = moment(rowtemp.timestamp + "Z");
        let now = moment(Date.now());
        // console.log("ping:", ping, " now: " , now);
        let diff = now.diff(ping, 'days');
        // console.log("Diff", diff);
        if ( diff >= 2 ) {
          return true;
        } else {
          return false;
        }
     } else {
       return false;
     }
  }

 deviceRowClick = (device) => {
    this.setState({isDetailOpen: true, selectedDevice: device });
  }

  handleDetailOpen = () => {
    this.setState({isDetailOpen: true});
  };

  handleDetailClose = () => {
    this.setState({isDetailOpen: false, selectedDevice: null});
  };

  loadDevices() {
    var xhttp = new XMLHttpRequest();
    var that = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let json = JSON.parse(this.responseText);
        that.mapPropsToTableColumns(json);
      }
    };
    xhttp.open("GET", "http://20.36.19.106:9000/sensor", true);
    xhttp.setRequestHeader('Authorization','Basic Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==');
    xhttp.send();
  }

  resetdata(e) {
    e.preventDefault();
    console.log("resetting data and clearing UI");
    var xhttp = new XMLHttpRequest();
    var that = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Looks like it cleared the data on back-end");
        that.setState({device_info: null});
      }
    };
    xhttp.open("POST", "http://20.36.19.106:9003/demo/clear/samples", true);
    xhttp.setRequestHeader('Authorization','Basic Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==');
    xhttp.send();
  }

  handleRequestSort = (event: any, property: any) => {
      const orderBy = property;
      let order = 'desc';

      if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
      }
      const sensors =
          order === 'desc'
              ? this.state.devices.sensors.sort((a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1))
              : this.state.devices.sensors.sort((a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1));

      this.setState({ order, orderBy });
  };

  handleRequestSort = (event: any, property: any) => {
        const orderBy: any = property;
        let order: any = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        const device_info: any =
            order === 'desc'
                ? this.state.device_info.sort((a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1))
                : this.state.device_info.sort((a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1));

        this.setState({ device_info, order, orderBy });
    };

    mapPropsToTableColumns = (json) => {
      console.log('json', json);
      let device_info: any = [];
      json && json.sensors && json.sensors.map((d: any) => {
        let obj: any = {}

        // Sensor Info
        obj.sensor = d;

        // Status
        obj.status = d.status;

        // Brand/Model
        obj.brand = `${d.manufacturer} - ${d.model}`;

        // Facility
        obj.facility = d.facility.name;

        // State/District
        obj.district = d.facility.district;

        // Holdover Days
        obj.holdover = this.precisionRound(d.holdover, 0);

        // Last Ping
        obj.lastping = (d.temperature && d.temperature.timestamp) ? moment(d.temperature.timestamp + "Z").fromNow() : "-";

        // Last Ping Style
        obj.lastpingstyle = this.timechecker48(d.temperature) ? dstyles.redPing : dstyles.clearPing;

        // Last Temp
        obj.lasttemp = tempuratureShape(Math.round(d.temperature.value));

        device_info.push(obj);

      });
      console.log('### mapPropsToTableColumns ###', device_info);
      this.setState({ device_info });
    }

  createSortHandler = (property: any) => (event: any) => {
      this.handleRequestSort(event, property);
  };

  componentDidMount() {
    this.loadDevices();
    setInterval(this.loadDevices, 30000);
  }

  render () {
    const { order, orderBy, device_info } = this.state;
    return (
      <div>
         <Alert />
      <div style={dstyles.middlePane}>
        <div style={dstyles.idBar}>
          <h1 style={dstyles.idBarH}>Kenya MoH</h1>
        </div>
        <div style={dstyles.wrapwrap}>
          <div style={dstyles.wrapTabs} >
            <Tabs tabItemContainerStyle={{backgroundColor:"#51326C"}}
                    style={{width: "80vw", marginLeft: "auto", marginRight: "auto"}}
                    inkBarStyle={{backgroundColor:"#B897D5", height:"4px", marginTop:"-4px"}}>
              <Tab label="Devices" >
                <DeviceDetail isOpen={this.state.isDetailOpen}
                              handleOpen={this.handleDetailOpen}
                              handleClose={this.handleDetailClose}
                              device={this.state.selectedDevice} />
                <div style={dstyles.deviceTableHeader}>

                 <Table style={{backgroundColor: 'white', marginTop: '15px', tableLayout: 'fixed', minWidth: '1400', width: 'auto'}}>
                   <TableHead>
                    <TableRow>
                        {columnData.map((column: any) => {
                          let colstyle;
                          switch(column.label) {
                            case 'Status':
                              colstyle = dstyles.statusColumnHead;
                              break;
                            case 'Last Temp (C)':
                              colstyle = dstyles.tempColumnHead;
                              break;
                            case 'Holdover Days':
                              colstyle = dstyles.holdoverColumnHead;
                              break;
                            case 'Brand/Model':
                              colstyle = dstyles.deviceColumn;
                              break;
                            case 'Facility':
                              colstyle = dstyles.facilityColumn;
                              break;
                            case 'State/District':
                              colstyle = dstyles.localeColumn;
                              break;
                            case 'Last Ping':
                              colstyle = dstyles.lastpingColumnHead;
                              break;
                            default:
                              break;
                          }

                          return (
                              <TableCell key={column.id}
                                         style={colstyle}
                                         sortDirection={orderBy === column.id ? order : false}>
                                  <TableSortLabel onClick={this.createSortHandler(column.id)}
                                                  active={orderBy === column.id}
                                                  direction={order}>{column.label}</TableSortLabel>
                              </TableCell>
                          )
                        }, this)}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {device_info && device_info.map((d: any, i: any) => {
                      const _onClick = () => { this.deviceRowClick(d.sensor) }
                      return (
                           <TableRow key={i} hover onClick={_onClick} style={statusBg(d.status)}>
                              <TableCell style={dstyles.statusColumn}>
                                  <Tippy title="Welcome to React"
                                         position="top"
                                         interactive
                                         trigger="mouseenter"
                                         theme="light"
                                         distance="20"
                                         arrow="true"
                                         html={(
                                          <div>
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                              <span style={{color: "#8A0011", fontSize: "18px"}}>Alarm</span>
                                              <a href=""><img src="/img/link.png"/></a>
                                            </div>
                                            <span>Alert message goes here</span>
                                          </div>
                                         )}>
                                    {statusDisplay(d.status)}
                                  </Tippy>
                              </TableCell>
                              <TableCell style={dstyles.tempColumn}>
                                <Tooltip title={d.lasttemp} placement="bottom-end" enterDelay={300}>
                                  <div>{d.lasttemp}</div>
                                </Tooltip>
                              </TableCell>
                              <TableCell style={dstyles.holdoverColumn}>
                                <Tooltip title={d.holdover} placement="bottom-middle" enterDelay={300}>
                                 <div>{d.holdover}</div>
                                </Tooltip>
                              </TableCell>
                              <TableCell style={dstyles.deviceColumn}>
                                <Tooltip title={d.brand} placement="bottom-start" enterDelay={300}>
                                  <div>{d.brand}</div>
                                </Tooltip>
                              </TableCell>
                              <TableCell style={dstyles.facilityColumn}>
                                <Tooltip title={d.facility} placement="bottom-start" enterDelay={300}>
                                  <div>{d.facility}</div>
                                </Tooltip>
                              </TableCell>

                              <TableCell style={dstyles.lastpingColumn}>
                                <Tooltip title={d.lastping} placement="bottom-start" enterDelay={300}>
                                  <div style={d.lastpingstyle}>{d.lastping}</div>
                                </Tooltip>
                              </TableCell>

                          </TableRow>
                    )})}
                  </TableBody>

                </Table>

              </div>

              </Tab>

              <Tab
                label="Locations"
              >
                <div>
                  <h2 style={dstyles.headline}>Locations</h2>
                  <Card style={dstyles.fourthCard} >
                    <CardHeader
                      title="Sample"
                      subtitle="For future use"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>
                  <Card style={dstyles.fourthCard} >
                    <CardHeader
                      title="Sample"
                      subtitle="For future use"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>
                  <Card style={dstyles.fourthCard} >
                    <CardHeader
                      title="Sample"
                      subtitle="For future use"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>
                  <Card style={dstyles.fourthCard} >
                    <CardHeader
                      title="Sample"
                      subtitle="For future use"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>

                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                      <RaisedButton label="RESET DATA" secondary={true} onClick={(e) => this.resetdata(e)} />
                    </CardText>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      </div>
      )
    }
}
