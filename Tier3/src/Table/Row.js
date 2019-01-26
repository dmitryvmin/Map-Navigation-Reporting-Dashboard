import React, {Component} from 'react';
// import {connect} from "react-redux";
import GGConsts from '../Constants';
import { withStyles } from "@material-ui/core/styles";
import _ from 'lodash';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chiclets from './Chiclets';

const styles = theme => ({
    tableRow: {
        "&:hover": {
            backgroundColor: `${GGConsts.COLOR_PURPLE} !important`
        }
    }
});

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
                right = true;
            }
            else {
                return (
                <StyledCell>
                    <Chiclets
                        value={value}
                        days={data.AlarmsByDay}
                        id={id}
                    />
                </StyledCell>
                )
            }
        }
        else if (id === 'Manufacturers' && _.isArray(value) && value.length > 1) {
            value = value.join(', ');
        }
        else if (id === 'Holdover') {
            value = (!_.isNaN(value) && value !== '-') ? _.round(value, 2) : value;
            right = true;
        }
        else if (id === 'Reporting') {
            right = true;
        }
        else if (id === 'Uptime') {
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
                className={(selected) ? 'rowSelected' : null}
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

export default withStyles(styles)(Row);
