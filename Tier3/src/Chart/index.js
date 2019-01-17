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
        minWidth: 70,
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

    getTrendData = () => {
        const {timeframe_selected} = this.props;
    }

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
                    <StyledTabs
                        value={timeframe_selected}
                        classes={{
                            root: classes.tabsRoot,
                            indicator: classes.indicator,
                        }}
                        onChange={this.handleChange}
                    >
                        {GGConsts.TIMEFRAMES.map(t =>
                            <Tab
                                key={`timeframe-${t}`}
                                classes={{
                                    root: classes.tabRoot
                                }}
                                label={t}
                                value={t}
                            />
                        )}
                    </StyledTabs>
                    <StyledFormControlLabel
                        control={
                            <Switch
                                checked={(chartType === 'Bar')}
                                onChange={this.toggle}
                                color="secondary"
                            />
                        }
                        label="Trend / Rank"
                    />
                </Controls>

                <ResponsiveContainer
                    width="100%"
                    height={150}>
                    {
                        (chartType === 'Bar')
                            ?
                            <BarChart
                                data={data}
                                margin={{top: 50, right: 20, left: 20, bottom: 20}}
                            >
                                <Tooltip/>
                                {/*<Brush dataKey='alarms' height={30} stroke="#dbdbdb"/>*/}
                                <Bar
                                    dataKey={metric_selected}
                                    fill={GGConsts.COLOR_BLUE}
                                />
                            </BarChart>
                            :
                            <LineChart
                                data={this.getTrendData}
                                margin={{top: 50, right: 20, left: 20, bottom: 20}}
                            >
                                <Tooltip/>
                                <Line
                                    type="step"
                                    dataKey={metric_selected}
                                    stroke={GGConsts.COLOR_BLUE}
                                    strokeWidth={2}
                                />
                                <Brush
                                    dataKey='alarms'
                                    height={30}
                                    stroke="#dbdbdb"
                                />
                            </LineChart>
                    }
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
    // height: 100px; 
    // display: flex; 
    // justify-content: space-between;
    margin: 0 1em;
`;
const StyledFormControlLabel = styled(FormControlLabel)`
    float: right; 
`;
const StyledTabs = styled(Tabs)`
    float: left; 
`;

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chart));
