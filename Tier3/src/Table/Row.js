import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {getNMapChild} from './../Utils';

const drawBoolLEDs = (value, days, id) => (
    <Alarm>
        {value}
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
            nav_hover: this.getHover(),
        };
    }

    getHover = () => {
        const {
            tier,
            data
        } = this.props;

        const childNav = getNMapChild(tier, 'tier');
        const hover = data[childNav.map];

        return hover;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.nav_hover &&
            nextProps.nav_hover.value &&
            nextProps.nav_hover.value === prevState.nav_hover
        ) {
            return {
                selected: true
            };
        } else {
            return {
                selected: false
            };
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = (
            (this.state.nav_hover === nextProps.nav_hover.value && !this.state.selected) ||
            (this.state.nav_hover !== nextProps.nav_hover.value && this.state.selected)
        );

        return shouldUpdate;
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

                {columns.map(c => {
                    let id = c.id;
                    let value = data[id];

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

            </TableRow>
        )
    }
}

const mapStateToProps = state => {
    return {
        nav_hover: state.navigationReducer.nav_hover,
    }
}

const StyledCell = styled.div`
    text-align: center; 
`;
const Alarm = styled.div`
    display: flex; 
    align-items: center;
`;
const AlarmChart = styled.div`
     margin: 0 0 0 7px;
     width: 52px;
     height: 20px;
     line-height: 2px;
     float: right; 
`;
const AlarmCell = styled.div`
    display: inline-block;
    width: 3px;
    height: 3px
    margin: 1px 0 1px 2px
    background-color: ${props => props.alarm ? '#d00' : '#0d0'}
`;

export default connect(mapStateToProps, null)(Row);
