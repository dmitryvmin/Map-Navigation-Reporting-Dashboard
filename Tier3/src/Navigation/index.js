import React, { Component } from 'react';
import _ from 'lodash';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import { getCountryObjByName } from './../Utils';

import store from './../Store/index.js';
import { connect } from "react-redux";
import GGConsts from '../Constants';

const config = {
    headers: { 'Authorization': `Basic ${GGConsts.HEADER_AUTH}` }
}

const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

const resource = 'SENSORS_MAP';


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
        this.props.onRequestData(uri, config, resource);
    }

    handleChange = source => event => {
        switch (source) {
            case GGConsts.NAV_COUNTRY_SELECTED:
                const name = event.target.value;
                const countries = this.props.countries;
                const country_selected = getCountryObjByName(countries, name);
                this.props.selectCountry(country_selected);
                return;

            case GGConsts.NAV_STATE_SELECTED:
                const state_selected = event.target.value;
                this.props.selectState(state_selected);
                return;

            case GGConsts.NAV_LGA_SELECTED:
                const lga_selected = event.target.value;
                this.props.selectLGA(lga_selected);
                return;

            case GGConsts.NAV_FACILITY_SELECTED:
                const facility_selected = event.target.value;
                this.props.selectFacility(facility_selected);
                return;

            default:
                return;

        }

    }

    render() {
        const { fetching,
                sensors,
                error,
                countries,
                states,
                lgas,
                facilities,
                country_selected,
                state_selected,
                lga_selected,
                facility_selected } = this.props;

        const country = country_selected || _.first(countries.name);
        const state = state_selected || (states && _.first(states));
        const lga = lga_selected || (lgas && _.first(lgas));
        const facility = facility_selected || (facilities && _.first(facilities));

        return (
            <div style={{display: 'flex'}}>

                <div className="Navigation">

                    <h4>Navigation</h4>

                    {/*TIER 1*/}
                    {countries && <FormControl>
                        {/*<InputLabel htmlFor="country-native-simple">Country</InputLabel>*/}
                        <NativeSelect
                            value={country.name}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange(GGConsts.NAV_COUNTRY_SELECTED)}
                            input={<Input name="country" id="country-native-helper" />}
                        >
                            {countries.map((country, index) => {
                                return(
                                    <option key={`nav-${country}-${index}`} value={country.name}>{country.name}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Country</FormHelperText>
                    </FormControl>}


                    {/*TIER 2*/}
                    {(country_selected.name !== 'all') && states && <FormControl>
                        <NativeSelect
                            value={state.name}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange(GGConsts.NAV_STATE_SELECTED)}
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
                    {(state_selected.name !== 'all') && lgas && <FormControl>
                        <NativeSelect
                            value={lga.name}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange(GGConsts.NAV_LGA_SELECTED)}
                            input={<Input name="lga" id="state-native-helper" />}
                        >
                            {lgas.map((l,i) => {
                                return(
                                    <option key={`nav-${l}-${i}`} value={l}>{l}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>LGAs</FormHelperText>
                    </FormControl>}

                    {/*TIER 4*/}
                    {(lga_selected && lga_selected.name !== 'all') && facilities && <FormControl>
                        <NativeSelect
                            value={facility}
                            style={{width: '150px', marginRight: '20px'}}
                            onChange={this.handleChange(GGConsts.NAV_FACILITY_SELECTED)}
                            input={<Input name="facility" id="state-native-helper" />}
                        >
                            {facilities.map((f, index) => {
                                return(
                                    <option key={`nav-${f}-${index}`} value={f}>{f}</option>
                                )
                            })}
                        </NativeSelect>
                        <FormHelperText>Facilities</FormHelperText>
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

                <div>

                    <h4>Data Point (y-axis)</h4>

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
        countries: state.dataReducer.COUNTRIES_MAP,
        states: state.dataReducer.STATES_MAP,
        lgas: state.dataReducer.LGAS_MAP,
        facilities: state.dataReducer.FACILITIES_MAP,
        sensors: state.dataReducer.SENSORS_MAP,
        country_selected: state.navigationReducer.country_selected,
        state_selected: state.navigationReducer.state_selected,
        lga_selected: state.navigationReducer.lga_selected,
        facility_selected: state.navigationReducer.facility_selected
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestData: (uri, config, resource) => dispatch({ type: "API_CALL_REQUEST", uri, config, resource }),
        selectCountry: (country_selected) => dispatch({ type: GGConsts.NAV_COUNTRY_SELECTED, country_selected }),
        selectState: (state_selected) => dispatch({ type: GGConsts.NAV_STATE_SELECTED, state_selected }),
        selectLGA: (lga_selected) => dispatch({ type: GGConsts.NAV_LGA_SELECTED, lga_selected }),
        selectFacility: (facility_selected) => dispatch({ type: GGConsts.NAV_FACILITY_SELECTED, facility_selected }),
        // selectMfc: (manufacturer_selected) => dispatch({ type: GGConsts.NAV_MANUFACTURER_SELECTED, manufacturer_selected }),
    };
};

export const getUri = state => state.uri;

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
