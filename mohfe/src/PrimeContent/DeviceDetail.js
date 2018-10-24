import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import withMobileDialog from '@material-ui/core/withMobileDialog';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment-timezone';
import 'typeface-roboto';
import { dstyles } from '../Constants/deviceStyle';
import { withStyles } from '@material-ui/core/styles';
import GGConsts from '../Constants/index.js';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Document, Page } from 'react-pdf';
import SimpleAreaChart from './../Table/rechart.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const precisionRound = (number, precision) => {
  if (isNaN(number)) {
    return '-';
  }
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

const statusDisplay = (statusString) => {
  switch (statusString) {
    case "red":
      return <Dot style={{backgroundColor: 'red'}} />
    case "yellow":
      return <Dot style={{backgroundColor: 'yellow'}} />
    case "green":
      return <Dot style={{backgroundColor: 'green'}} />
    default:
      return <Dot style={{backgroundColor: 'none'}}/>
  }
}

const modalHeader = (statusString, facility) => (
  <ModalHeader>
    {statusDisplay(statusString)} &nbsp; 
    <HeaderTitle>{facility}</HeaderTitle>
  </ModalHeader>
)

function TabContainer(props) {
  return (
    <Typography component="div" 
                style={styles.tabContainer}>
      {props.children}
    </Typography>
  );
}

const RawData = ({ file, onDocumentLoad}) => (
  <Document file={file}
            onLoadSuccess={onDocumentLoad}>
    <Page pageNumber={1} />
    {/*<button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber - 1 }))}>Previous page</button>*/}
    {/*<button onClick={() => this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }))}>Next page</button>*/}
  </Document>
)


class DeviceDetail extends Component {
  state = {
    value: 0,
    numPages: null,
    pageNumber: 1,
    selectedReport: './fridgeTag.pdf'
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  }

  selectReport = event => {
    this.setState({ selectedReport: event.target.value })
  }

  render() {
    if (!this.props.device) {
          return null;
      }

    const { value,
            pageNumber, 
            numPages } = this.state;

    let { classes, 
          fullScreen, 
          device: 
          { brand = '-',
            type = '-',
            errors = '-',
            id = '-', 
            lastping = '-', 
            lastpingstyle = '-', 
            lasttemp = '-',
            device = '-', 
            status = '-',
            sensor: {
              holdover = '-',
              manufacturer = '-',
              model = '-',
              temperature: {
                timestamp,
                value: temperature_value = '-'
              } = {},
              contact: {
                email = '-',
                name = '-',
                phone = '-'
              } = {},
              facility: {
                city = '-',
                country = '-',
                district = '-',
                name: facility_name = '-',
                region = '-'
              } = {},
            } = {},
          } = {} 
        } = this.props;

    temperature_value = precisionRound(temperature_value, 2) || '-';
    holdover = holdover.constructor === Array ? holdover[0] : precisionRound(holdover, 2);
    const uploaded = type === 'uploaded' ? true : false;

    const { selectedReport } = this.state;

    return (

        <Dialog fullScreen={fullScreen}
                open={this.props.isOpen}
                onClose={this.props.handleClose}
                PaperProps={{ style: styles.dialogContainer }}
                aria-labelledby="responsive-dialog-title">

          <DialogTitle id="responsive-dialog-title"
                       disableTypography={true}
                       style={styles.modalTitle} >
            {modalHeader(status, `${manufacturer}  - ${model}`)}
          </DialogTitle>
          <DialogContentStyled>
            
            {(errors && (status !== 'green')) && <ErrorDiv color={status}>{JSON.stringify(errors)}</ErrorDiv>}

            <AppBar position="static"
                    color="inherit"
                    style={styles.alert}>
              <Tabs value={value} 
                    style={styles.tabs}
                    indicatorColor="primary"
                    classes={{
                      indicator: classes.indicator
                    }}
                    onChange={this.handleChange}>
                <Tab label="Device Info" />
                <Tab label="Location & Contact Info"/>
                {uploaded && <Tab label="Reports" />}
                <Tab label="History"/>
              </Tabs>
            </AppBar>

            {value === 0 && <TabContainer>

              <Grid container spacing={24}>
                {!uploaded && <Grid item xs={4}>
                  <h4>Last Temperature Reading</h4>
                    {temperature_value}&deg; C 
                    <Note>( safe zone: 2 - 8° )</Note>
                </Grid>}
                <Grid item xs={4}>  
                  <h4>Last Ping</h4>
                  {lastping}
                </Grid>
                {!uploaded && <Grid item xs={4}>
                  <h4>Holdover Days</h4>
                  {holdover}
                </Grid>}
                <Grid item xs={4}>
                  <h4>Serial Number</h4>
                  {id}
                </Grid>
                <Grid item xs={4}>
                  <h4>Manufacturer</h4>{manufacturer}
                  {manufacturer}
                </Grid>
                <Grid item xs={4}>
                  <h4>Model</h4>{model}
                  {model}
                </Grid>
                <Grid item xs={4}>
                  <h4>Manufactured Date</h4>
                  {'-'}
                </Grid>
              </Grid>
            </TabContainer>}

            {value === 1 && <TabContainer> 
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <h4>Facility</h4>
                  {facility_name}
                </Grid>
                <Grid item xs={4}>
                  <h4>Country</h4>
                  {country}
                </Grid>
                <Grid item xs={4}>
                  <h4>State/District</h4>
                  {district}
                </Grid>
                <Grid item xs={4}>
                  <h4>Region</h4>
                  {region}
                </Grid>
                <Grid item xs={4}>
                  <h4>Facility Contact</h4>
                  {name}
                </Grid>
                <Grid item xs={4}>
                  <h4>Contact Phone</h4>
                  {phone}
                </Grid>
                <Grid item xs={4}>
                  <h4>Email</h4>
                  {email}
                </Grid>
              </Grid>
            </TabContainer>}

            {uploaded && value === 2 && <TabContainer>
              <Grid container 
                    spacing={24} 
                    alignItems="center">
                <h4 style={styles.header}>Report: </h4>
                <FormControl className={classes.formControl}>
                  <Select value={selectedReport} 
                          onChange={this.selectReport}
                          input={<Input name="age" id="age-helper" />}>
                    <MenuItem value={'./fridgeTag.pdf'}>2018 - 10 - 2</MenuItem>
                    <MenuItem value={'./reportb.pdf'}>2018 - 9 - 24</MenuItem>
                    <MenuItem value={'./reportc.pdf'}>2018 - 9 - 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid container spacing={24}>
                <RawData onDocumentLoad={this.onDocumentLoad} file={selectedReport}/>
              </Grid>
            </TabContainer>} 

            {value === 3 && <TabContainer>
              <SimpleAreaChart />
            </TabContainer>}

          </DialogContentStyled>

          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>

        </Dialog>
    );
  }
}

const styles = {
  dialogContainer: {
    minWidth: '70vw',
    minHeight: '80vh'
  },
  modalTitle: {
    padding: '0',
    backgroundColor: GGConsts.THEME_COLOR
  },
  alert: {
    boxShadow: 'none'
  },
  tabContainer: {
    padding: '0',
    margin: '0 2em',
    height: '150px'
  },
  tabs: {
    margin: '1em 0'
  },
  indicator: {
    backgroundColor: GGConsts.THEME_COLOR
  },
  header: {
    marginLeft: '2em',
    marginRight: '1em'
  }
}

const ErrorDiv = styled.div`
  background-color: ${props => props.color};
  color: white;
  padding: 0.5em 2em;
  font-weight: 200;
`;
const ModalHeader = styled.div`
  display: flex;
`;
const Note = styled.span`
  color: #898989;
  margin-left: 1.5em;
`;
const Dot = styled.div`
  width: 24px; 
  height: 24px; 
  border-style: solid;
  border-color: #aaa;
  border-width: 1px;
  border-radius: 50%; 
  align-self: center;
  margin: 1em;
`;
const HeaderTitle = styled.div`
  color: white; 
  align-self: center;
  font-size: 1.25em;
`;
const DialogContentStyled = styled(DialogContent)`
  padding: 0 !important;
`;

DeviceDetail.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

export default withStyles(styles)(DeviceDetail);
