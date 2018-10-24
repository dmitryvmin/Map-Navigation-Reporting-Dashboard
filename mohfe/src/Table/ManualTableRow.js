import React from 'react';
import { dstyles } from './../Constants/deviceStyle';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { statusDisplay } from './table-display-helpers';
import Tooltip from '@material-ui/core/Tooltip';
import { Tooltip as Tippy } from 'react-tippy';
import ProgressBar from "virtual-progress-bar";
import styled from 'styled-components';

const Box = styled.div`
	min-width: 5px;
	min-height: 5px;
	border: solid 1px white;
	background-color: ${props => props.color}; 
	flex: 0 1 calc(100%/30);
`;
const BoxesContainer = styled.div`
	display: flex;
	background-color: #ededed;
    padding: 5px;
    border-radius: 5px;
`;

const squaresSparkline = arr => {
	const squares = [];
	arr.map((temp, i) => {
		let color;
		if (temp > 8 || (temp < 2 && temp !== null)) {
			color = 'red';
		} else if (temp >= 2 || (temp <= 8 && temp !== null)) {
			color = 'green';
		} else {
			color = 'white';
		}
		let label = (i === 29) ? 'yesterday' : `${30 - i} days ago`
		squares.push(
			<Tooltip title={temp ? `Device temperature ${label}: ${temp} °C` : 'Device temperature not available'} placement="bottom-start" enterDelay={300}>
				<Box key={`box-${i}`} color={color} />
			</Tooltip>
		);
    })
	return <BoxesContainer>{squares}</BoxesContainer>
}

const ManualTableRow = props => {
	const { d,
			handleRowClick,
			isSelected
	} = props;

	return (
		<TableRow hover
	              onClick={event => handleRowClick(event, d)}
	              role="checkbox"
	              tabIndex={-1}
	              key={d.id}
              	  selected={isSelected}
  				  aria-checked={isSelected}>

	      {/*<TableCell style={styles.cell}>*/}
	        {/*{(d.status === 'red') */}
	         {/*? <Tippy position="top" */}
	                  {/*interactive */}
	                  {/*trigger="mouseenter" */}
	                  {/*theme="light" */}
	                  {/*distance="20" */}
	                  {/*arrow="true" */}
	                  {/*html={(*/}
	                    {/*<div>*/}
	                      {/*<div className="error-message">*/}
	                        {/*<span>Alarm</span>*/}
	                      {/*</div>*/}
	                      {/*<span>{d.errors}</span>*/}
	                    {/*</div>*/}
	                  {/*)}>*/}
	              {/*{statusDisplay(d.status)}*/}
	            {/*</Tippy> */}
	         {/*: statusDisplay(d.status)}*/}
	      {/*</TableCell>*/}
          <TableCell style={styles.cell}>
	        <Tooltip title={d.errorcount} placement="bottom-start" enterDelay={300}>
	          <div>{d.errorcount}</div>
	        </Tooltip>
	      </TableCell>
	      <TableCell style={styles.cell}>
		    <div>{squaresSparkline(d.lasttemp)}</div>
	      </TableCell>
	      <TableCell style={styles.cell}>
	        <Tooltip title={d.brand} placement="bottom-start" enterDelay={300}>
	          <div>{d.brand}</div>
	        </Tooltip>
	      </TableCell>
	      <TableCell style={styles.cell}>
	        <Tooltip title={d.facility} placement="bottom-start" enterDelay={300}>
	          <div>{d.facility}</div>
	        </Tooltip>
	      </TableCell>
	      <TableCell style={styles.cell}>
	        <Tooltip title={d.lastping} placement="bottom-start" enterDelay={300}>
	          <div>{d.lastping}</div>
	        </Tooltip>
	      </TableCell>
          <TableCell style={styles.cell}>
            <Tooltip title={d.uploaddate} placement="bottom-start" enterDelay={300}>
              <div>{d.uploaddate}</div>
            </Tooltip>
	      </TableCell>
	    </TableRow>
    )
}

const styles = {
	cell: {
		textAlign: 'center'
	}
}

export default ManualTableRow; 
