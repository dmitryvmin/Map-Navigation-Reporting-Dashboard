import React, {Component} from 'react';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import _ from 'lodash';
import GGConsts from '../Constants';
import {
    BarChart,
    Bar,
    Brush,
    ReferenceLine,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer
} from 'recharts';
import {
    getData
} from './../Utils';

const styles = theme => ({
    indicator: {
        backgroundColor: '#979797',
    },
    tabRoot: {
        minWidth: 40
    }
})

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: 'Bar',
        };
    }

    handleChange = source => e => {
        // const value = e.target.value;
        // this.props.updateNav(source, value);
    }

    toggle = e => {
        const {chartType} = this.state;
        this.setState({chartType: (chartType === 'Bar') ? 'Line' : 'Bar'});
    };

    render() {
        const {
            nav_tier,
            classes
        } = this.props;

        if (!nav_tier) {
            return null;
        }

        const {chartType} = this.state;

        const data = getData(nav_tier);

        const fakeData = _.map(data, el => _.extend({}, el, {alarms: Math.floor(Math.random() * 10)}));

        return (
            <React.Fragment>
                <Controls>
                    <Tabs value={'30 d'}
                          classes={{
                              indicator: classes.indicator
                          }}
                          onChange={this.handleChange(GGConsts.METRIC_SELECTED)}>
                        {['7 d', '30 d', '60 d', 'All'].map(m =>
                            <Tab key={`metric-${m}`}
                                 classes={{ root: classes.tabRoot }}
                                 label={m}
                                 value={m}/>
                        )}
                    </Tabs>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={(chartType === 'Bar')}
                                    onChange={this.toggle}
                                />
                            }
                            label="Bar / Line"
                        />
                    </FormGroup>
                </Controls>


                <ResponsiveContainer width="100%" height={200}>
                    {(chartType === 'Bar')
                        ? <BarChart data={fakeData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                            {/*<XAxis dataKey="name"/>*/}
                            {/*<YAxis/>*/}
                            <Tooltip/>
                            {/*<ReferenceLine y={0} stroke='#000'/>*/}
                            <Brush dataKey='alarms' height={30} stroke="#dbdbdb"/>
                            <Bar dataKey="alarms" fill="#ff9900"/>
                        </BarChart>

                        : <LineChart data={fakeData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                            <Tooltip/>
                            <Line type="step" dataKey="alarms" stroke="#ff9900" strokeWidth={2} />
                            <Brush dataKey='alarms' height={30} stroke="#dbdbdb"/>
                        </LineChart>}
                </ResponsiveContainer>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        nav_tier: state.navigationReducer.nav_tier,
    }
}

const Controls = styled.div`
    display: flex; 
    justify-content: space-between;
`;

export default connect(mapStateToProps, null)(withStyles(styles)(Chart))
