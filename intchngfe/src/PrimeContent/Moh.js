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
import ProgressBar from "virtual-progress-bar";

const alretJSON = {
      "CTBH":5.01,
      "EACP":0.03,
      "EALN":0.00,
      "ECDBAT":8.18,
      "ECHBAT":79,
      "EHZLN":0.00,
      "EOCLN":1,
      "ERROR":[
         {
            "ID":"440B",
            "INFO":"n: 29, Ce: 173.3, Ne: 0.0, Ms: 0.0, Ml: 2226"
         },
         {
            "ID":"440A",
            "INFO":"Cs: 0.0, Cl: 0.000, N: 174.058121, Us: 0.000000, Ul: 0.000000"
         }
      ],
      "ESCLN":0,
      "EVCP":2.03,
      "EVDBAT":3.92,
      "EVLN":5.83,
      "EWCP":0.06,
      "EWHLN":0.00,
      "EWLN":-0.01,
      "FRIDGEID":2882429806056571124,
      "HAMDAQ":89.61,
      "SCPX":0,
      "SDX":0,
      "SFNS":1,
      "SFNX":0,
      "SLNX":0,
      "SVTX":0,
      "TAMDAQ":24.29,
      "TCDOUT":24.31,
      "TCPDISCTL":25.25,
      "TEVIN":1.19,
      "TICBKCTL":0.62,
      "TICMCTL":0.25,
      "TRBCM":1.00,
      "TRBEBOT":3.62,
      "TRBETOP":3.56,
      "TVCBOT":4.94,
      "TVCTOPCTL":4.81,
      "measuredDtm":"2018-05-27T00:13:38+00:00"
}
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
  // console.log('statusBg', statusString);
  switch (statusString) {
    case "red":
      return {border: '2px solid #e42527'};
    case "yellow":
      return {}
    case "green":
      return {}
    default:
      return {}
  }
}

const columnData: any = [
    { id: 'status', label: 'Status'},
    { id: 'holdover', label: 'Holdover Days'},
    { id: 'lasttemp', label: 'Last Temp (C)'},
    { id: 'brand', label: 'Brand/Model'},
    { id: 'facility', label: 'Facility'},
    // { id: 'district', label: 'State/District'},
    { id: 'lastping', label: 'Last Ping (hours)'},
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
      orderBy: null,
      device_info: this.loadDevices(),
      errors: []
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

  getLastPingHours = (sensor: any) => {
    let timestamp = (sensor.temperature && sensor.temperature.timestamp) ? sensor.temperature.timestamp : null;

    if (timestamp) {
      let now = moment();
      let before = moment.utc(timestamp);
      let diff = Math.abs(before.diff(now, 'hours'));
      // timestamp = moment(moment.utc(sensor.temperature.timestamp)).fromNow(true);

      return diff;
    } else {
      return null;
    }
  }

  getLastPing = (sensor: any) => {
    let getLastPingHours = this.getLastPingHours(sensor);

    if (getLastPingHours && getLastPingHours <= 26) {
      let time: any = getLastPingHours === 1 ? 'hour' : 'hours';
      return `${getLastPingHours} ${time} ago`;
    } else if (getLastPingHours && getLastPingHours > 26) {

      let days: any = Math.floor(getLastPingHours / 24);
      let daycount: any = (days === 1) ? 'day' : 'days';
      let hours: any = Math.round(getLastPingHours - (days * 24));
      let hourscount: any = (hours === 1) ? 'hour' : 'hours';

      return `${days} ${daycount}, ${hours && hours} ${hourscount} ago`;
    } else {
      console.warn('getLastPing - no timestamp. sensor: ', sensor);
      return '-';
    }
  }

 checkStatus = (sensor: any) => {
    // return 'red' if sensor has not reported in 26 hours otherwise return sensor.status
    let lastping = this.getLastPingHours(sensor);
    let holdover = this.precisionRound(sensor.holdover, 0);
    let temperature = Math.round(sensor.temperature.value); 
    if (lastping > 26) {
      return 'red';
    } else if (holdover < 2) {
      return 'yellow';
    } else if (holdover = 0) {
      return 'red';
    } else if (temperature < 2 || temperature > 8) {
    } else {
      return sensor.status;
    }
  }

  getErrors = (sensor: any) => {
    let lastping = this.getLastPingHours(sensor);

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

  deviceRowClick = (device) => {
    this.setState({isDetailOpen: true, selectedDevice: device });
  };

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
    xhttp.open("GET", "http://20.36.19.106:9003/sensor/state", true);
    xhttp.setRequestHeader('Authorization','Basic Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==');
    xhttp.send();
  }

  resetdata(e) {
    e && e.preventDefault();
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

   handleRequestSort = (property: any, sort: any) => {
        const orderBy: any = property;
        let order: any = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        if (sort) order = sort;

        let device_info: any;

        if (property !== 'lasttemp' || property !== 'holdover') {
          device_info =
            order === 'desc'
                ? this.state.device_info.sort((a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : 1))
                : this.state.device_info.sort((a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : 1));
        } else {
          device_info =
            order === 'desc'
                ? this.state.device_info.sort((a: any, b: any) => a[orderBy] - b[orderBy])
                : this.state.device_info.sort((a: any, b: any) => b[orderBy] - a[orderBy]);
        }
        this.setState({ device_info, order, orderBy });
    };

    mapPropsToTableColumns = (json) => {
      let device_info: any = [];
      json && json.sensors && json.sensors.map((d: any) => {
        let obj: any = {}

        // Sensor Info
        obj.sensor = d;

        // Status
        obj.status = this.checkStatus(d);

        // Errors
        obj.errors = this.getErrors(d);

        // Brand/Model
        obj.brand = `${d.manufacturer} - ${d.model}`;

        // Facility
        obj.facility = d.facility.name;

        // State/District
        obj.district = d.facility.district;

        // Holdover Days
        obj.holdover = this.precisionRound(d.holdover, 0);

        // Last Ping
        obj.lastping = this.getLastPing(d);

        // Last Ping Style
        obj.lastpingstyle = this.timechecker48(d.temperature) ? dstyles.redPing : dstyles.clearPing;

        // Last Temp
        obj.lasttemp = parseInt(`${Math.round(parseFloat(d.temperature.value))}`);
        // obj.lasttemp = tempuratureShape(Math.round(d.temperature.value));

        device_info.push(obj);

      });

      // Adding test sensor
      // let testSensor = { temperature: {timestamp: '2018-05-06T00:23:53', value: 10.0}, status: 'red', sensor: 'TEST sensor', id: 1230000000 }
      // let testObj = {
      //   sensor: testSensor.sensor,
      //   status: this.checkStatus(testSensor),
      //   brand: 'TEST manufacturer',
      //   facility: 'TEST facility',
      //   district: 'TEST district',
      //   holdover: 12.34,
      //   lastping: this.getLastPing(testSensor),
      //   lastpingstyle: this.timechecker48(testSensor) ? dstyles.redPing : dstyles.clearPing,
      //   lasttemp: parseInt(`${Math.round(parseFloat(testSensor))}`)
      // }
      // device_info.push(testObj);

      this.setState((prevState: any) => {
        return {device_info}
        }, () => {

          if (!this.state.orderBy) {
            this.handleRequestSort('status', 'desc');
          } else {
            this.handleRequestSort(this.state.orderBy, this.state.order);
          }
        }
      );
    }

  createSortHandler = (property: any) => (event: any) => {
    this.handleRequestSort(property);
  };

  componentDidMount() {
    this.loadDevices();
    setInterval(this.loadDevices, 30000);
  }

  componentWillReceiveProps( nextProps ) {
    if (nextProps.reset) {
      this.resetdata();
    }
  }

  render () {
    const { order, orderBy, device_info } = this.state;
    const alertBar = (this.state.errors && Object.keys(this.state.errors).length) ? <Alert errors={this.state.errors}/> : null;

    return (
      <div>
        {alertBar}
      <div style={dstyles.middlePane}>
        <div style={dstyles.idBar}>
          <h1 style={dstyles.idBarH}>Aucma Reporting Tool</h1>
        </div>
        <div style={dstyles.wrapwrap}>
          <div style={dstyles.wrapTabs} >
              {/*<Tabs tabItemContainerStyle={{backgroundColor:"#e32427"}}
                  style={{width: "80vw", marginLeft: "auto", marginRight: "auto"}}
                  inkBarStyle={{backgroundColor:"#a21a1e", height:"4px", marginTop:"-4px"}}>
              <Tab label="Devices" >*/}
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
                      const _onClick = () => { this.deviceRowClick(d) };
                      const error = this.state.errors[d.sensor.id];

                      return (
                           <TableRow key={i} hover onClick={_onClick} style={statusBg(d.status)}>
                              <TableCell style={dstyles.statusColumn}>
                                      {(d.status === 'red') ?
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
                                              {/*<a href=""><img src="/img/link.png"/></a>*/}
                                            </div>
                                            <span>{error}</span>
                                          </div>
                                         )}>
                                    {statusDisplay(d.status)}
                                  </Tippy> :
                                  statusDisplay(d.status)
                                }
                              </TableCell>
                              <TableCell style={dstyles.holdoverColumn}>
                               <Tooltip title={d.holdover} placement="bottom" enterDelay={300}>
                                 <div>{d.holdover}</div>
                               </Tooltip>
                             </TableCell>
                             <TableCell style={dstyles.tempColumn}>
                                <Tooltip title={d.lasttemp} placement="bottom-end" enterDelay={300}>
                                    <div style={{ display: "flex", flexFlow: "row nowrap", justifyContent: "center", alignItems: "center"}}>
                                      <div style={{width: "16px", marginLeft: "-16px", height: "64px", position: 'relative'}}>
                                        {
                                          ProgressBar.render(React.createElement, {
                                                containerColor: "#ededed",
                                                direction: "column",
                                                meterColor: d.lasttemp < 2 || d.lasttemp > 8 ? "red" : "green",
                                                percent: (Math.min(Math.max(d.lasttemp, 0), 10) / 10.0) * 100
                                              })
                                        }
                                      </div>
                                      <div style={{ marginLeft: "8px" }}>{d.lasttemp}&deg;</div>
                                  </div>
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
                                  <div>{d.lastping}</div>
                                </Tooltip>
                              </TableCell>


                          </TableRow>
                    )})}
                  </TableBody>

                </Table>

              </div>

              {/*</Tab>*/}
{/*
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
                </div>*/}
          {/*    </Tab>
            </Tabs>*/}
          </div>
        </div>
      </div>
      </div>
      )
    }
}
