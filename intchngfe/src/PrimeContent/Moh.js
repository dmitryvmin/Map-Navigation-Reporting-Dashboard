import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
//import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment-timezone';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import DeviceDetail from './DeviceDetail';
import 'typeface-roboto'; //Font

import Table,  {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui-next/Table';

import Tooltip from 'material-ui-next/Tooltip';

import {dstyles} from '../Constants/deviceStyle';

const columnData: any = [
    { id: '', label: 'Status'},
    { id: '', label: 'Brand/Model'},
    { id: '', label: 'Facility'},
    { id: '', label: 'State/District'},
    { id: '', label: 'Holdover Days'},
    { id: '', label: 'Last Ping'},
    { id: '', label: 'Last Temp (C)'}
]



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
      orderBy: 'messagesPerWeek'
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
        console.log("ping:", ping, " now: " , now);
        let diff = now.diff(ping, 'days');
        console.log("Diff", diff);
        if ( diff >= 2 ) {
          return true;
        } else {
          return false;
        }
     } else {
       return false;
     }
  }

  deviceRowClick = (selectedRows) => {
    this.setState({isDetailOpen: true, selectedDevice: this.state.devices.sensors[selectedRows[0]]});
  }

  handleDetailOpen = () => {
    this.setState({isDetailOpen: true});
  };

  handleDetailClose = () => {
    this.setState({isDetailOpen: false, selectedDevice: null});
  };

  // tableDisplay = () => {
  //   if (this.state.devices === null ||
  //       (Object.keys(this.state.devices).length === 0
  //        && this.state.devices.constructor === Object))
  //   {
  //     return <TableRow key="00nul00"><TableRowColumn>none</TableRowColumn></TableRow>
  //   }
  //   else {
  //     if (this.state.devices.sensors === null ||
  //         (Object.keys(this.state.devices.sensors).length === 0
  //         && this.state.devices.sensors.constructor === Object))
  //     {
  //       return <TableRow key="00nul00"><TableRowColumn>none</TableRowColumn></TableRow>
  //     }
  //     else {
  //       return this.state.devices.sensors.map((row, i) =>
  //
  //           <TableRow key={i}>
  //             <TableRowColumn style={dstyles.statusColumn}>{statusDisplay(row.status)}</TableRowColumn>
  //             <TableRowColumn style={dstyles.deviceColumn}>{row.manufacturer + ' ' + row.model}</TableRowColumn>
  //             <TableRowColumn>{row.facility.name}</TableRowColumn>
  //             <TableRowColumn style={dstyles.localeColumn}>{row.facility.district}</TableRowColumn>
  //             <TableRowColumn style={dstyles.holdoverColumn}>{this.precisionRound(row.holdover, 0)}</TableRowColumn>
  //             <TableRowColumn style={dstyles.lastpingColumn}>
  //               <div style={( this.timechecker48(row.temperature) ) ? dstyles.redPing : dstyles.clearPing } >
  //                 { (row.temperature && row.temperature.timestamp) ? moment(row.temperature.timestamp + "Z").fromNow() : "-" }
  //               </div>
  //             </TableRowColumn>
  //             <TableRowColumn style={dstyles.holdoverColumn}>{tempuratureShape(Math.round(row.temperature.value))}</TableRowColumn>
  //           </TableRow>
  //       )
  //     }
  //   }
  // }

  loadDevices() {
    var xhttp = new XMLHttpRequest();
    var that = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let json = JSON.parse(this.responseText);
        that.setState({devices: json});
      }
    };
    xhttp.open("GET", "http://20.36.19.106:9003/sensor", true);
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
        that.setState({devices: null});
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

  createSortHandler = (property: any) => (event: any) => {
      this.handleRequestSort(event, property);
  };

  componentDidMount() {
    this.loadDevices();
    setInterval(this.loadDevices, 30000);
  }

  render () {
    const { order, orderBy } = this.state;
    return (
      <div style={dstyles.middlePane}>
        <div style={dstyles.idBar}>
          <h1 style={dstyles.idBarH}>Aucma Reporting Tool</h1>
        </div>
        <div style={dstyles.wrapwrap}>
          <div style={dstyles.wrapTabs} >
            <Tabs tabItemContainerStyle={{backgroundColor:"#e32427"}}
                  style={{width: "50vw", marginLeft: "auto", marginRight: "auto"}}
                  inkBarStyle={{backgroundColor:"#a21a1e", height:"4px", marginTop:"-4px"}}>
              <Tab label="Devices" >
                <DeviceDetail
                    isOpen={this.state.isDetailOpen}
                    handleOpen={this.handleDetailOpen}
                    handleClose={this.handleDetailClose}
                    device={this.state.selectedDevice}
                />
                <div style={dstyles.deviceTableHeader}>

                 <Table style={{backgroundColor: 'white', marginTop: '15px'}}>
                  <TableHead>
                      <TableRow>
                          {columnData.map((column: any) => {

                          console.log('column', column.label);
                              return (
                                  <TableCell key={column.label}
                                             onClick={(column.label === 'Brand/Model') ? this.createSortHandler(column.label) : null}
                                             sortDirection={orderBy === column.label ? order : false}>
                                      <TableSortLabel active={orderBy === column.label}
                                                      direction={order}>{column.label}</TableSortLabel>
                                  </TableCell>
                              )
                          }, this)}
{/*=======
                <div style={dstyles.deviceTableHeader}>
                  <Table onRowSelection={this.deviceRowClick}>
                    <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                      <TableRow>
                        <TableHeaderColumn style={dstyles.statusColumn}>Status</TableHeaderColumn>
                        <TableHeaderColumn style={dstyles.deviceColumn}>Brand/Model</TableHeaderColumn>
                        <TableHeaderColumn>Facility</TableHeaderColumn>
                        <TableHeaderColumn style={dstyles.localeColumn}>State/District</TableHeaderColumn>
                        <TableHeaderColumn style={dstyles.holdoverColumn}>Holdover<br/>Days</TableHeaderColumn>
                        <TableHeaderColumn style={dstyles.lastpingColumn}>Last<br/>Ping</TableHeaderColumn>
                        <TableHeaderColumn style={dstyles.holdoverColumn}>Last<br/>Temp (C)</TableHeaderColumn>
>>>>>>> Stashed changes*/}
                      </TableRow>
                  </TableHead>

                  <TableBody>
                    {this.state.devices && this.state.devices.sensors && this.state.devices.sensors.map((d: any) => {

                    let lastPing = (d.temperature && d.temperature.timestamp) ? moment(d.temperature.timestamp + "Z").fromNow() : "-";
                    let lastTemp = tempuratureShape(Math.round(d.temperature.value));
                    return (
                        <TableRow key={d.label} hover onClick={this.deviceRowClick}>
                            <TableCell>
                                <Tooltip title={d.status} placement="bottom-start" enterDelay={300}>
                                    <div>{statusDisplay(d.status)}</div>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={`${d.manufacturer} ${d.model}`} placement="bottom-start" enterDelay={300}>
                                <div>{`${d.manufacturer} ${d.model}`}</div>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={d.facility.name} placement="bottom-start" enterDelay={300}>
                                <div>{d.facility.name}</div>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={d.facility.district} placement="bottom-start" enterDelay={300}>
                                <div>{d.facility.district}</div>
                              </Tooltip>
                            </TableCell>
                             <TableCell>
                              <Tooltip title={this.precisionRound(d.holdover, 0)} placement="bottom-start" enterDelay={300}>
                                <div>{this.precisionRound(d.holdover, 0)}</div>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={lastPing} placement="bottom-start" enterDelay={300}>
                                <div style={( this.timechecker48(d.temperature) ) ? dstyles.redPing : dstyles.clearPing }>{lastPing}</div>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={lastTemp} placement="bottom-start" enterDelay={300}>
                                <div>{lastTemp}</div>
                              </Tooltip>
                            </TableCell>
                        </TableRow>
                    )})}
                  </TableBody>

                </Table>

              </div>

              </Tab>
              {/*<Tab label="Reports" >
                <div>

                </div>
              </Tab>*/}
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
      )
    }
}
