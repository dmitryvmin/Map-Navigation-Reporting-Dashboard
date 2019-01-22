import React from 'react';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
// import TablePagination from '@material-ui/core/TablePagination';
import GGConsts from '../Constants';
import EnhancedTableHead from './EnhancedTableHead';
import {connect} from "react-redux";
import Row from './Row';
// import TableCell from '@material-ui/core/TableCell';
// import TableRow from '@material-ui/core/TableRow';
// import ManualTableRow from './ManualTableRow';
import {
    // navigationMap,
    // getNMap,
    getNMapChild,
    // getData
} from './../Utils';
// import {navHovered} from './../Store/Actions';

import {
    // desc,
    stableSort,
    getSorting
} from './table-sort-helpers';

// import {
//     checkStatus,
//     getLastPingHours,
//     precisionRound,
//     statusDisplay,
//     statusBg,
//     tempuratureShape,
//     timechecker48
// } from './table-display-helpers';

class RTTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'desc',
            orderBy: this.props.metric_selected,
            errors: [],
            page: 0,
            rowsPerPage: 50,
            isDetailOpen: false,
            selectedDevice: null,
            hover: false,
        }

        this.intervalId = null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            hover: nextProps.nav_hover.value
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //
    //     let shouldUpdate = (
    //         (!this.state.hover && this.state.hover === nextProps.nav_hover.value) ||
    //         (this.state.hover && this.state.hover !== nextProps.nav_hover.value)
    //     );
    //
    //     return shouldUpdate;
    // }

    mapPropsToTableColumns = (data) => {
        const device_info = [];

        data.forEach(d => {
            const obj = {}
            device_info.push(obj);
        });

        return device_info;
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    getNewNav = location => {
        const {nav_tier} = this.props;
        const childNM = getNMapChild(nav_tier, 'tier')
        const type = childNM.type;
        const value = location[childNM.map];

        return ({type, value});
    }

    handleRowHover = location => e => {
        const {
            nav_tier,
            navHovered
        } = this.props;

        if (nav_tier !== GGConsts.FACILITY_LEVEL) {
            const NM = this.getNewNav(location);
            navHovered({value: NM.value});
        }
    }

    handleRowClick = location => e => {
        const {nav_tier} = this.props;

        if (nav_tier === GGConsts.LGA_LEVEL) {
            this.props.updateNav('facility_selected', location.facilities);
        }
        else if (nav_tier === GGConsts.COUNTRY_LEVEL || nav_tier === GGConsts.STATE_LEVEL) {
            const NM = this.getNewNav(location);
            this.props.updateNav(NM.type, NM.value);
        }
        else if (nav_tier === GGConsts.FACILITY_LEVEL) {
            console.log(`%c bottom tier reached`, GGConsts.CONSOLE_WARN);
        }
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    getHover = (cell) => {
        const {nav_tier} = this.props;
        const {hover} = this.state;

        if (nav_tier !== GGConsts.FACILITY_LEVEL) {
            const childNM = getNMapChild(nav_tier, 'tier');
            const selected = cell[childNM.map] === hover;

            return selected;

        } else {
            return null;
        }
    }

    render() {
        const {
            nav_tier,
            display_data,
        } = this.props;

        const {
            columns,
            cells,
        } = display_data || null;

        if (!nav_tier || !display_data || !columns || !cells) {
            return null;
        }

        const {
            order,
            orderBy,
            rowsPerPage,
            page,
        } = this.state;

        return (
            <Container>
                <TableWrapper>
                    <Table
                        className="table"
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            columns={columns}
                            tableCols={columns}
                            numSelected={0}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={cells.length}
                        />
                        <TableBody>
                            {stableSort(cells, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((c, i) =>
                                    <Row
                                        selected={this.getHover(c)}
                                        order={order}
                                        orderBy={orderBy}
                                        tier={nav_tier}
                                        data={c}
                                        key={`cell-${c}-${i}`}
                                        columns={columns}
                                        handleRowHover={this.handleRowHover}
                                        handleRowClick={this.handleRowClick}
                                    />
                                )}
                        </TableBody>
                    </Table>
                </TableWrapper>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        nav_tier: state.navigationReducer.nav_tier,
        nav_hover: state.navigationReducer.nav_hover,
        country_selected: state.navigationReducer.country_selected,
        state_selected: state.navigationReducer.state_selected,
        lga_selected: state.navigationReducer.lga_selected,
        facility_selected: state.navigationReducer.facility_selected,
        navigation: state.navigationReducer.navigation,
        display_data: state.displayReducer.display_data,
        metric_selected: state.metricReducer.metric_selected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateNav: (type, val) => dispatch({type: GGConsts.UPDATE_NAV, [type]: val}),
        navHovered: (nav_hover) => dispatch({type: GGConsts.NAV_HOVER, nav_hover}),
    };
};

const Container = styled.div`
    background-color: white;
    overflow-y: scroll;
`;
const TableWrapper = styled.div`
    // overflow-x: auto;
`;

export default connect(mapStateToProps, mapDispatchToProps)(RTTable);
