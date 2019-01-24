import React, {Component} from 'react'
// import {StoreContext} from 'redux-react-hook';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TopHead from './TopHead';
import FootPane from './FootPane';
import 'typeface-roboto' // Font
import Login from './Login';
import GGConsts from './Constants';
import RTTable from './Table';
// import Alert from './Alert';
import styled from 'styled-components';
import {withStyles} from '@material-ui/core/styles';
// import AppContext from './Services/Context';
import {Provider} from 'react-redux';
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import Map from './Map/Map.js';
// import GMap from './Map/GoogleMap.js';
import Navigation from './Navigation';
import Chart from './Chart';
import store from './Store/index.js';

const styles = theme => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: `${theme.spacing.unit * 3}px`,
    }
})

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {authenticated: false}

        // TODO: mapContainerRef needs to be saved to the store so the viewport can be calibrated on load and on resize
        this.mapContainerRef = React.createRef();
    }

    authenticate = (bool) => {
        this.setState({authenticated: bool})
    }

    render() {
        const {authenticated} = this.state;

        return (
            <Provider store={store}>
                <MuiThemeProvider theme={GGConsts.MUI_THEME}>
                    {authenticated
                        ?
                        <>
                            <TopHead
                                authenticate={this.authenticate}
                                dispatch={store.dispatch}
                            />
                            <StickyFootWrap>
                                {/*<Alert />*/}
                                <MiddlePane>
                                    <IdBar>
                                        {/*<IdBarHeader>Reporting Tool</IdBarHeader>*/}
                                        <Navigation />
                                    </IdBar>
                                    <StickyFootCon>
                                        <Grid
                                            container
                                            spacing={0}
                                        >
                                            <Grid item
                                                  xs={12}
                                                  md={6}
                                            >
                                                <div ref={this.mapContainerRef}>
                                                    <Map />
                                                </div>
                                                {/*<GMap />*/}
                                            </Grid>
                                            <Grid item
                                                  xs={12}
                                                  md={6}
                                            >
                                                <RightViewContainer>
                                                    <Chart />
                                                    <RTTable />
                                                </RightViewContainer>
                                            </Grid>
                                        </Grid>
                                    </StickyFootCon>
                                </MiddlePane>
                            </StickyFootWrap>
                            <FootPane />
                        </>
                        : <Login authenticate={this.authenticate}/>}
                </MuiThemeProvider>
            </Provider>
        )
    }
}

const StickyFootWrap = styled.div`
    // flex: 1;
`;
const StickyFootCon = styled.div`
    // margin: 0 auto;
    width: 100%;
`;
// const Header = styled.h3`
//     margin: 1em;
//     font-weight: 500;
// `;
const MiddlePane = styled.div`
    // flex: 1;
`;
const RightViewContainer = styled.div`
    height: calc(100vh - 190px);
    display: flex;
    flex-direction: column;
`;
const IdBar = styled.div`
    background-color: ${GGConsts.COLOR_PURPLE};
    width: 100%;
    text-align: center;
    line-height: 30px;
    color: white;
    height: 90px; 
    @media (max-width: 1286px) {
        height: 100%;
    }
`;
// const IdBarHeader = styled.h1`
//     font-weight: 500;
//     margin-top: 20px;
// `;

export default withStyles(styles)(App);
