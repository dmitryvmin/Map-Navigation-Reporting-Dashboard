import React, {Component} from 'react';
import {connect} from "react-redux";
import GGConsts from '../Constants';
import PieChart from 'react-minimal-pie-chart';
import _ from 'lodash';
import {toTitleCase} from './../Utils/DataUtils';

class LocationPin extends Component {

    getTextSize = (zoom) => {
        const a1 = 6;
        const witch = 2.4* (8 * Math.pow(a1, 3)) / (Math.pow(zoom, 2) + (4*Math.pow(a1,2))) - 3;

        return witch;
    }

    getPieData = () => {
        const {metricsPie} = this.props.marker;

        if (!metricsPie) {
            return null;
        }

        const {
            red,
            orange,
            green,
        } = metricsPie;

        return [
            {title: 'One', value: metricsPie.red, color: GGConsts.COLOR_RED},
            {title: 'Two', value: metricsPie.orange, color: GGConsts.COLOR_YELLOW},
            {title: 'Three', value: metricsPie.green, color: GGConsts.COLOR_GREEN},
        ]
    }

    render() {
        const {
            chart,
            zoom,
            marker,
            tier,
            navigation,
        } = this.props;

        const {
            name,
            value,
            metricPercentile,
        } = marker;

        const size = this.getTextSize(zoom) * zoom / 5;
        const fontSize = size / 1.5;
        const pieSize = size * 2;
        const containerSize = size * 3;
        const pieData = this.getPieData();

        return (
            <svg
                width={containerSize}
                height={containerSize}
                viewBox={`0 0 ${containerSize} ${containerSize}`}
                style={{transform: `translate(${-containerSize/2}px,${-containerSize/2}px)`, overflow: 'visible'}}
                className={`${name}-marker`}
            >
                {(metricPercentile && metricPercentile === 'top') &&
                    <svg
                        width={containerSize}
                        height={containerSize}
                    >
                        <circle
                            r={size}
                            cx="50%"
                            cy="50%"
                            className="mapCircle"
                        />
                        <text
                            x="50%"
                            y="50%"
                            fontSize={fontSize}
                            textAnchor="middle"
                            className="mapLabel"
                            alignmentBaseline="central"
                        >
                            {!isNaN(value) ? Math.round(value * 100) / 100 : value}
                        </text>
                    </svg>
                }

                <foreignObject
                    width={containerSize}
                    height={containerSize}
                >
                {(metricPercentile && metricPercentile === 'top')
                    ?
                    <>
                    {pieData
                        ?
                        <PieChart
                            lineWidth={pieSize/1.25}
                            radius={pieSize - 10}
                            startAngle={-90}
                            animate={true}
                            data={pieData}
                        />
                        : null
                    }
                    </>
                    :
                    <svg
                        width={containerSize}
                        height={containerSize}
                    >
                        <circle
                            pointerEvents="none"
                            fill={
                                (metricPercentile && metricPercentile === 'bottom')
                                    ? GGConsts.COLOR_GREEN
                                    : GGConsts.COLOR_GRAY
                            }
                            r={(metricPercentile && metricPercentile === 'bottom') ? size/4 : size/6}
                            cx="50%"
                            cy="50%"
                        />
                    </svg>
                }
                </foreignObject>
                {(
                    metricPercentile && metricPercentile === 'top' ||
                    tier === 'LGA_LEVEL' ||
                    tier === 'FACILITY_LEVEL'
                ) &&
                <text
                    className="locationName"
                    textAnchor="middle"
                    y={(metricPercentile && metricPercentile === 'top') ? containerSize + size/3 : size*3}
                    x={containerSize/2}
                    fontSize={fontSize}
                    fill={'black'}
                >
                    {name}
                </text>
                }
            </svg>
        );
    }
}

const mapStateToProps = state => {
    return {
        display_data: state.displayReducer.display_data,
        metric_selected: state.metricReducer.metric_selected,
        tier: state.navigationReducer.nav_tier,
    }
}

export default connect(mapStateToProps)(LocationPin);