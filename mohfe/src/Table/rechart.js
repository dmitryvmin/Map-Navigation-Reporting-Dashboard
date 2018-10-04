import React, { Component } from 'react';
import * as Recharts from 'recharts';
const {ResponsiveContainer, LineChart, Line, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip} = Recharts;
const data = [
      {name: 'Day A', uv: 4000, pv: 9000},
      {name: 'Day B', uv: 3000, pv: 7222},
      {name: 'Day C', uv: 2000, pv: 6222},
      {name: 'Day D', uv: 1223, pv: 5400},
      {name: 'Day E', uv: 1890, pv: 3200},
      {name: 'Day F', uv: 2390, pv: 2500},
      {name: 'Day G', uv: 3490, pv: 1209},
];
const SimpleAreaChart = () => (
	<div style={{width: '100%'}}>
  	<h4>Device Temperature History</h4>
    <br/>
    <ResponsiveContainer width="100%" height="80%">
      <LineChart data={data} syncId="anyId"
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Line type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8' />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default SimpleAreaChart; 
