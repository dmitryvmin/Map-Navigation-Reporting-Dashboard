import React from 'react';
// import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import styled from 'styled-components';
// import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {   // onSelectAllClick,
            order,
            orderBy,
            // numSelected,
            // rowCount,
            tableCols
        } = this.props;

        return (
            <TableHead>
                <TableRow>
                    {tableCols.map(col => {
                        return (
                            <StyledTableCell
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
                                    {col.label}
                                </TableSortLabel>
                            </StyledTableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

const StyledTableCell = styled(TableCell)`
    background-color: #fff;
    position: sticky;
    top: 0;
    text-align: center !important; 
`;
// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.string.isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

export default EnhancedTableHead; 
