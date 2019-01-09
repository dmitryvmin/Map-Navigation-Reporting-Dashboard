import React, {Component} from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
// import Tooltip from '@material-ui/core/Tooltip';
// import {Tooltip as Tippy} from 'react-tippy';
// import ProgressBar from "virtual-progress-bar";
import {
    // navigationMap,
    getNMapChild
} from './../Utils';

const times = x => f => {
    if (x > 0) {
      f(x)
      times (x - 1) (f)
    }
}
const redBox = {display:'inline-block',width:2,height:2,margin: '1px 0 1px 2px',background:'#d00'};
const greenBox = {display:'inline-block',width:2,height:2,margin: '1px 0 1px 2px',background:'#0d0'};

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            boolLeds: [],
        };
    }

    componentDidMount() {
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.nav_hover !== prevState.nav_hover) {
            return {nav_hover: nextProps.nav_hover};
        }
        else return null;
    }

    drawBoolLEDs() {
        const xo = [];
        times(30) ( (x) => ((_.random(0, 1)) ? xo.push(<div key={`box-${x}`} style={redBox}></div>) : xo.push(<div key={`box-${x}`} style={greenBox}></div>)));
        this.state.boolLeds.push( <span style={{display: 'inline-block', margin: '0 0 0 7px', width: '42px', height: '20px', lineHeight: '2px'}}>{xo}</span> );
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            nav_tier,
            data
        } = this.props;

        const {
            nav_hover,
            selected
        } = this.state;

        const childNav = getNMapChild(nav_tier, 'tier');

        if (data[childNav.map] === nav_hover && nav_hover.value && !selected) {
            this.setState({selected: true});

        } else if (data[childNav.map] !== nav_hover && nav_hover.value && selected) {
            this.setState({selected: false});
        }
    }

    render() {
        const {
            data,
            handleRowClick,
            handleRowHover,
            columns,
        } = this.props;

        if (this.state.boolLeds.length === 0) {
            this.props.columns.map((c, idx) => {
                let id = c.id;
                let value = this.props.data[id];  
                if (!isNaN(value)) { this.drawBoolLEDs(); }
                return 0;
            });
        }

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

                {columns.map((c, idx) => {
                    let id = c.id;
                    let value = data[id];                    

                    return (
                        <TableCell
                            key={`cell-${id}-${value}`}
                            align="center"
                        >
                            {/*<Tooltip title={id} placement="bottom-start" enterDelay={300}>*/}
                            <StyledCell>{value}{(!isNaN(value)) ? this.state.boolLeds[idx] : ''}</StyledCell>
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

const StyledCell = styled.div`
    text-align: center; 
`;

export default connect(mapStateToProps, null)(Row);
