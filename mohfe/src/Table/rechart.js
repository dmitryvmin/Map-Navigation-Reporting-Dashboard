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
    Curve,
    Brush,
    ResponsiveContainer,
    ComposedChart,
    LineChart,
    Line,
    XAxis,
    Label,
    YAxis,
    CartesianGrid,
    ReferenceArea,
    Tooltip } = Recharts;

const CustomizedDot = ({cx, cy, stroke, payload, value, r}) => {
    if ((value < 2 && value !== null) || (value > 8 && value !== null)) {
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

class CustomTooltip extends Component {
    render() {
        const { active } = this.props;
        if (active) {
            const { payload, label } = this.props;
            return (
                <div className="custom-tooltip">
                    <p className="label">{moment(label).format('MMM Do, YYYY')}</p>
                    <p className="intro">{payload.length ? `${payload[0].dataKey} : ${Math.round(payload[0].value)} C°` : 'no uploaded data'}</p>
                </div>
            );
        }

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

        let timestamp = moment().diff(payload.value, 'days');
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">{timestamp}</text>
            </g>
        );
    }
}

class CustomizedBrushTick extends Component {
    render () {
        const {x, y, stroke, payload} = this.props;

        let month = null;
        if (payload.value % 30 === 0) {
            month = payload.value / 30;
        }

        if (month) {
            // const label = moment(payload.value).format('MMMM');
            let now = ( parseInt(moment().format('MM')) + month ) <= 12
                ? parseInt(moment().format('MM')) + month
                : parseInt(moment().format('MM')) + month - 12;

            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={10} textAnchor="end">{moment(now, 'MM').format('MMMM')}</text>
                </g>
            );
        } else {
            return null;
        }
    }
}

class SimpleAreaChart extends Component {
    state = {
        from: 30,
        to: 1,
        offsetTop: 0
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
        const { timeline, alarms } = this.props.device;
        const domainFrom = timeline.length - 30;

        var refArea = this.props.device.meta.map(report => {

            var startDate = moment(report['began-at']).format('YYYYMMDD');
            var endDate = moment(report['ended-at']).format('YYYYMMDD');

            if (endDate - startDate > 1) {
                var from = '';
                var to = '';
                var name = `${moment(report['ended-at']).format('MMM Do')} Report`;

                timeline.forEach((day, i) => {

                    if (day['ended-at'] === startDate) {
                        from = i;
                    }
                    if (day['ended-at'] === endDate) {
                        to = i;
                    }

                });

                return {from, to, name}
            } else {
                return false;
            }
        })

        return (
            <div>
                <div style={styles.container}>
                    {/*<div style={{marginRight: 10}}>*/}
                        {/*<div style={{backgroundColor: 'red', width: 4, height: 50}}></div>*/}
                        {/*<div style={{backgroundColor: 'green', width: 4, height: 85}}></div>*/}
                        {/*<div style={{backgroundColor: 'red', width: 4, height: 25}}></div>*/}
                    {/*</div>*/}
                    {timeline && <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={timeline}
                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ended-at"
                                   tick={<CustomizedXTick/>}>
                                <Label value="Days Ago"
                                       offset={-15}
                                       position="insideBottom" />
                            </XAxis>
                            <YAxis width={70}
                                   label={{ value: "Temperature C°", angle: -90, position: "insideMiddleLeft" }}/>
                            <Tooltip content={<CustomTooltip/>} />
                            <Line type="step"
                                  dataKey="mean-value"
                                  stroke="#8884d8"
                                  dot={<CustomizedDot r={25} />} />

                            <Brush y={235}
                                   startIndex={domainFrom}
                                   onChange={this.handleBrushChange}
                                   //fill="#f8f8f8"
                                    >
                                <LineChart >
                                    <YAxis hide
                                           domain={['auto', 'auto']} />
                                    <XAxis tick={<CustomizedBrushTick />}
                                           height={1}
                                           tickLine={false}
                                           interval={0} />

                                    <Line dataKey="mean-value"
                                          stroke="#8884d8"
                                          type="step"
                                          dot={<CustomizedDot r={12} />} />

                                    {refArea && refArea.map((report, i, arr) =>
                                        <ReferenceArea x1={report.from}
                                                       x2={report.to}
                                                       // isFront={true}
                                                       fill={(i%2 === 0) ? '#a0a0a0' : '#a0a0a0'}>
                                            <Label value={report.name}
                                                   offset={-55}
                                                   position="bottom" />
                                        </ReferenceArea>
                                    )}

                                </LineChart>
                            </Brush>

                        </ComposedChart>
                    </ResponsiveContainer>}
                </div>

                <div>
                {/*<div style={{height: '45vh', overflowY: 'scroll', marginTop: '5em'}}>*/}
                    {/*<h3 style={{marginLeft: '2em', marginTop: '3em'}}>Error History</h3>*/}

                    <Grid ref={(scroll) => { this.scroll = scroll }} style={{marginTop: '4em', offsetTop: this.state.offsetTop}}>
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
                                                <p style={{fontSize: '12px', fontWeight: '600'}}>{`${moment(alarm['ended-at']).format('MMM Do, YYYY')}`}</p>
                                                <p style={{fontSize: '12px'}}>{`Alarm Level ${alarm.level} - ${alarm.code}`}</p>
                                                <p style={{fontSize: '12px'}}>{`${alarm.info}`}</p>
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
