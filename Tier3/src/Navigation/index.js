import React, { Component } from 'react';
import _ from 'lodash';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import { getCountryObjByName, navigationMap, getFromNavMap } from './../Utils';

import store from './../Store/index.js';
import { connect } from "react-redux";
import GGConsts from '../Constants';

const config = {
    headers: { 'Authorization': `Basic ${GGConsts.HEADER_AUTH}` }
}

const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
})

class Navigation extends Component {

    onRequestData = () => {
        this.props.onRequestData(uri, config, GGConsts.SENSORS_MAP);
    }

    handleChange = source => event => {
        const value = event.target.value;
        const navUpdate = { [source]: value };
        this.props.updateNav(navUpdate);
    }

    render() {
        const {
            fetching,
            sensors,
            error,
            geo_map: {
                countries,
                states,
                lgas,
                facilities,
            } = {},
            navigation,
            navigation: {
                country_selected,
                state_selected,
                lga_selected,
                facility_selected
            } = {}
        } = this.props;

        debugger;

        return (
            <div style={{display: 'flex'}}>

                <div className="Navigation">

                    <h4>Navigation</h4>



                    {/*{navigation.map((nav, index) => {*/}



                        {/*return (*/}

                            {/*<FormControl>*/}
                                {/*<NativeSelect*/}
                                    {/*value={country_selected}*/}
                                    {/*style={{width: '150px', marginRight: '20px'}}*/}
                                    {/*onChange={this.handleChange('country_selected')}*/}
                                    {/*input={<Input name="country" id="country-native-helper" />}*/}
                                {/*>*/}
                                    {/*{countries.map((country, index) => {*/}
                                        {/*return(*/}
                                            {/*<option key={`nav-${country}-${index}`} value={country}>{country}</option>*/}
                                        {/*)*/}
                                    {/*})}*/}
                                {/*</NativeSelect>*/}
                                {/*<FormHelperText>Country</FormHelperText>*/}
                            {/*</FormControl>*/}

                        {/*)*/}



                    {/*})}*/}

                    {/*TIER 1*/}
                    {countries && country_selected &&


                    <FormControl>
                        <NativeSelect
                            value={country_selected}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange('country_selected')}
                            input={<Input name="country" id="country-native-helper" />}
                        >
                            {countries.map((country, index) => {
                                return(
                                    <option key={`nav-${country}-${index}`} value={country}>{country}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Country</FormHelperText>
                    </FormControl>}


                    {/*TIER 2*/}
                    {states && state_selected && <FormControl>
                        <NativeSelect
                            value={state_selected}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange('state_selected')}
                            input={<Input name="state" id="state-native-helper" />}
                        >
                            {states.map((state, index) => {
                                return(
                                    <option key={`nav-${state}-${index}`} value={state}>{state}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>State</FormHelperText>
                    </FormControl>}

                    {/*TIER 3*/}
                    {lgas && lga_selected && <FormControl>
                        <NativeSelect
                            value={lga_selected}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange('lga_selected')}
                            input={<Input name="lga" id="state-native-helper" />}
                        >
                            {lgas.map((l,i) => {
                                return(
                                    <option key={`nav-${l}-${i}`} value={l}>{l}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>LGA</FormHelperText>
                    </FormControl>}

                    {/*/!*TIER 4*!/*/}
                    {facilities && facility_selected && <FormControl>
                        <NativeSelect
                            value={facility_selected}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange('facility_selected')}
                            input={<Input name="facility" id="state-native-helper" />}
                        >
                            {facilities.map((f, index) => {
                                return(
                                    <option key={`nav-${f}-${index}`} value={f}>{f}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Facility</FormHelperText>
                    </FormControl>}

                </div>

                <div>

                    <h4>Metric</h4>

                    {<FormControl>
                        <NativeSelect
                            onChange={this.handleChange('datapoint')}
                            style={{width: '150px', marginRight: '20px'}}
                            input={<Input name="datapoint" id="state-native-helper" />}
                        >
                            {['# of devices', 'error ratio'].map((d, index) => {
                                return(
                                    <option key={`nav-${d}-${index}`} value={d}>{d}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Data Point</FormHelperText>
                    </FormControl>}

                </div>

                <div>
                    <h4>Filters</h4>

                    {<FormControl>
                        <NativeSelect
                            onChange={this.handleChange('Manufacturer')}
                            style={{width: '150px', marginRight: '20px'}}
                            input={<Input name="manufacturer" id="state-native-helper" />}
                        >
                            {['all', 'm1', 'm2', 'm3'].map((mfc, index) => {
                                return(
                                    <option key={`nav-${mfc}-${index}`} value={mfc}>{mfc}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Manufacturer</FormHelperText>
                    </FormControl>}

                    {<FormControl>
                        <NativeSelect
                            onChange={this.handleChange('Timeframe')}
                            style={{width: '150px', marginRight: '20px'}}
                            input={<Input name="timeframe" id="state-native-helper" />}
                        >
                            {['past day', 'past week', 'past month', 'past year'].map((t, index) => {
                                return(
                                    <option key={`nav-${t}-${index}`} value={t}>{t}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Timeframe</FormHelperText>
                    </FormControl>}

                </div>



              {/*<div>*/}
                    {/*{sensors ? (*/}
                        {/*<p className="App-intro">Keep clicking for new</p>*/}
                    {/*) : (*/}
                        {/*<p className="App-intro">Fetch Data</p>*/}
                    {/*)}*/}

                    {/*{fetching ? (*/}
                        {/*<button disabled>Fetching...</button>*/}
                    {/*) : (*/}
                        {/*<button onClick={this.onRequestData}>Request Data</button>*/}
                    {/*)}*/}

                    {/*{error && <p style={{ color: "red" }}>Uh oh - something went wrong!</p>}*/}

                    {/*<pre>{sensors && JSON.stringify(sensors)}</pre>*/}
              {/*</div>*/}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        fetching: state.APIreducer.fetching,
        error: state.APIreducer.error,
        geo_map: state.dataReducer.geo_map,
        sensors: state.dataReducer[GGConsts.SENSORS_MAP],
        navigation: state.navigationReducer.navigation,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestData: (uri, config, resource) => dispatch({ type: GGConsts.API_CALL_REQUEST, uri, config, resource }),
        updateNav: (navState) => dispatch({ type: GGConsts.UPDATE_NAV, navState }),
    };
};

export const getUri = state => state.uri;

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
