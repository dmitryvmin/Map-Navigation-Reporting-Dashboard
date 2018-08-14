import React, { Component } from 'react'

import { cyan500, cyan700,
grey100, grey300, grey400, grey500,
white, } from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopHead from './TopHead';
import FootPane from './FootPane';
import PrimeContent from './PrimeContent';
import 'typeface-roboto' // Font
import Login from './Login';
import GGConsts from './Constants';

// Click handler
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// Theme
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#5c9aab",
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: '#7ccf46',
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey500,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: cyan500,
  }
})

export const Auth = {
  authenticate(username, password,cb) {
    const creds: any = `${username}:${password}`;
    const header: any = {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa(creds)
    };
    fetch(`${GGConsts.API}:${GGConsts.ADMIN_PORT}/account`, { headers: new Headers (header)})
        .then(function(response) {
      
      if (response.status === 200) {
        setTimeout(() => {cb(true)}, 100)
      } else {
        console.warn('Wrong login creds ', creds);
      }

    }).catch(function(err) {
      console.warn('Auth error', err)
    });
  },

  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

export default class App extends Component {
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
    console.log('reset');
    this.setState({ resetData: true }, () => this.setState({ resetData: false }));
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        {this.state.authenticated 
        ? <React.Fragment>
            <TopHead content={this.state.content} authenticate={this.authenticate} contentChange={this.handleContentChange} />
            <div style={{flex: "1"}}><PrimeContent reset={this.state.resetData} content={this.state.content} /></div>
            <FootPane reset={this.reset} />
          </React.Fragment>
        : <Login authenticate={this.authenticate}/> }
      </MuiThemeProvider>
    )
  }
}
