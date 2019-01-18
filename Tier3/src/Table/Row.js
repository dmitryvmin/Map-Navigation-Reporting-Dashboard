import React, {Component} from 'react';
// import {connect} from "react-redux";
import GGConsts from '../Constants';
// import _ from 'lodash';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import {getNMapChild} from './../Utils';

const drawBoolLEDs = (value, days, id) => (
    <Alarm>
        <AlarmVal>
            {value}
        </AlarmVal>
        <AlarmChart>
            {days.map((d, i) => <AlarmCell key={`alarmchart-${id}-${d}-${i}`} alarm={d}/>)}
        </AlarmChart>
    </Alarm>
)

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            selected: nextProps.selected,
            order: nextProps.order,
            orderBy: nextProps.orderBy,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        // let shouldUpdate = (
        //     (this.state.selected !== nextProps.selected) ||
        //     (this.state.order !== nextProps.order) ||
        //     (this.state.orderBy !== nextProps.orderBy)
        // );

        // return shouldUpdate;

        return true;
    }

    render() {
        const {
            data,
            // tier,
            handleRowClick,
            handleRowHover,
            columns,
            // selected,
        } = this.props;

        if (!data || !columns.length) {
            return null;
        }

        const {selected} = this.state;

        return (
            <TableRow
                onClick={handleRowClick(data)}
                onMouseEnter={handleRowHover(data)}
                tabIndex={-1}
                key={data.id}
                selected={selected}
                aria-checked={selected}
            >
                {columns.map(c => {
                    let id = c.id;
                    let value = data[id];


                    // if (c.id === 'Alarms') {
                    //     debugger;
                    // }

                    return (
                        <TableCell
                            key={`cell-${id}-${value}`}
                            align="center"
                        >
                            <StyledCell>
                                {
                                    (c.id === 'Alarms' && data.AlarmsByDay !== '-')
                                    ? drawBoolLEDs(value, data.AlarmsByDay, id)
                                    : value
                                }
                            </StyledCell>
                        </TableCell>
                    )}
                )}

                {/*{*/}
                    {/*<TableCell>*/}
                        {/*<div>{data.states}</div>*/}
                    {/*</TableCell>*/}
                {/*}*/}
            </TableRow>
        )
    }
}

const StyledCell = styled.div`
    text-align: center; 
`;
const AlarmVal = styled.span`
    // margin-left: 2em;
`;
const Alarm = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center;
`;
const AlarmChart = styled.div`
     margin: 0 0 0 7px;
     width: 105px;
     line-height: 2px;
     float: right; 
`;
const AlarmCell = styled.div`
    display: inline-block;
    width: 5px;
    height: 5px;
    margin: 1px;
    background-color: ${props => props.alarm ? GGConsts.COLOR_GREEN : GGConsts.COLOR_RED}
`;

export default Row;
