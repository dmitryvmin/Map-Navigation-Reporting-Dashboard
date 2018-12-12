import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopHead from './TopHead';
import FootPane from './FootPane';
import PrimeContent from './PrimeContent';
import 'typeface-roboto' // Font
import Login from './Login';
import GGConsts from './Constants';
import RTTable from './Table';
import ManualTable from './Table/ManualTable.js';
import Alert from './Alert';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppContext from './Services/Context';
import { Provider } from 'react-redux';
import liveTableCols from './Table/LiveTableCols';
import manualTableCols from './Table/ManualTableCols';
import Card from '@material-ui/core/Card';
import SettingsInputHdmi from '@material-ui/icons/SettingsInputHdmi';
import SettingsRemote from '@material-ui/icons/SettingsRemote';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Map from './Map/Map.js';
import Navigation from './Navigation';

import store from './Store/index.js';

const styles = theme => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,
    }
})

class App extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      content: "dashboard",
      authenticated: false
    }

    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleContentChange(contentChange) {
    this.setState({content: contentChange});
  }

  authenticate = (bool) => {
    this.setState({authenticated: bool})
  }

  reset = () => {
    this.setState({ resetData: true }, () => this.setState({ resetData: false }));
  }

  render () {
    const { classes } = this.props;
    return (
      <Provider store={store}>
       <MuiThemeProvider muiTheme={GGConsts.MUI_THEME}>
         <React.Fragment>
          <TopHead content={this.state.content} authenticate={this.authenticate} contentChange={this.handleContentChange} />
          <StickyFooterWrapper>
            {/*<Alert />*/}
            <MiddlePane>
              <IdBar>
                <IdBarHeader>Reporting Tool</IdBarHeader>
              </IdBar>

              <div style={{overflow: 'none', margin: '0 auto', width: '90%'}}>

                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <Navigation />
                  </Grid>

                  {/*<Grid item xs={12}>*/}
                    {/*<Paper className={classes.paper}>*/}
                      {/*<Map />*/}
                    {/*</Paper>*/}
                  {/*</Grid>*/}

                  <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                      <Map />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={24}>
                      {/*<Grid item xs={12}>*/}
                        {/*<Paper className={classes.paper}>Charts</Paper>*/}
                      {/*</Grid>*/}
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>

                          <Card style={{overflow: 'auto'}}>
                            {/*<Header style={{display: 'flex', alignItems: 'center'}}>*/}
                              {/*<SettingsRemote style={{marginRight: '0.5em'}} />Connected Devices*/}
                            {/*</Header>*/}
                            <RTTable />
                          </Card>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>

              </div>


              {/*<Card style={{width: '80vw', margin: '1em auto'}}>*/}
                {/*<Header style={{display: 'flex', alignItems: 'center'}}><SettingsInputHdmi style={{marginRight: '0.5em'}} />Uploaded Devices</Header>*/}
                {/*<ManualTable table='manual' */}
                           {/*columns={manualTableCols} />*/}
              {/*</Card>*/}

            </MiddlePane>
          </StickyFooterWrapper>
          <FootPane reset={this.reset} />
         </React.Fragment>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

const StickyFooterWrapper = styled.div`
  flex: 1;
`;
const Header = styled.h3`
  margin: 1em;
  font-weight: 500;
`;
const MiddlePane = styled.div`
  flex: 1;
`;
const IdBar = styled.div`
  background-color: #51326c;
  width: 100%;
  text-align: center;
  padding-top: 14px;
  padding-bottom: 24px;
  line-height: 30px;
  color: white;
`;
const IdBarHeader = styled.h1`
  font-weight: 500;
  margin-top: 20px;
`;

export default withStyles(styles)(App);
