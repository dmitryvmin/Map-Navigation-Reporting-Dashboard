import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import styled from 'styled-components';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Home from '@material-ui/icons/Home';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import GGConsts from '../Constants';

import {
    navigationMap,
    // getFromNavMap,
    // formatLabel
} from './../Utils';

const config = {
    headers: {'Authorization': `Basic ${GGConsts.HEADER_AUTH}`}
}
const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

const styles = theme => ({
    indicator: {
        backgroundColor: '#fff',
    },
    tabRoot: {
        minWidth: 40
    }
})

class Navigation extends Component {
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

    toggleFilterConnected = () => (e) => {
        this.props.updateConnected(this.props.selected_connected);
        if ( this.props.selected_connected && !this.props.selected_uploaded ) {
            this.props.updateUploaded(this.props.selected_uploaded);
        }
    }

    toggleFilterUploaded = () => (e) => {
        this.props.updateUploaded(this.props.selected_uploaded);
        if ( !this.props.selected_connected && this.props.selected_uploaded ) {
            this.props.updateConnected(this.props.selected_connected);
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
        } = this.props;

        return (
            <NavBar>
                <Grid
                    container
                    spacing={0}>
                    <Grid item lg={2} md={6} xs={12}>
                        <ColumnMenu>
                            <Header>Location:
                                <IconButton>
                                    <Home style={{color: 'white'}} onClick={this.goHome()}/>
                                </IconButton>
                            </Header>

                            {Object.entries(navigation).map(nav => {
                                const [t, v] = nav;
                                const r = _.first(navigationMap.filter(m => m.type === t));
                                const m = geo_map[r.map];

                                if (m && v) {
                                    return (<FormControl key={`${t}-${v}`}>
                                        <StyledSelect
                                            value={v}
                                            onChange={this.handleChange(t)}
                                            input={<StyledIn
                                                name={`${m}`}
                                                id={`${m}-native-helper`}/>}
                                        >
                                            {m.map((n, i) => {
                                                const name = n.properties[r.code];
                                                return (
                                                    <Option
                                                        key={`nav-${name}-${i}`}
                                                        value={name}>{name}
                                                    </Option>
                                                )
                                            })}
                                        </StyledSelect>
                                        {/*<Label>{formatLabel(t)}</Label>*/}
                                    </FormControl>)
                                } else {
                                    return null;
                                }

                            })}
                            { ((navigation.lga_selected !== 'All' && navigation.lga_selected !== false) || (navigation.state_selected !== 'All' && navigation.state_selected !== false)) ?
                            <div style={{display: 'inline-flex',width:'20%', height:'33px', fontSize: '10px', margin: 0, padding:0}}>
                                <IconButton>
                                    <KeyboardArrowUp style={{color: 'white'}} onClick={this.goUp()}/>
                                </IconButton>
                            </div>
                            : ''
                            }
                        </ColumnMenu>
                    </Grid>
                    <Grid item lg={5} md={6} xs={12}>
                        <Header>Metric:</Header>
                        <Tabs
                            value={metric_selected}
                            classes={{
                                indicator: classes.indicator
                            }}
                            onChange={this.handleChange(GGConsts.METRIC_SELECTED)}>
                            {GGConsts.METRICS.map(m =>
                                <StyledTab
                                    key={`metric-${m}`}
                                    classes={{root: classes.tabRoot}}
                                    label={m}
                                    value={m}
                                />
                            )}
                        </Tabs>
                    </Grid>
                    <Grid item lg={3} md={6} xs={6}>
                        <Header>Devices Type:</Header>
                        <ChipContainer>
                            <StyledChip
                                active={(selected_connected === true) ? 'active' : undefined}
                                onClick={this.toggleFilterConnected()}
                                label={_.last(GGConsts.DEVICE_TYPE_CONNECTED.split('_'))}
                            />
                            <StyledChip
                                active={(selected_uploaded === true) ? 'active' : undefined}
                                onClick={this.toggleFilterUploaded()}
                                label={_.last(GGConsts.DEVICE_TYPE_UPLOADED.split('_'))}
                            />
                        </ChipContainer>

                    </Grid>
                    <Grid item lg={2} md={6} xs={6}>
                        <ColumnMenu>
                            <Header>Manufacturer:</Header>
                            {<FormControl>
                                <StyledSelect
                                    onChange={this.handleChange('Manufacturer')}
                                    input={
                                        <StyledIn
                                            name="manufacturer"
                                            id="state-native-helper"
                                        />}
                                >
                                    {['All', 'm1', 'm2', 'm3'].map((mfc, index) => {
                                        return (
                                            <Option
                                                key={`nav-${mfc}-${index}`}
                                                value={mfc}>{mfc}</Option>
                                        )
                                    })}
                                </StyledSelect>
                                {/*<Label>Manufacturer</Label>*/}
                            </FormControl>}
                        </ColumnMenu>
                    </Grid>
                </Grid>
            </NavBar>
        );
    }
}

const NavBar = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 4em;
`;
const StyledSelect = styled(NativeSelect)`
    color: white;
    width: 160px;
    margin-right: 1em;

    &:before {
        border - bottom: none !important;
    }
`;
const StyledTab = styled(Tab)`
    text-transform: capitalize !important;
`;
const Option = styled.option`
    color: white !important;
`;
const StyledIn = styled(Input)`
    color: white !important;
`;
const ColumnMenu = styled.div`
    display: flex;
    flex-direction: column;
`;
// const Label = styled(FormHelperText)`
//     color: white !important;
// `;
const ChipContainer = styled.div`
    display: flex;
`;
const StyledChip = styled(Chip)`
    color: white !important;
    background-color: #6a4f82 !important;
    margin: 0.5em 1em 0 0;

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
    margin: 0;
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
