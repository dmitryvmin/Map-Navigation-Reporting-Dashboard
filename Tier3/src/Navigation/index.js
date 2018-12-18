import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
    navigationMap,
    getFromNavMap,
    formatLabel
} from './../Utils';
import GGConsts from '../Constants';

const config = {
    headers: {'Authorization': `Basic ${GGConsts.HEADER_AUTH}`}
}
const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;


class Navigation extends Component {

    onRequestData = () => {
        this.props.onRequestData(uri, config, GGConsts.SENSORS_MAP);
    }

    handleChange = source => event => {
        const value = event.target.value;
        this.props.updateNav(source, value);
    }

    render() {
        const {
            fetching,
            sensors,
            error,
            geo_map,
            navigation,
            navigation: {
                country_selected,
                state_selected,
                lga_selected,
                facility_selected
            } = {}
        } = this.props;

        return (
            <div style={{display: 'flex'}}>

                <div className="Navigation">

                    <h4>Navigation</h4>

                    {Object.entries(navigation).map(nav => {

                        const [t, v] = nav;
                        const r = _.first(navigationMap.filter(m => m.type === t));
                        const m = geo_map[r.map];

                        // debugger;

                        if (m && v) {
                            return (<FormControl key={`${t}-${v}`}>
                                <NativeSelect
                                    value={v}
                                    style={{width: '150px', marginRight: '20px'}}
                                    onChange={this.handleChange(t)}
                                    input={<Input name={`${m}`} id={`${m}-native-helper`}/>}
                                >
                                    {m.map((n, i) => {
                                        const name = n.properties[r.code];
                                        return (
                                            <option key={`nav-${name}-${i}`} value={name}>{name}</option>
                                        )
                                    })}
                                </NativeSelect>
                                <FormHelperText>{formatLabel(t)}</FormHelperText>
                            </FormControl>)
                        } else {
                            return null;
                        }

                    })}

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
        updateNav: (navType, navVal) => dispatch({ type: GGConsts.UPDATE_NAV, [navType]: navVal }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
