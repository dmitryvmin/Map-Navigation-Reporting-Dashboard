import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as Recharts from 'recharts';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styled from 'styled-components';
import data from './fakeData.js';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';

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

const reports = [
    {
        from: 179,
        to: 149,
        month: 'October'
    },   {
        from: 149,
        to: 119,
        month: 'September'
    },   {
        from: 119,
        to: 89,
        month: 'August'
    },
    {
        from: 89,
        to: 59,
        month: 'July'
    },
    {
        from: 59,
        to: 29,
        month: 'June'
    },
    {
        from: 29,
        to: 0,
        month: 'May'
    }
    ];

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
        this.setState({ offsetTop: startIndex });
        // myDomNode.offsetTop
    }

    onMouseEnterHandler = (index) => {
        console.log('@@', index);
    }

    render() {
        const domainFrom = parseInt(data[this.state.from].name);
        const domainTo = parseInt(data[this.state.to].name);

        return (
            <div>
                <div style={styles.container}>
                    {/*<div style={{marginRight: 10}}>*/}
                        {/*<div style={{backgroundColor: 'red', width: 4, height: 50}}></div>*/}
                        {/*<div style={{backgroundColor: 'green', width: 4, height: 85}}></div>*/}
                        {/*<div style={{backgroundColor: 'red', width: 4, height: 25}}></div>*/}
                    {/*</div>*/}
                    <ResponsiveContainer width="100%"
                                         height="100%">
                        <LineChart data={data}
                                   margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name">
                                <Label value="Days Ago" offset={-10} position="insideBottom" />
                            </XAxis>
                            <YAxis width={70}
                                   label={{ value: "Temperature C°", angle: -90, position: "insideMiddleLeft" }}/>
                            <Tooltip payload={[{name: '3', temperature: 6}]}
                                     active={true}/>
                            <Line type="monotone"
                                  dataKey="temperature"
                                  stroke="#8884d8"
                                  dot={<CustomizedDot r={25} />}/>
                            <Brush startIndex={domainFrom}
                                   endIndex={domainTo}
                                   y={220}
                                   onChange={this.handleBrushChange}
                                >
                                <LineChart >
                                    {reports && reports.map((report, i, arr) =>
                                        <ReferenceArea x1={report.from}
                                                       x2={report.to}
                                                       fill={(i%2 === 0) ? '#fff' : '#efefef'}>
                                            <Label value={`${report.month} Report`}
                                                   offset={10}
                                                   position="bottom" />
                                        </ReferenceArea>
                                    )}
                                    <YAxis hide
                                           domain={['auto', 'auto']}/>
                                    {/*<XAxis dataKey="name"/>*/}
                                    <Line dataKey="temperature"
                                          stroke="#8884d8"
                                          dot={<CustomizedDot r={12} />}/>
                                </LineChart>
                            </Brush>
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div style={{height: '45vh', overflowY: 'scroll', marginTop: '5em'}}>
                    {/*<h3 style={{marginLeft: '2em', marginTop: '3em'}}>Error History</h3>*/}

                    <Grid ref={(scroll) => { this.scroll = scroll }} style={{offsetTop: this.state.offsetTop}}>
                        <List component="nav">
                            {data && data.map((d, i, arr) => {
                                let reportTitle = null;
                                let listItem = null;

                                if (i === 1) reportTitle = 'October Report';
                                if (i === 31) reportTitle = 'September Report';
                                if (i === 61) reportTitle = 'August Report';
                                if (i === 91) reportTitle = 'July Report';
                                if (i === 121) reportTitle = 'June Report';
                                if (i === 151) reportTitle = 'May Report';

                                if (d.temperature < 2 || d.temperature > 8) {
                                    listItem = (
                                        <ListItem button
                                                  key={`list-item-${i}`}
                                                  onMouseEnter={this.onMouseEnterHandler}>
                                            <Dot style={{backgroundColor: 'red'}}/>
                                            <span>{`Error ${i} : device temperature ${d.temperature} °C`}</span>
                                            {/*<ListItemText primary={`Error ${i}`}/>*/}
                                        </ListItem>
                                    )
                                }

                                return (
                                    <React.Fragment>
                                        {reportTitle &&
                                        <React.Fragment>
                                            <h4 style={{marginLeft: '2em'}}>{reportTitle}</h4>
                                            <Divider light />
                                        </React.Fragment>}
                                        {listItem && listItem}
                                    </React.Fragment>
                                )
                            })}
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
