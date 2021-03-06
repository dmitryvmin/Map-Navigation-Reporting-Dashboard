import React, {Component} from 'react';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GGConsts from '../Constants';
import CustomTooltip from './Tooltip';

import {
    BarChart,
    Bar,
    Brush,
    Cell,
    Tooltip,
    LineChart,
    Line,
    ResponsiveContainer
} from 'recharts';

import {getNMapChild} from './../Utils';

const styles = theme => ({
    indicator: {
        backgroundColor: '#979797',
    },
    tabRoot: {
        minWidth: 70,
    }
})

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: 'Bar',
        };
    }

    // TODO: needs to be optimized, component rerenders on table/map hover
    // shouldComponentUpdate() {}

    handleChange = (e, value) => {
        this.props.updateTimeframe(value);
    }

    toggle = e => {
        const {chartType} = this.state;
        this.setState({chartType: (chartType === 'Bar') ? 'Line' : 'Bar'});
    };

    getTrendData = () => {
        //const {timeframe_selected} = this.props;
    }

    onHover = (hoveredEl) => {

        const {
            nav_tier,
            hover,
            navHovered
        } = this.props;

        if (nav_tier !== GGConsts.FACILITY_LEVEL) {

            const childNM = getNMapChild(nav_tier, 'tier');
            const value = hoveredEl[childNM.map]
            const selected = value === hover;

            if (!selected) {
                navHovered({value});
            }
        }
    }

    render() {
        const {
            nav_tier,
            classes,
            timeframe_selected,
            metric_selected,
            display_data,
            navHovered,
            hover
        } = this.props;


        if (!nav_tier || !display_data) {
            return null;
        }

        const {
            cells,
        } = display_data || null;

        const {chartType} = this.state;
        const data = cells.filter(f => f[metric_selected] !== '-');

        return (
            <>
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
                <SwitchContainer>
                    <span>Trend</span>
                    <StyledFormControlLabel
                        control={
                            <Switch
                                checked={(chartType === 'Bar')}
                                onChange={this.toggle}
                                color="secondary"
                            />
                        }
                    />
                    <span>Rank</span>
                </SwitchContainer>
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
                            <Tooltip cursor={{fill: 'none'}} content={
                                <CustomTooltip tier={nav_tier}/>}
                            />
                            <Bar
                                dataKey={metric_selected}
                                onMouseEnter={this.onHover}
                                fill={GGConsts.COLOR_BLUE}
                            >
                                {data && data.map((cell, index) => {
                                    const NM = getNMapChild(nav_tier, 'tier');

                                    if (!NM) {
                                        return null;
                                    }

                                    const location = cell[NM.map];

                                    return (
                                        <Cell
                                            key={`chart-bar-${location}`}
                                            fill={
                                                (hover && hover.value === location)
                                                    ? `#dcc2ef`
                                                    : GGConsts.COLOR_BLUE
                                            }
                                        />
                                    )
                                })
                                }
                            </Bar>
                        </BarChart>
                        :
                        <LineChart
                            data={this.getTrendData}
                            margin={{top: 50, right: 20, left: 20, bottom: 20}}
                        >
                            <Tooltip cursor={{fill: 'none'}} content={
                                <CustomTooltip tier={nav_tier}/>}
                            />
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
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        hover: state.navigationReducer.nav_hover,
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
        navHovered: (nav_hover) => dispatch({type: GGConsts.NAV_HOVER, nav_hover}),
    };
};

const Controls = styled.div`
    // height: 100px; 
    // display: flex; 
    // justify-content: space-between;
    margin: 0 1em;
`;
const StyledFormControlLabel = styled(FormControlLabel)`
    // float: right; 
    margin: 0 !important;
`;
const StyledTabs = styled(Tabs)`
    float: left; 
`;
const SwitchContainer = styled.div`
    display: flex; 
    float: right; 
    align-items: center;
`;

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chart));
