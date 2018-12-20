import React from 'react';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import GGConsts from '../Constants';
import EnhancedTableHead from './EnhancedTableHead';
import {connect} from "react-redux";
import Row from './Row';
import ManualTableRow from './ManualTableRow';
import {
    navigationMap,
    getNMap,
    getNMapChild,
    getData
} from './../Utils';
import _ from 'lodash';
import {navHovered} from './../Store/Actions';

import {
    desc,
    stableSort,
    getSorting
} from './table-sort-helpers';

import {
    checkStatus,
    getLastPingHours,
    precisionRound,
    statusDisplay,
    statusBg,
    tempuratureShape,
    timechecker48
} from './table-display-helpers';

const columns = [
    {id: 'status', numeric: false, disablePadding: true, label: 'Status'},
    {id: 'holdover', numeric: true, disablePadding: false, label: 'Holdover Days'},
    {id: 'lasttemp', numeric: true, disablePadding: false, label: 'Last Reading Temp (C)'},
    {id: 'brand', numeric: false, disablePadding: false, label: 'Brand/Model'},
    {id: 'facility', numeric: false, disablePadding: false, label: 'Facility'},
    {id: 'lastping', numeric: true, disablePadding: false, label: 'Last Ping'},
];

// TODO: introduce selectors for derived state
const getColumns = navTier => {
    let columns = [

    ];

    switch (navTier) {
        case GGConsts.COUNTRY_LEVEL:
            columns.push({id: 'states', numeric: false, disablePadding: false, label: 'States'});
            break;
        case GGConsts.STATE_LEVEL:
            columns.push({id: 'lgas', numeric: false, disablePadding: false, label: 'LGAs'});
            break;
        case GGConsts.LGA_LEVEL:
            columns.push({id: 'facilities', numeric: false, disablePadding: false, label: 'Facilities'});
            break;
        case GGConsts.FACILITY_LEVEL:
            columns.push({id: 'devices', numeric: false, disablePadding: false, label: 'Devices'});
            break;
    }

    columns.push({id: 'alarms', numeric: true, disablePadding: false, label: 'Alarms'});

    return columns;
}

class RTTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'states',
            errors: [],
            page: 0,
            rowsPerPage: 50,
            isDetailOpen: false,
            selectedDevice: null
        }

        this.intervalId = null;
    }

    // async componentDidMount() {
    //     this.loadData();
    //     if ( !this.state.selectedDevice ) {
    //         this.intervalId = setInterval( this.loadData, 10000 );
    //     }
    // }
    //
    // componentWillUnmount() {
    //     clearInterval(this.intervalId);
    //     this.selectedDevice = null;
    // }
    //
    // loadData = async () => {
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
        const childNav = getNMapChild(nav_tier)
        const type = childNav.type;
        const value = location[childNav.map];

        return ({type, value});
    }

    handleRowHover = location => e => {
        const newNav = this.getNewNav(location);
        this.props.navHovered({value: newNav.value});
    }

    handleRowClick = location => e => {
        const newNav = this.getNewNav(location);
        this.props.updateNav(newNav.type, newNav.value);
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    render() {
        const {
            nav_tier,
            navigation
        } = this.props;

        if (!nav_tier) {
            return null;
        }

        const {
            order,
            orderBy,
            rowsPerPage,
            page,
        } = this.state;


        const columns = getColumns(nav_tier);
        const data = getData(nav_tier, navigation);

        if (!data) {
            return null;
        }
        // const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Container>
                <TableWrapper>
                    <Table className="table"
                           aria-labelledby="tableTitle">
                        <EnhancedTableHead columns={columns}
                                           tableCols={columns}
                                           numSelected={0}
                                           order={order}
                                           orderBy={orderBy}
                                           onRequestSort={this.handleRequestSort}
                                           rowCount={data.length}/>
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((d, i) =>
                                    <Row data={d}
                                         key={`${d}-${i}`}
                                         columns={columns}
                                         handleRowHover={this.handleRowHover}
                                         handleRowClick={this.handleRowClick}/>
                                )}
                            {/*{emptyRows > 0 && (*/}
                                {/*<TableRow style={{height: 49 * emptyRows}}>*/}
                                    {/*<TableCell colSpan={6}/>*/}
                                {/*</TableRow>*/}
                            {/*)}*/}
                        </TableBody>
                    </Table>
                </TableWrapper>
                {/*<TablePagination component="div"*/}
                {/*rowsPerPageOptions={[8, 20, 50]}*/}
                {/*count={data.length}*/}
                {/*rowsPerPage={rowsPerPage}*/}
                {/*page={page}*/}
                {/*backIconButtonProps={{*/}
                {/*'aria-label': 'Previous Page',*/}
                {/*}}*/}
                {/*nextIconButtonProps={{*/}
                {/*'aria-label': 'Next Page',*/}
                {/*}}*/}
                {/*onChangePage={this.handleChangePage}*/}
                {/*onChangeRowsPerPage={this.handleChangeRowsPerPage}/>*/}
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        nav_tier: state.navigationReducer.nav_tier,
        country_selected: state.navigationReducer.country_selected,
        state_selected: state.navigationReducer.state_selected,
        lga_selected: state.navigationReducer.lga_selected,
        facility_selected: state.navigationReducer.facility_selected,
        navigation: state.navigationReducer.navigation,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateNav: (type, val) => dispatch({type: GGConsts.UPDATE_NAV, [type]: val}),
        navHovered: (nav_hover) => dispatch({type: GGConsts.NAV_HOVER, nav_hover}),
    };
};

const Container = styled.div`
    margin: 0px auto;
    background-color: white;
    height: 50vh;
    overflow-y: scroll;
`;
const TableWrapper = styled.div`
    overflow-x: auto;
`;

export default connect(mapStateToProps, mapDispatchToProps)(RTTable);
