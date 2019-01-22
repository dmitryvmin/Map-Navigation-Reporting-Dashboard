import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import GGConsts from '../Constants';
import styled from 'styled-components';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
// import NativeSelect from '@material-ui/core/NativeSelect';
// import Input from '@material-ui/core/Input';
//import FormHelperText from '@material-ui/core/FormHelperText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Home from '@material-ui/icons/Home';
// import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import IconButton from '@material-ui/core/IconButton';
//import Button from '@material-ui/core/Button';
import MfcDialog from './MfcDialog';

import {
    navigationMap,
    // getFromNavMap,
    formatLabel,
} from './../Utils';

// TODO: move API logic to Sagas...
const config = {
    headers: {'Authorization': `Basic ${GGConsts.HEADER_AUTH}`}
}
const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

const styles = theme => ({
    indicator: {
        backgroundColor: '#fff',
    },
    tabRoot: {
        minWidth: 35,
        maxWidth: 70,
        minHeight: 40,
    }
})

class Navigation extends Component {
    state = {
        mfcDialog: false
    }

    onRequestData = () => {
        this.props.onRequestData(uri, config, GGConsts.SENSORS_MAP);
    }

    handleChange = source => e => {
        if (source === GGConsts.METRIC_SELECTED) {
            const value = e.target.textContent; // can't curry value by e.target.value from Tabs
            this.props.updateMetric(value);

        } else {
            const value = e.target.value;
            this.props.updateNav(source, value);
        }
    }

    handleDeviceFilter = (device_type) => (e) => {
        const {
            updateDevice,
            device_type_selected,
        } = this.props;

        if (device_type_selected === device_type) {
            updateDevice(GGConsts.DEVICE_TYPE_ALL);

        } else {
            updateDevice(device_type);
        }
    }

    toggleMfcDialog = () => {
        this.setState({ mfcDialog: !this.state.mfcDialog });
    }

    locFunction = (nav, specific, loc) => {
        let curLevel = 'country';
        if (nav.state_selected !== 'All' && nav.state_selected !== false) {
            curLevel = 'state';
        }
    
        if (nav.lga_selected !== 'All' && nav.lga_selected !== false) {
            curLevel = 'lga';
        }

        if (nav.facility_selected !== 'All' && nav.facility_selected !== false) {
            curLevel = 'facility';
        }
    
        if ( specific === 'all' || specific === 'ALL' || specific === 'All') {
            switch(loc) {
                case 'lga':
                    loc = 'LGA';
                    break;
                case 'state':
                    loc = 'State';
                    break;
                case 'facility':
                    loc = 'Facilitie';
                    break;
                default:
            }
            return <em style={{textTransform: 'none'}}>{`${specific} ${loc}s`}</em>;
        } else {
            if (loc === 'facility' || loc === 'Facility' || loc === 'FACILITY' ) { 
                if ( curLevel === 'facility') {
                    return <strong style={{color: 'white'}}>{specific}</strong>;
                } else {
                    return <strong>{specific}</strong>;
                }
            } else if ( loc === 'lga' || loc === 'Lga' || loc === 'LGA' ) {
                if ( curLevel === 'lga') {
                    return <strong style={{color: 'white'}}>{specific}</strong>;
                } else {
                    return <strong>{specific}</strong>;
                }
            } else {
                if ( curLevel === 'state') {
                    return <strong style={{color: 'white'}}>{`${specific} ${loc}`}</strong>;                
                } else {
                    return <span style={{cursor: 'pointer'}} onClick={this.goUp()}>{`${specific} ${loc}`}</span>;
                }
            }
        }
    }

    toggleFilterConnected = () => (e) => {
        if ( this.props.selected_connected && !this.props.selected_uploaded ) {
            return;
        } else {
            this.props.updateConnected(this.props.selected_connected);
        }
    }

    toggleFilterUploaded = () => (e) => {
        if ( !this.props.selected_connected && this.props.selected_uploaded ) {
            return;
        } else {
            this.props.updateUploaded(this.props.selected_uploaded);
        }
    }

    goHome = () => (e) => {
        // get actual "source" which is country_selected, state_selected, or lga_selected
        this.props.updateNav("state_selected", "All");
    }

    goUp = () => (e) => {
        const {
            updateNav,
            navigation
        } = this.props;
        console.log("The Navigation level:", navigation);
        // get actual "source" which is country_selected, state_selected, or lga_selected
        if (navigation.lga_selected === 'All' || navigation.lga_selected === false) {
            if (navigation.state_selected === 'All' || navigation.state_selected === false) {
                    // could need to do something here too. Hold please. :)
            } else {
                updateNav("state_selected", "All");
            }
        } else {
            updateNav("lga_selected", "All");
        }
        
    }

    render() {
        const {mfcDialog} = this.state;

        const {
            classes,
            // fetching,
            // sensors,
            // error,
            geo_map,
            // updateMetric,
            metric_selected,
            // device_type_selected,
            selected_connected,
            selected_uploaded,
            navigation,
            // navigation: {
            //     // country_selected,
            //     // state_selected,
            //     // lga_selected,
            //     // facility_selected
            // } = {}
            mfc_selected,
            mfc_map,
        } = this.props;
        return (
            <NavBar>
                <Grid
                    container
                    spacing={0}
                >
                    <Grid item lg={5} md={6} xs={12}>
                        <LocMenu>
                                <IconButton>
                                    <HomeStyled onClick={this.goHome()}/>
                                </IconButton>
                                {/* { ((navigation.lga_selected !== 'All' && navigation.lga_selected !== false) ||
                                (navigation.state_selected !== 'All' && navigation.state_selected !== false)) &&
                                <Back>
                                    <IconButton>
                                        <KeyboardArrowLeft style={{color: 'white'}}
                                                           onClick={this.goUp()}
                                        />
                                    </IconButton>
                                </Back>
                                } */}
                                <LocContainer>
                                    {Object.entries(navigation).map(nav => {
                                        const [t, v] = nav;
                                        const r = _.first(navigationMap.filter(m => m.type === t));
                                        const m = geo_map[r.map];

                                        if (t === 'country_selected') {
                                            return null;
                                        }
                                        if (m && v) {
                                            return (<StyledFormControl key={`${t}-${v}`}>
                                                
                                                {/* <StyledSelect
                                                    value={v}
                                                    onChange={this.handleChange(t)}
                                                    input={<StyledIn
                                                        name={`${m}`}
                                                        id={`${m}-native-helper`}/>}
                                                >
                                                    {m.map((n, i) => {
                                                        // if facility selected - no code is used
                                                        const name = r.code ? n.properties[r.code] : n;
                                                        return (
                                                            <Option
                                                                key={`nav-${name}-${i}`}
                                                                value={name}>{name}
                                                            </Option>
                                                        )
                                                    })}
                                                </StyledSelect> */}
                                                <Label style={{marginLeft: '13px', lineHeight: '18px'}}>{this.locFunction(navigation, v, formatLabel(t))}</Label>
                                            </StyledFormControl>)
                                        } else {
                                            return null;
                                        }
                                    })}
                            </LocContainer>
                        </LocMenu>
                    </Grid>
                    <Grid item lg={3} md={6} xs={12}>
                        <Header>Metric:</Header>
                        <StyledTabs
                            value={metric_selected}
                            classes={{
                                indicator: classes.indicator
                            }}
                            onChange={this.handleChange(GGConsts.METRIC_SELECTED)}
                        >
                            {GGConsts.METRICS.map(m =>
                                <StyledTab
                                    key={`metric-${m}`}
                                    classes={{root: classes.tabRoot}}
                                    label={m}
                                    value={m}
                                />
                            )}
                        </StyledTabs>
                    </Grid>
                    <Grid item lg={2} md={6} xs={6}>
                        <Header>Devices Type:</Header>
                        <ChipContainer>
                            <StyledChip
                                active={(selected_connected === true) ? 'active' : undefined}
                                onClick={this.toggleFilterConnected()}
                                label={_.capitalize(_.last(GGConsts.DEVICE_TYPE_CONNECTED.split('_')))}
                            />
                            <StyledChip
                                active={(selected_uploaded === true) ? 'active' : undefined}
                                onClick={this.toggleFilterUploaded()}
                                label={_.capitalize(_.last(GGConsts.DEVICE_TYPE_UPLOADED.split('_')))}
                            />
                        </ChipContainer>
                    </Grid>
                    <Grid item lg={2} md={6} xs={6}>
                        <ColumnMenu>
                            <Header>Manufacturer:</Header>
                            <MfcContainer>
                            { (mfc_selected.length === mfc_map.length) 
                                ?
                                    <MfcPill
                                        key={`nav-mfc-all`}
                                        value={'All'}
                                    >
                                        All
                                    </MfcPill>
                                :
                                mfc_selected.map((mfc, index) => {
                                return (
                                    (index > 1)
                                    ?
                                        (index > 2)
                                        ?
                                        ''
                                        :
                                        <MfcPill
                                            key={`nav-${mfc}-${index}`}
                                            value={mfc}
                                        >
                                            {`+${mfc_selected.length - index} more`}
                                        </MfcPill>
                                    :
                                    <MfcPill
                                        key={`nav-${mfc}-${index}`}
                                        value={mfc}
                                    >
                                        {mfc}
                                    </MfcPill>
                                )
                            })
                            }
                            <MfcDialog
                                open={mfcDialog}
                                toggle={this.toggleMfcDialog}
                            />
                                <br/><Edit onClick={this.toggleMfcDialog}>
                                    Edit
                                </Edit>
                            </MfcContainer>
                        </ColumnMenu>
                    </Grid>
                </Grid>
            </NavBar>
        );
    }
}

const MfcPill = styled.span`
    display: inline; 
    margin-right: 1em; 
    font-size: 0.8125rem;
    font-weight: 500;
`;
const MfcContainer = styled.div`
    display: flex; 
    flex-wrap: wrap;
    margin-top: 3px;
`;
const StyledFormControl = styled(FormControl)`
    display: flex !important;
    flex-direction: row !important;
`;
const Label = styled.span`
    text-transform: uppercase;
    font-size: 0.75em;
    color: #dbdbdb;
    margin: 0 1em 0 0.5em;
`;
const HomeStyled = styled(Home)`
    color: white; 
`;
// const Back = styled.div`
//     display: flex;
// `;
const Edit = styled.span`
    color: ${GGConsts.COLOR_BLUE};
    font-size: 0.8125rem;
`;
const LocContainer = styled.div`
    display: flex;
    flex-direction: column; 
    justify-content: center;
`;
const LocMenu = styled.div`
    display: flex;
    flex-direction: row; 
    height: 100%;
`;
const NavBar = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 2em;
    height: 100%;
`;
// const StyledSelect = styled(NativeSelect)`
//     color: white;
//     width: 160px;
//     margin-right: 1em;

//     &:before {
//         border - bottom: none !important;
//     }
// `;
const StyledTabs = styled(Tabs)`
    margin-top: -0.25em;
`;
const StyledTab = styled(Tab)`
    text-transform: capitalize !important;
    @media (min-width: 960px) {
        span {
            padding: 6px 4px;
        ]
    }
`;
// const Option = styled.option`
//     color: white !important;
// `;
// const StyledIn = styled(Input)`
//     color: white !important;
// `;
const ColumnMenu = styled.div`
    display: flex;
    flex-direction: column;
`;
const ChipContainer = styled.div`
    display: flex;
    
    & > div {
        height: 1.75em;
    }
`;
const StyledChip = styled(Chip)`
    color: white !important;
    background-color: #6a4f82 !important;
    margin: 0.5em 1em 0 0;
    font-weight: 500;

    ${({active}) => {
    return (active && `
        background: #ffffff50 !important;
    `)
}}
`;
const Header = styled.h4`
    text-align: left;
    font-weight: 100;
    font-size: 12px;
    margin: 0.5em 0 0;
    text-transform: uppercase;
    color: #dbdbdb;
`;

const mapStateToProps = state => {
    return {
        fetching: state.APIreducer.fetching,
        error: state.APIreducer.error,
        geo_map: state.dataReducer.geo_map,
        sensors: state.dataReducer[GGConsts.SENSORS_MAP],
        navigation: state.navigationReducer.navigation,
        metric_selected: state.metricReducer.metric_selected,
        device_type_selected: state.deviceReducer.device_type_selected,
        selected_connected: state.deviceReducer.selected_connected,
        selected_uploaded: state.deviceReducer.selected_uploaded,
        mfc_selected: state.mfcReducer.mfc_selected,
        mfc_map: state.dataReducer.mfc_map,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestData: (uri, config, resource) => dispatch({type: GGConsts.API_CALL_REQUEST, uri, config, resource}),
        updateNav: (navType, navVal) => dispatch({type: GGConsts.UPDATE_NAV, [navType]: navVal}),
        updateMetric: (metric_selected) => dispatch({type: GGConsts.UPDATE_METRIC, metric_selected}),
        updateDevice: (device_type_selected) => dispatch({type: GGConsts.UPDATE_DEVICE_TYPE, device_type_selected}),
        updateConnected: (selected_connected) => dispatch({type: GGConsts.DEVICE_TYPE_CONNECTED, selected_connected}),
        updateUploaded: (selected_uploaded) => dispatch({type: GGConsts.DEVICE_TYPE_UPLOADED, selected_uploaded}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Navigation));
