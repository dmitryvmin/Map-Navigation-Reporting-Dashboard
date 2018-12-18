import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import {Tooltip as Tippy} from 'react-tippy';
import ProgressBar from "virtual-progress-bar";
import { navigationMap } from './../Utils';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.nav_hover !== prevState.nav_hover){
            return { nav_hover: nextProps.nav_hover};
        }
        else return null;
    }

    componentDidUpdate(prevProps, prevState) {
        const { nav_tier, data } = this.props;
        const curMap = _.first(navigationMap.filter(f => f.tier === nav_tier));
        const newMap = _.first(navigationMap.filter(f => f.index === curMap.index + 1));

        const { nav_hover, selected } = this.state;

        if ( data[newMap.map] === nav_hover && !selected ) {

            this.setState({ selected: true });

        } else if ( data[newMap.map] !== nav_hover && selected) {
            this.setState({ selected: false });
        }
    }

    render() {
        const {
            data,
            handleRowClick,
            handleRowHover,
            columns,
            hover,
        } = this.props;

        if (!data || !columns.length) {
            return null;
        }

        const { selected } = this.state;

        return (
            <TableRow onClick={handleRowClick(data)}
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
                        <TableCell key={`cell-${id}-${value}`}>
                            {/*<Tooltip title={id} placement="bottom-start" enterDelay={300}>*/}
                            <div>{value}</div>
                            {/*</Tooltip>*/}
                        </TableCell>
                    )
                })}

            </TableRow>
        )
    }
}

const mapStateToProps = state => {
    return {
        nav_tier: state.navigationReducer.nav_tier,
        nav_hover: state.navigationReducer.nav_hover,
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         setMapViewport: (map_viewport) => dispatch(setMapViewport(map_viewport)),
//         navigateTo: (navState) => dispatch({ type: GGConsts.UPDATE_NAV, navState }),
//         mapClicked: (prop) => dispatch(mapClicked(prop)),
//     }
// }

export default connect(mapStateToProps, null)(Row);
