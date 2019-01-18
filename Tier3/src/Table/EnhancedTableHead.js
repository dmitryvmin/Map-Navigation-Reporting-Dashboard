import React from 'react';
// import GGConsts from '../Constants';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import styled, { css } from "styled-components";
// import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    formatLabel = (label) => {
        if (
            label === 'states' ||
            label === 'lgas'
        ) {
            return label.substring(0, label.length - 1);
        } else if (label === 'facilities') {
            return 'facility';
        } else {
            return label;
        }

    }

    render() {
        const {   // onSelectAllClick,
            order,
            orderBy,
            // numSelected,
            // rowCount,
            tableCols
        } = this.props;

        return (
            <StyledTableHead>
                <TableRow>
                    {tableCols.map(col => {
                        return (
                            <StyledTableCell
                                total={(col.label === 'Total Devices') ? "true" : "false"}
                                key={col.id}
                                numeric={col.numeric}
                                padding={col.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === col.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === col.id}
                                    direction={order}
                                    onClick={this.createSortHandler(col.id)}
                                >
                                    {this.formatLabel(col.label)}
                                </TableSortLabel>
                            </StyledTableCell>
                        );
                    }, this)}
                </TableRow>
            </StyledTableHead>
        );
    }
}

const StyledTableCell = styled(TableCell)`
    background-color: #fafafa; 
    position: sticky;
    top: 0;
    text-align: center !important; 
    
    ${props => 
        props.total && css`
            width: 25%; 
    `}
`;
const StyledTableHead = styled(TableHead)`
    text-transform: uppercase;
    background-color: #fafafa;
    // border-top: 1px solid #e0e0e0;
    // border-bottom: 1px solid #e0e0e0;
`;

export default EnhancedTableHead; 
