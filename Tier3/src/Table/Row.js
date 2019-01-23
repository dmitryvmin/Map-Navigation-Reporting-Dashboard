import React, {Component} from 'react';
// import {connect} from "react-redux";
import GGConsts from '../Constants';
import _ from 'lodash';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {chunkArray} from './../Utils';

const drawBoolLEDs = (value, days, id) => {
    let chuncks = chunkArray(days, 10);

    return (
        <Alarm>
            <AlarmVal>
                {value}
            </AlarmVal>
            <AlarmChart>
                {chuncks.map((chunk, i) =>
                    <AlarmRow key={`alarmrow-${id}-${i}`}>
                        {chunk.map((d, i) =>
                            <AlarmCell
                                key={`alarmcell-${id}-${d}-${i}`}
                                alarm={d}
                            />
                        )}
                    </AlarmRow>
                )}
            </AlarmChart>
        </Alarm>
    )
}

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

    getCell = (data, col) => {
        let id = col.id;
        let value = data[id];
        let right = false;

        if (id === 'Alarms') {
            if (data.AlarmsByDay === '-') {
                return <StyledCell>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{value}</StyledCell>;
            }
            else {
                let cell = drawBoolLEDs(value, data.AlarmsByDay, id);
                return <StyledCell>{cell}</StyledCell>;
            }
        }
        else if (id === 'Manufacturers' && _.isArray(value) && value.length > 1) {
            value = value.join(', ');
        }
        else if (id === 'Holdover') {
            value = (!_.isNaN(value) && value !== '-') ? _.round(value, 2) : value;
            right = true;
        }
        else if ( id === 'Total Devices') {
            right = true;
        }

        return <StyledCell right={right}>{value}</StyledCell>
    }

    render() {
        const {
            data,
            handleRowClick,
            handleRowHover,
            columns,
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
                {columns.map((col, index) =>
                    <TableCell key={`cell-${col.id}-${index}`}>
                        {this.getCell(data, col)}
                    </TableCell>
                )}
            </TableRow>
        )
    }
}

const StyledCell = styled.div`
    ${({right}) => (right && `
        text-align: right; 
    `)}
`;
const AlarmVal = styled.span`
    width: 30px; 
    text-align: right;
`;
const Alarm = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center;
`;
const AlarmChart = styled.div`
     margin: 0 0 0 7px;
     width: 90px;
     line-height: 2px;
     float: right; 
`;
const AlarmRow = styled.div`
`;
const AlarmCell = styled.div`
    display: inline-block;
    width: 7px;
    height: 7px;
    margin: 1px;
    background-color: ${props => props.alarm ? GGConsts.COLOR_GREEN : GGConsts.COLOR_RED}; 
`;

export default Row;
