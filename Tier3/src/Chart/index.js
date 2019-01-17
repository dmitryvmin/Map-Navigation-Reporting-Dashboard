import React, {Component} from 'react';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
//import _ from 'lodash';
import GGConsts from '../Constants';
import {
    BarChart,
    Bar,
    Brush,
//    ReferenceLine,
    // XAxis,
//    YAxis,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer
} from 'recharts';

// import {getNMapChild} from './../Utils';

const styles = theme => ({
    indicator: {
        backgroundColor: '#979797',
    },
    tabRoot: {
        minWidth: 70
    }
})

// const CustomizedTick = props => {
//     const {payload, x, y} = props;

//     return (
//         <g transform={`translate(${x},${y})`}>
//             <text x={0} y={0} dy={2} fontSize="8" textAnchor="end" fill="#666"
//                   transform="rotate(-45)">{payload.value}</text>
//         </g>
//     )
// }

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: 'Bar',
        };
    }

    handleChange = (e, value) => {
        this.props.updateTimeframe(value);
    }

    toggle = e => {
        const {chartType} = this.state;
        this.setState({chartType: (chartType === 'Bar') ? 'Line' : 'Bar'});
    };

    render() {
        const {
            nav_tier,
            classes,
//            navigation,
            timeframe_selected,
            metric_selected,
            display_data,
        } = this.props;


        if (!nav_tier || !display_data) {
            return null;
        }

        const {
//            columns,
            cells,
        } = display_data || null;

        const {chartType} = this.state;

        const data = cells.filter(f => f[metric_selected] !== '-');
        // const label = (nav_tier !== 'FACILITY_LEVEL') ? getNMapChild(nav_tier, 'tier').map : null;

        return (
            <React.Fragment>
                <Controls>
                    <Tabs
                        value={timeframe_selected}
                        classes={{
                            indicator: classes.indicator
                        }}
                        onChange={this.handleChange}>
                        {GGConsts.TIMEFRAMES.map(t =>
                            <Tab
                                key={`timeframe-${t}`}
                                classes={{root: classes.tabRoot}}
                                label={t}
                                value={t}/>
                        )}
                    </Tabs>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={(chartType === 'Bar')}
                                    onChange={this.toggle}
                                />
                            }
                            label="Line / Bar"
                        />

                </Controls>


                <ResponsiveContainer
                    width="100%"
                    height={180}>
                    {(chartType === 'Bar')
                        ? <BarChart
                            data={data}
                            margin={{top: 20, right: 20, left: 20, bottom: 20}}>
                            <Tooltip/>
                            {/*<Brush dataKey='alarms' height={30} stroke="#dbdbdb"/>*/}
                            <Bar
                                dataKey={metric_selected}
                                fill="#ff9900"/>
                        </BarChart>

                        : <LineChart
                            data={data}
                            margin={{top: 20, right: 20, left: 20, bottom: 20}}>
                            <Tooltip/>
                            <Line
                                type="step"
                                dataKey={metric_selected}
                                stroke="#ff9900"
                                strokeWidth={2}/>
                            <Brush
                                dataKey='alarms'
                                height={30}
                                stroke="#dbdbdb"/>
                        </LineChart>}
                </ResponsiveContainer>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        nav_tier: state.navigationReducer.nav_tier,
        navigation: state.navigationReducer.navigation,
        display_data: state.displayReducer.display_data,
        metric_selected: state.metricReducer.metric_selected,
        timeframe_selected: state.timeframeReducer.timeframe_selected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateTimeframe: (timeframe_selected) => dispatch({type: GGConsts.UPDATE_TIMEFRAME, timeframe_selected}),
    };
};

const Controls = styled.div`
    height: 100px; 
    display: flex; 
    justify-content: space-between;
`;

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chart));
