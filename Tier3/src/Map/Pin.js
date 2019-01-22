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

    render() {
        const {
            chart,
            zoom,   // level of map zoom  !  use it !!  in conjunction with the font size...and other things
            name,
            value
        } = this.props;

        const size = (Math.pow(zoom, 1.85));

        const a1 = 7;
        // Witch of Agnesi formula
        const witch = 2.4* (8 * Math.pow(a1, 3)) / (Math.pow(zoom, 2) + (4*Math.pow(a1,2))) - 3;

        const pieSize = 50;

        return (
            <svg
                height={size}
                viewBox="0 0 50 50"
                style={{transform: `translate(${-size}px,${-size * 2}px)`, overflow: 'visible'}}>
                {/*<<Transition*/}
                {/*<in={true}*/}
                {/*<   timeout={duration}>*/}
                {/*<   {(state) => (*/}

                {chart &&
                    <svg y="50" x="25">
                        <circle
                            r="25px"
                            cx="50%"
                            cy="50%"
                            className="mapCircle"
                        />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dy="0.25em"
                            className="mapLabel"
                        >
                            {value}
                        </text>
                    </svg>
                }

                <foreignObject
                    x={chart ? pieSize*0.5 : 0}
                    y={pieSize}
                    width={pieSize}
                    height={pieSize}
                >
                {chart
                    ?
                    <PieChart
                        lineWidth={50}
                        radius={50}
                        startAngle={-90}
                        // rounded={true}
                        animate={true}
                        // totalValue={value}
                        data={data}
                    />
                    :
                    <svg>
                        <circle
                            pointerEvents="none"
                            fill={GGConsts.COLOR_GREEN}
                            r="8"
                            cx="50"
                            cy="50"
                        />
                    </svg>
                }
                {/*<TwoLevelPieChart />*/}
                </foreignObject>
                {/*<    )}*/}
                {/*</Transition>*/}
                {chart && <text
                    className="locationName"
                    textAnchor="middle"
                    y={chart ? 130 : 130}
                    x="50"
                    fontSize={witch}
                    fill={'black'}>{name}</text>
                }
            </svg>

        );
    }
}