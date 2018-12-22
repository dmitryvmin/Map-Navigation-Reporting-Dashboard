import React, {PureComponent} from 'react';
import PieChart from 'react-minimal-pie-chart';
import * as easing from 'easing';

import TwoLevelPieChart from './Pie.js';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
    fill: '#d00',
    stroke: 'none'
};

export default class CityPin extends PureComponent {

    render() {
        const {
            chart,
            zoom,
            name,
            value
        } = this.props;

        console.log('@@zoom:', zoom);

        const size = Math.pow(zoom, easing('exponential')[0] * 2);

        return (
            <svg
                height={size}
                viewBox="0 0 50 50"
                style={{...pinStyle, transform: `translate(${-size}px,${-size * 2}px)`, overflow: 'visible'}}>
                {/*<path d={ICON}/>*/}
                {/*<circle cx="10" cy="10" r="10"/>*/}

                <foreignObject
                    x="0"
                    y="50"
                    width="50"
                    height="50"
                >

                    {chart
                        ?
                        <PieChart
                            lineWidth={50}
                            radius={50}
                            // rounded={true}
                            animate={true}
                            // cy="40"
                            // totalValue={value}
                            data={[
                                {title: 'One', value: 10, color: '#E38627'},
                                {title: 'Two', value: 15, color: '#C13C37'},
                                {title: 'Three', value: 20, color: 'green'},
                            ]}
                        />
                        :
                        <svg>
                            <circle
                                pointerEvents="none"
                                fill="green"
                                r="8"
                                cx="50"
                                cy="50"
                            />
                        </svg>
                    }

                    {/*<TwoLevelPieChart />*/}

                </foreignObject>

                {/*<text*/}
                {/*x="150"*/}
                {/*y="150"*/}
                {/*textAnchor="middle"*/}
                {/*startOffset="50%"*/}
                {/*fontSize={'3em'}*/}
                {/*fill={'black'}>{value}</text>*/}

                <text
                    // textAnchor="middle"
                    // startOffset="50%"
                    y="125"
                    x="15"
                    fontSize={'1em'}
                    fill={'black'}>{name}</text>
            </svg>

        );
    }
}