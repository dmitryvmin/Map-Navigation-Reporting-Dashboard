import React, { Component } from 'react';
import * as Recharts from 'recharts';
const { Brush, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;
const data = [
      {name: '7', uv: 4000, pv: 4, amt: 2400},
      {name: '6', uv: 3000, pv: 5, amt: 2210},
      {name: '5', uv: 2000, pv: 1, amt: 2290},
      {name: '4', uv: 2780, pv: 4, amt: 2000},
      {name: '3', uv: 1890, pv: 6, amt: 2181},
      {name: '2', uv: 2390, pv: 10, amt: 2500},
      {name: '1', uv: 3490, pv: 5, amt: 2100},
];

class CustomizedDot extends Component{
  render () {
    const {cx, cy, stroke, payload, value} = this.props;

    if (value < 2 || value > 8) {
      return (
        <svg x={cx - 15} y={cy - 15} width={150} height={150} fill="red" viewBox="0 0 1024 1024">
          <path d="M 100, 100
                   m -75, 0
                   a 75,75 0 1,0 150,0
                   a 75,75 0 1,0 -150,0" />
        </svg>
      );
    } else {
      return null; 
    }
  }
}

const SimpleAreaChart = () => (
  <div style={styles.container}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis width={20} />
        <Tooltip/>
        <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={<CustomizedDot />}/>
        {/*<Brush />*/}
      </LineChart>
    </ResponsiveContainer>
  </div>
)

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '250px', 
    width: '100%', 
    marginTop: '2em',
    padding: '10px'
  }
}

export default SimpleAreaChart; 
