import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
//import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment-timezone';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
// Font
import 'typeface-roboto';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  idBar: {
    backgroundColor: '#51326c',
    width: '100%',
    textAlign: 'center',
    paddingTop: '14px',
    paddingBottom: '24px',
    lineHeight: '30px',
    color: 'white',
  },
  idBarH: {
    fontWeight: '500',
    marginTop: '20px',
    marginBottom: '40px',
  },
  wrapwrap: {
    width: '100%',
    margin: '0 auto',
    marginTop: '-48px'
  },
  wrapTabs: {
    width: '80vw',
    margin: '0 auto',
  },
  tabMod: {
    marginTop: '-48px',
  },
  deviceTableHeader: {
    margin: "0",
  },
  halfCard: {
    width: '48%',
    margin: '24px 1%',
    display: 'inline-block',
  },
  thirdCard: {
    width: '31%',
    margin: '24px 1%',
    display: 'inline-block',
  },
  fourthCard: {
    width: '23%',
    margin: '24px 1%',
    display: 'inline-block',
  },
  greendot: {
    height: '20px',
    width: '20px',
    backgroundColor: 'green',
    border: '1px solid #aaa',
    borderRadius: '20px',
  },
  yellowdot: {
    height: '20px',
    width: '20px',
    backgroundColor: 'yellow',
    border: '1px solid #aaa',
    borderRadius: '20px',
  },
  reddot: {
    height: '20px',
    width: '20px',
    backgroundColor: 'red',
    border: '1px solid #aaa',
    borderRadius: '20px',
  },
  cleardot: {
    height: '20px',
    width: '20px',
    backgroundColor: 'white',
    border: '1px solid #aaa',
    borderRadius: '20px',
  },
  coldtemp: {
    padding: '5px',
    backgroundColor: 'skyblue',
    color: 'white',
    maxWidth: '50px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  hottemp: {
    padding: '5px',
    backgroundColor: 'red',
    color: 'white',
    maxWidth: '50px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  warntemp: {
    padding: '5px',
    backgroundColor: 'orange',
    color: 'white',
    maxWidth: '50px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  goodtemp: {
    padding: '5px',
    backgroundColor: 'white',
    color: 'black',
    maxWidth: '50px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  middlePane: {
    flex: '1'
  },
  redPing: {
    padding: '5px',
    backgroundColor: 'red',
    color: 'white',
    maxWidth: '80px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  clearPing: {
    padding: '5px',
    backgroundColor: 'white',
    color: 'black',
    maxWidth: '80px',
    textAlign: 'center',
    borderRadius: '4px',
  },
};

// let deviceReport = { sensors: [
//   {
//     "manufacturer": "Acuma",
//     "id" : "1",
//     "status": "green",
//     "model": "MetaFridge",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 1,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Next Leaf",
//     "id" : "1",
//     "status": "yellow",
//     "model": "Next Leaf",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 2,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Acuma",
//     "id" : "1",
//     "status": "red",
//     "model": "MetaFridge",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 4,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Next Leaf",
//     "id" : "1",
//     "status": "green",
//     "model": "Next Leaf",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 3,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Acuma",
//     "id" : "1",
//     "status": "yellow",
//     "model": "MetaFridge",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 5,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Next Leaf",
//     "id" : "1",
//     "status": "green",
//     "model": "Next Leaf",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 7,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Acuma",
//     "id" : "1",
//     "status": "green",
//     "model": "MetaFridge",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 8,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Next Leaf",
//     "id" : "1",
//     "status": "green",
//     "model": "Next Leaf",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 9,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
//   {
//     "manufacturer": "Acuma",
//     "id" : "1",
//     "status": "green",
//     "model": "MetaFridge",
//     "facility": {
//       "name": "Singida Clinic North",
//       "country": "Tanzania",
//       "district": "Signda State"
//     },
//     "temperature": {
//       "value": 2,
//       "timestamp": "2017-08-21T04:32:16.342Z"
//     }
//   },
// ]}



const statusDisplay = (statusString) => {
  switch (statusString) {
    case "red":
      return <div style={styles.reddot} />
    case "yellow":
      return <div style={styles.yellowdot} />
    case "green":
      return <div style={styles.greendot} />
    default:
      return <div style={styles.cleardot} />
  }
}

const tempuratureShape = (temperature) => {
  const tempNum = parseFloat(temperature);
  if ( tempNum < 2.0 ) {
    return <div style={styles.coldtemp}>{temperature}&deg;</div>;
  }
  else if (tempNum > 8.0 ) {
    return <div style={styles.hottemp}>{temperature}&deg;</div>;
  }
  else if (tempNum > 6.0 && tempNum <= 8.0 ) {
    return <div style={styles.warntemp}>{temperature}&deg;</div>;
  }
  else if (tempNum >= 2.0 && tempNum < 4.0 ) {
    return <div style={styles.warntemp}>{temperature}&deg;</div>;
  }
  else {
    return <div style={styles.goodtemp}>{temperature}&deg;</div>;
  }
}

export default class Moh extends Component {
  constructor (props, context) {
    super(props, context);
    // Default text
    this.state = {
      devices: null,
    }
    this.loadDevices = this.loadDevices.bind(this);
  }

  precisionRound = (number, precision) => {
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

  tableDisplay = () => {
    if (this.state.devices === null ||
        (Object.keys(this.state.devices).length === 0
         && this.state.devices.constructor === Object))
    {
      return <TableRow key="00nul00"><TableRowColumn>none</TableRowColumn></TableRow>
    }
    else {
      if (this.state.devices.sensors === null ||
          (Object.keys(this.state.devices.sensors).length === 0
          && this.state.devices.sensors.constructor === Object))
      {
        return <TableRow key="00nul00"><TableRowColumn>none</TableRowColumn></TableRow>
      }
      else {
        //moment.tz.setDefault("America/New_York");
        return this.state.devices.sensors.map((row, i) =>
            <TableRow key={i}>
              <TableRowColumn>{statusDisplay(row.status)}</TableRowColumn>
              <TableRowColumn>{row.manufacturer + ' ' + row.model}</TableRowColumn>
              <TableRowColumn>{row.facility.name}</TableRowColumn>
              <TableRowColumn>{row.facility.district}</TableRowColumn>
              <TableRowColumn>{this.precisionRound(row.holdover, 0)}</TableRowColumn>
              <TableRowColumn>
                <div style={( this.timechecker48(row.temperature) ) ? styles.redPing : styles.clearPing } >
                  { (row.temperature && row.temperature.timestamp) ? moment(row.temperature.timestamp + "Z").fromNow() : "-" }
                </div>
              </TableRowColumn>
              <TableRowColumn>{tempuratureShape(Math.round(row.temperature.value))}</TableRowColumn>
            </TableRow>
        )
      }
    }
  }

  loadDevices() {
    var xhttp = new XMLHttpRequest();
    var that = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let json = JSON.parse(this.responseText);
        that.setState({devices: json});
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
        that.setState({devices: null});
      }
    };
    xhttp.open("POST", "http://20.36.19.106:9000/demo/clear/samples", true);
    xhttp.setRequestHeader('Authorization','Basic Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==');
    xhttp.send();
  }

  componentDidMount() {
    this.loadDevices();
  }

  render () {
    return (
      <div style={styles.middlePane}>
        <div style={styles.idBar}>
          <h1 style={styles.idBarH}>Kenya Moh {this.props.content}</h1>
        </div>
        <div style={styles.wrapwrap}>
          <div style={styles.wrapTabs} >
            <Tabs tabItemContainerStyle={{backgroundColor:"#51326C"}}
                  style={{width: "50vw", marginLeft: "auto", marginRight: "auto"}}
                  inkBarStyle={{backgroundColor:"#B897D5", height:"4px", marginTop:"-4px"}}>
              <Tab label="Devices" >
                <div style={styles.deviceTableHeader}>
                  <Table>
                    <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                      <TableRow>
                        <TableHeaderColumn>Status</TableHeaderColumn>
                        <TableHeaderColumn>Brand/Model</TableHeaderColumn>
                        <TableHeaderColumn>Facility</TableHeaderColumn>
                        <TableHeaderColumn>State/District</TableHeaderColumn>
                        <TableHeaderColumn>Holdover Days</TableHeaderColumn>
                        <TableHeaderColumn>Last Ping</TableHeaderColumn>
                        <TableHeaderColumn>Last Temp (C)</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {this.tableDisplay()}
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
                  <h2 style={styles.headline}>Locations</h2>
                  <Card style={styles.fourthCard} >
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
                  <Card style={styles.fourthCard} >
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
                  <Card style={styles.fourthCard} >
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
                  <Card style={styles.fourthCard} >
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
