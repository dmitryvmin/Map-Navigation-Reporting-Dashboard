import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as Recharts from 'recharts';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import GGConsts from '../Constants';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

const { Area,
    AreaChart,
    Brush,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Label,
    YAxis,
    CartesianGrid,
    ReferenceArea,
    Tooltip } = Recharts;


// TODO: Hook up Redux and move appropriate component folders

const loadDevices = async() => {
    // const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;
    // const uri = 'http://20.36.19.106:8780/sensor/state/uploaded';
    //
    // const config = {
    //     headers: { 'Authorization': `Basic ${GGConsts.HEADER_AUTH}` }
    // }
    //
    // try {
    //
    //     let data = await axios.get(uri, config);
    //
    //     if (data && data.data && data.data.sensors) {
    //         return data.data.sensors;
    //     } else {
    //         console.warn("@loadDevices sensor data incomplete: ", data);
    //     }
    //
    // } catch (err) {
    //     console.warn("@loadDevices error: ", err);
    // }
}


const CustomizedDot = ({cx, cy, stroke, payload, value, r}) => {
    if (value < 2 || value > 8) {
      return (
        <svg x={cx - 15} y={cy - 15} width={150} height={150} fill="red" viewBox="0 0 1024 1024">
          <path d={`M 100, 100
                   m -${r}, 0
                   a ${r},${r} 0 1,0 ${r * 2},0
                   a ${r},${r} 0 1,0 -${r * 2},0`} />
        </svg>
      );
    } else {
      return null;
    }
}

class BrushLabel extends Component {
    render () {
        const {x, y, fill, value} = this.props;
        return <text
            x={x}
            y={y}
            dy={-4}
            fontSize='16'
            textAnchor="middle">{value}</text>
    }
}

class CustomizedXTick extends Component {
    render () {
        const {x, y, stroke, payload} = this.props;

        let timestamp = moment(payload.value).fromNow();

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666">{timestamp}</text>
            </g>
        );
    }
}

class SimpleAreaChart extends Component {
    state = {
        from: 30,
        to: 1,
        offsetTop: 0
    }

    async componentDidMount() {
        const uploadedDevices = loadDevices();
    }

    handleBrushChange = ({ startIndex, endIndex }) => {
        // this.setState({
        //     from: startIndex,
        //     to: endIndex
        // });
        console.warn('@@scroll', startIndex, endIndex);
        // const myDomNode = ReactDOM.findDOMNode(this.myRef.scroll);
        // this.setState({ offsetTop: startIndex });
        // myDomNode.offsetTop
    }

    onMouseEnterHandler = (index) => {
        console.log('@@', index);
    }

    render() {
        const { sensors, alarms } = this.props.device;
        const domainFrom = sensors.samples.length - 30;

        return (
            <div>
                <div style={styles.container}>
                    {/*<div style={{marginRight: 10}}>*/}
                        {/*<div style={{backgroundColor: 'red', width: 4, height: 50}}></div>*/}
                        {/*<div style={{backgroundColor: 'green', width: 4, height: 85}}></div>*/}
                        {/*<div style={{backgroundColor: 'red', width: 4, height: 25}}></div>*/}
                    {/*</div>*/}
                    {sensors && <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sensors.samples}
                                   margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="ended-at" tick={<CustomizedXTick/>} >
                                {/*<Label value="Days Ago" offset={-10} position="insideBottom"/>*/}
                            </XAxis>
                            <YAxis width={70}
                                   label={{ value: "Temperature C°", angle: -90, position: "insideMiddleLeft" }}/>
                            <Tooltip active={true}/>
                            <Line type="monotone"
                                  dataKey="mean-value"
                                  stroke="#8884d8"
                                  dot={<CustomizedDot r={25} />}/>

                            {/*<Brush y={220}*/}
                                   {/*startIndex={domainFrom}*/}
                                   {/*endIndex={domainTo}*/}
                                   {/*onChange={this.handleBrushChange}>*/}
                            <Brush y={220}
                                   startIndex={domainFrom}
                                   onChange={this.handleBrushChange}>
                                <LineChart >
                                    {/*{reports && reports.map((report, i, arr) =>*/}
                                        {/*<ReferenceArea x1={report.from}*/}
                                                       {/*x2={report.to}*/}
                                                       {/*fill={(i%2 === 0) ? '#fff' : '#efefef'}>*/}
                                            {/*<Label value={`${report.month} Report`}*/}
                                                   {/*offset={10}*/}
                                                   {/*position="bottom" />*/}
                                        {/*</ReferenceArea>*/}
                                    {/*)}*/}
                                    <YAxis hide
                                           domain={['auto', 'auto']}/>
                                    {/*<XAxis dataKey="ended-at"/>*/}

                                    <Line dataKey="mean-value"
                                          stroke="#8884d8"
                                          dot={<CustomizedDot r={12} />}/>
                                </LineChart>
                            </Brush>

                        </LineChart>
                    </ResponsiveContainer>}
                </div>

                <div>
                {/*<div style={{height: '45vh', overflowY: 'scroll', marginTop: '5em'}}>*/}
                    {/*<h3 style={{marginLeft: '2em', marginTop: '3em'}}>Error History</h3>*/}

                    <Grid ref={(scroll) => { this.scroll = scroll }} style={{marginTop: '2em', offsetTop: this.state.offsetTop}}>
                        <List component="nav">

                            <React.Fragment>
                                {/*{reportTitle &&*/}
                                {/*<React.Fragment>*/}
                                    {/*<h4 style={{marginLeft: '2em'}}>{reportTitle}</h4>*/}
                                    {/*<Divider light />*/}
                                {/*</React.Fragment>}*/}
                                {alarms && alarms.map((alarm, index) => (
                                        <ListItem button
                                                  key={`list-item-${alarm['group-id']}-${index}`}
                                                  onMouseEnter={this.onMouseEnterHandler}>
                                            <Dot style={{backgroundColor: 'red'}}/>
                                            <div>
                                                <p>{`${moment(alarm['ended-at']).format('YYYY:MM:DD')}`}</p>
                                                <p>{`Error Level ${alarm.level} - ${alarm.code}`}</p>
                                                <p>{`${alarm.info}`}</p>
                                            </div>
                                            {/*<ListItemText primary={`Error ${i}`}/>*/}
                                        </ListItem>
                                    )
                                )}
                            </React.Fragment>

                        </List>
                    </Grid>
                </div>
            </div>
        )
    }
}

const styles = {
  container: {
    boxSizing: 'border-box',
    height: '250px', 
    width: '100%', 
    marginTop: '1em',
    padding: '10px',
    // display: 'flex',
    // flexDirection: 'row'
  }
}
const Dot = styled.div`
  width: 24px; 
  height: 24px; 
  border-style: solid;
  border-color: #aaa;
  border-width: 1px;
  border-radius: 50%; 
  align-self: center;
  margin: 1em;
`;

export default SimpleAreaChart; 
