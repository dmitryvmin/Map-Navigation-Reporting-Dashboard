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

export default class App extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      content: "dashboard"
    }

    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handleContentChange(contentChange) {
    this.setState({content: contentChange});
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <TopHead content={this.state.content} contentChange={this.handleContentChange} />
        <PrimeContent content={this.state.content} />
        <FootPane />
      </MuiThemeProvider>
    )
  }
}
