import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import styled from 'styled-components';
import {withStyles} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Chip from '@material-ui/core/Chip';
import GGConsts from '../Constants';

import {
    navigationMap,
    getFromNavMap,
    formatLabel
} from './../Utils';

const config = {
    headers: {'Authorization': `Basic ${GGConsts.HEADER_AUTH}`}
}
const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

const styles = theme => ({
    indicator: {
        backgroundColor: '#fff',
    },
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


    render() {
        const {
            classes,
            fetching,
            sensors,
            error,
            geo_map,
            updateMetric,
            metric_selected,
            navigation,
            navigation: {
                country_selected,
                state_selected,
                lga_selected,
                facility_selected
            } = {}
        } = this.props;

        return (
            <NavBar>

                <ColumnMenu>
                    <Header>Location:</Header>

                    {Object.entries(navigation).map(nav => {
                        const [t, v] = nav;
                        const r = _.first(navigationMap.filter(m => m.type === t));
                        const m = geo_map[r.map];

                        if (m && v) {
                            return (<FormControl key={`${t}-${v}`}>
                                <StyledSelect
                                    value={v}
                                    onChange={this.handleChange(t)}
                                    input={<StyledIn name={`${m}`}
                                                     id={`${m}-native-helper`}/>}
                                >
                                    {m.map((n, i) => {
                                        const name = n.properties[r.code];
                                        return (
                                            <Option key={`nav-${name}-${i}`}
                                                    value={name}>{name}</Option>
                                        )
                                    })}
                                </StyledSelect>
                                {/*<Label>{formatLabel(t)}</Label>*/}
                            </FormControl>)
                        } else {
                            return null;
                        }

                    })}
                </ColumnMenu>

                <div>
                    <Header>Metric:</Header>
                    <Tabs value={metric_selected}
                          classes={{
                              indicator: classes.indicator
                          }}
                          onChange={this.handleChange(GGConsts.METRIC_SELECTED)}>
                        {GGConsts.METRICS.map(m =>
                            <StyledTab key={`metric-${m}`}
                                       label={m}
                                       value={m}/>
                        )}
                    </Tabs>
                </div>

                <div>
                    <Header>Devices Type:</Header>
                    <StyledChip label="Connected"/>
                    <StyledChip label="Uploaded"/>
                </div>

                <ColumnMenu>
                    <Header>Manufacturer:</Header>
                    {<FormControl>
                        <StyledSelect
                            onChange={this.handleChange('Manufacturer')}
                            input={<StyledIn name="manufacturer"
                                             id="state-native-helper"/>}
                        >
                            {['all', 'm1', 'm2', 'm3'].map((mfc, index) => {
                                return (
                                    <Option key={`nav-${mfc}-${index}`}
                                            value={mfc}>{mfc}</Option>
                                )
                            })}
                        </StyledSelect>
                        {/*<Label>Manufacturer</Label>*/}
                    </FormControl>}
                </ColumnMenu>

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
const Label = styled(FormHelperText)`
    color: white !important; 
`;
const StyledChip = styled(Chip)`
    color: white;
    background-color: #6a4f82;
    margin-right: 0.5em;
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestData: (uri, config, resource) => dispatch({type: GGConsts.API_CALL_REQUEST, uri, config, resource}),
        updateNav: (navType, navVal) => dispatch({type: GGConsts.UPDATE_NAV, [navType]: navVal}),
        updateMetric: (metric_selected) => dispatch({type: GGConsts.UPDATE_METRIC, metric_selected}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Navigation));
