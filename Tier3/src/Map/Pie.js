import React from 'react';
import * as Recharts from 'recharts';

const {PieChart, Pie, Sector, Cell} = Recharts;
const data = [
    {name: 'Group A', value: 400, color: '#E38627'},
    {name: 'Group B', value: 300, color: '#C13C37'},
    {name: 'Group C', value: 300, color: 'green'}];

const renderActiveShape = (props) => {
    // const RADIAN = Math.PI / 180;
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, color } = props;  // percent, value, midAngle
    // const sin = Math.sin(-RADIAN * midAngle);
    // const cos = Math.cos(-RADIAN * midAngle);
    // const sx = cx + (outerRadius + 10) * cos;
    // const sy = cy + (outerRadius + 10) * sin;
    // const mx = cx + (outerRadius + 30) * cos;
    // const my = cy + (outerRadius + 30) * sin;
    // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    // const ey = my;
    // const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={color}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={color}
            />
            {/*<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill="none"/>*/}
            {/*<circle cx={ex} cy={ey} r={2} fill={color} stroke="none"/>*/}
            {/*<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}...`}</text>*/}
            {/*<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#333">*/}
                {/*{`Ratio...`}*/}
                {/*{`(Rate ${(percent * 100).toFixed(0)}%)`}*/}
            {/*</text>*/}
        </g>
    );
};

class TwoLevelPieChart extends React.Component {
    state = {
        activeIndex: 0,
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    }

    render () {
        return (
            <PieChart width={75} height={75}>
                <Pie
                    activeIndex={this.state.activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    // cx={300}
                    // cy={200}
                    innerRadius={15}
                    outerRadius={25}
                    // fill="red"
                    onMouseEnter={this.onPieEnter}
                >
                {
                    data.map((entry, index) => <Cell fill={entry.color}/>)
                }
                </Pie>
            </PieChart>
        );
    }
};

export default TwoLevelPieChart;