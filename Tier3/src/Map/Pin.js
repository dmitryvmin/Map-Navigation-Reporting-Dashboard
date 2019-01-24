import React, {PureComponent} from 'react';
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

export default class CityPin extends PureComponent {

    getTextSize = (zoom) => {
        const a1 = 6;
        const witch = 2.4* (8 * Math.pow(a1, 3)) / (Math.pow(zoom, 2) + (4*Math.pow(a1,2))) - 3;

        return witch;
    }

    render() {
        const {
            chart,
            zoom,
            marker
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

        console.log('@@@', marker);

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
                            {value}
                        </text>
                    </svg>
                }

                <foreignObject
                    width={containerSize}
                    height={containerSize}
                >
                {(metricPercentile && metricPercentile === 'top')
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
                            fill={(metricPercentile && metricPercentile === 'bottom') ? GGConsts.COLOR_GREEN : GGConsts.COLOR_GRAY}
                            r={(metricPercentile && metricPercentile === 'bottom') ? size/4 : size/6}
                            cx="50%"
                            cy="50%"
                        />
                    </svg>
                }
                </foreignObject>
                {(metricPercentile && metricPercentile === 'top') &&
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