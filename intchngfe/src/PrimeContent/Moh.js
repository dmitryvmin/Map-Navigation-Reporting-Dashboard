import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
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
    backgroundColor: '#7cd33b',
    width: '100%',
    textAlign: 'center',
    paddingTop: '14px',
    paddingBottom: '24px',
    lineHeight: '30px',
    color: 'white',
  },
  idBarH: {
    fontWeight: '500',
    marginTop: '5px',
    marginBottom: '30px',
  },
  idBarP: {
    color: 'black',
    marginTop: '-10px',
    marginBottom: '30px',
  },
  wrapwrap: {
    width: '100%',
    margin: '0 auto',
  },
  wrapTabs: {
    width: '80vw',
    margin: '0 auto',
  },
  tabMod: {
    marginTop: '-48px',
  },
  deviceTableHeader: {
    margin: "16px 0 16px 0",
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
  wrapAddButton: {
    textAlign: 'right',
  },
  addButton: {
    marginTop: '1em',
    textAlign: 'right',
  },
};

let accountDefault = { accounts:
  [
    {
      "id": "5896a5c1-a931-4595-8205-8e7635ca4469",
      "name": "Ministry of Health Kenya",
      "category": "moh",
      "description": "Ministration of Health in Kenya"
    },
  ]
}

export default class Moh extends Component {
  constructor (props, context) {
    super(props, context);
    // Default text
    this.state = {
      accounts: accountDefault,
    }
    this.loadDevices = this.loadDevices.bind(this);
  }

  loadDevices() {
    var xhttp = new XMLHttpRequest();
    var that = this;
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let json = JSON.parse(this.responseText);
       that.setState({accounts: json});
      }
    };
    xhttp.open("GET", "http://20.36.19.106:8099/account", true);
    xhttp.setRequestHeader('Accept','application/json');
    xhttp.setRequestHeader('Authorization','Basic Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==');
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send();
  }

  componentDidMount() {
    this.loadDevices();
  }

  render () {
    return (
      <div>
        <div style={styles.idBar}>
          <h1 style={styles.idBarH}>Kenya Moh {this.props.content}</h1>
          <p style={styles.idBarP}>Manage the data flow for Kenya Cold Chain Devices</p>
        </div>
        <div style={styles.wrapwrap}>
          <div style={styles.wrapTabs} >
            <Tabs style={styles.tabMod} >
              <Tab label="Devices" >
                <div style={styles.wrapAddButton}>
                  <RaisedButton label="Add New Device ID's" primary={true} style={styles.addButton}/>
                </div>
                <div style={styles.deviceTableHeader}>
                  <Table>
                    <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                      <TableRow>
                        <TableHeaderColumn>Category</TableHeaderColumn>
                        <TableHeaderColumn>Description</TableHeaderColumn>
                        <TableHeaderColumn>Device ID</TableHeaderColumn>
                        <TableHeaderColumn>Shared with</TableHeaderColumn>
                        <TableHeaderColumn>Date Added</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {this.state.accounts.accounts.map((row, i) =>
                        <TableRow key={i}>
                          <TableRowColumn>{row.category}</TableRowColumn>
                          <TableRowColumn>{row.description}</TableRowColumn>
                          <TableRowColumn>{row.id}</TableRowColumn>
                          <TableRowColumn>{row.name}</TableRowColumn>
                          <TableRowColumn>{row.temperature}</TableRowColumn>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
              </div>

              </Tab>
              <Tab label="info" >
                <div>
                  <Card style={styles.halfCard} >
                    <CardHeader
                      title="Google it!"
                      subtitle="290 Exabytes"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                      <FlatButton label="More Data!!!" />
                      <FlatButton label="Give it to me y'all" />
                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>
                  <Card style={styles.halfCard} >
                    <CardHeader
                      title="3 Phase Profit Plan"
                      subtitle="Step 1...Steal Fridges..."
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                      <FlatButton label="Hire Gnomes" />
                      <FlatButton label="Fire Gnomes" />
                    </CardActions>
                    <CardText expandable={true}>
                      Stage 2 ??????? Stage3 Profit!!! Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>

                  <Card style={styles.thirdCard} >
                    <CardHeader
                      title="Report on Temp"
                      subtitle="Hot News!"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                      <FlatButton label="Extinguish" />
                      <FlatButton label="Call Police" />
                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>
                  <Card style={styles.thirdCard} >
                    <CardHeader
                      title="3 Phase Profit Plan"
                      subtitle="Step 1...Steal Fridges..."
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                      <FlatButton label="Hire Gnomes" />
                      <FlatButton label="Fire Gnomes" />
                    </CardActions>
                    <CardText expandable={true}>
                      Stage 2 ??????? Stage3 Profit!!! Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                  </Card>
                  <Card style={styles.thirdCard} >
                    <CardHeader
                      title="Report on Temp"
                      subtitle="Hot News!"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardActions>
                      <FlatButton label="Extinguish" />
                      <FlatButton label="Call Police" />
                    </CardActions>
                    <CardText expandable={true}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
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
