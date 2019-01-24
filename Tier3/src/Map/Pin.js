import React, {Component} from 'react';
import {connect} from "react-redux";
import GGConsts from '../Constants';
import PieChart from 'react-minimal-pie-chart';
// import Transition from 'react-transition-group/Transition';
// import TwoLevelPieChart from './Pie.js';

// const duration = 2000;
// const transitionStyles = {
//     entering: {opacity: 0},
//     entered: {opacity: 1},
// };

const data = [
    {title: 'One', value: 10, color: GGConsts.COLOR_RED},
    {title: 'Two', value: 15, color: GGConsts.COLOR_YELLOW},
    {title: 'Three', value: 20, color: GGConsts.COLOR_GREEN},
]

class LocationPin extends Component {

    getTextSize = (zoom) => {
        const a1 = 6;
        const witch = 2.4* (8 * Math.pow(a1, 3)) / (Math.pow(zoom, 2) + (4*Math.pow(a1,2))) - 3;

        return witch;
    }

    render() {
        const {
            chart,
            zoom,
            name,
            value
        } = this.props;
        console.log("props of Pin:", this.props);

        const size = this.getTextSize(zoom) * zoom / 5;
        const fontSize = size / 1.5;
        const pieSize = size * 2;
        const containerSize = size * 3;

        return (
            <svg
                width={containerSize}
                height={containerSize}
                viewBox={`0 0 ${containerSize} ${containerSize}`}
                style={{transform: `translate(${-containerSize/2}px,${-containerSize/2}px)`, overflow: 'visible'}}
                className={`${name}-marker`}
            >
                {chart &&
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
                {chart
                    ?
                    <PieChart
                        lineWidth={pieSize / 1.25}
                        radius={pieSize - 10}
                        startAngle={-90}
                        animate={true}
                        data={data}
                    />
                    :
                    <svg
                        width={containerSize}
                        height={containerSize}
                    >
                        <circle
                            pointerEvents="none"
                            fill={GGConsts.COLOR_GREEN}
                            r={size/5}
                            cx="50%"
                            cy="50%"
                        />
                    </svg>
                }
                </foreignObject>
                {chart &&
                    <text
                        className="locationName"
                        textAnchor="middle"
                        y={containerSize + size / 3}
                        x={containerSize / 2}
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
    }
}

export default connect(mapStateToProps)(LocationPin);