import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopHead from './TopHead';
import FootPane from './FootPane';
import PrimeContent from './PrimeContent';
import 'typeface-roboto' // Font
import Login from './Login';
import GGConsts from './Constants';
import LiveTable from './Table/LiveTable.js';
import ManualTable from './Table/ManualTable.js';
import Alert from './Alert';
import styled from 'styled-components';
import AppContext from './Services/Context';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './Services/store';
import liveTableCols from './Table/LiveTableCols';
import manualTableCols from './Table/ManualTableCols';
import Card from '@material-ui/core/Card';
// import store from './Services/store';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin()

const middlewares = [thunk];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware)
}  

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(...middlewares)
);

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
    return (
      <Provider store={store}>
       <MuiThemeProvider muiTheme={GGConsts.MUI_THEME}>
          <TopHead content={this.state.content} authenticate={this.authenticate} contentChange={this.handleContentChange} />
          <StickyFooterWrapper>
            <Alert />
            <MiddlePane>
              <IdBar>
                <IdBarHeader>Example MoH</IdBarHeader>
              </IdBar>
              <Card style={{width: '80vw', margin: '1em auto'}}>
                <Header>Uploaded Fridge Tag Data</Header>
                <ManualTable table='manual' 
                           columns={manualTableCols} />
              </Card>
              <Card style={{width: '80vw', margin: '1em auto'}}>
                <Header>Live Fridge Tag Data</Header>
                <LiveTable table='live' 
                           columns={liveTableCols} />
              </Card>
            </MiddlePane>
          </StickyFooterWrapper>
          <FootPane reset={this.reset} />
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

export default App; 

