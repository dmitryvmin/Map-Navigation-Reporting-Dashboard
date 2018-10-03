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

const ManualTableRow = props => {
	const { d, handleRowClick, isSelected } = props;

	return (
		<TableRow hover
	              onClick={event => handleRowClick(event, d)}
	              role="checkbox"
	              tabIndex={-1}
	              key={d.id}
              	  selected={isSelected}
  				  aria-checked={isSelected}>

	      <TableCell style={dstyles.statusColumn}>
	        {(d.status === 'red') 
	         ? <Tippy position="top" 
	                  interactive 
	                  trigger="mouseenter" 
	                  theme="light" 
	                  distance="20" 
	                  arrow="true" 
	                  html={(
	                    <div>
	                      <div className="error-message">
	                        <span>Alarm</span>
	                      </div>
	                      <span>{d.errors}</span>
	                    </div>
	                  )}>
	              {statusDisplay(d.status)}
	            </Tippy> 
	         : statusDisplay(d.status)}
	      </TableCell>
	      <TableCell style={dstyles.tempColumn}>
	        <Tooltip title={d.lasttemp} placement="bottom-center" enterDelay={300}>
	          <div className="progressBar">
	            <div>
	              {ProgressBar.render(React.createElement, {
	                  containerColor: "#ededed",
	                  direction: "row",
	                  meterColor: d.lasttemp < 2 || d.lasttemp > 8 ? "red" : "green",
	                  percent: (Math.min(Math.max(d.lasttemp, 0), 10) / 10.0) * 100
	                })
	              }
	            </div>
	            <span>{d.lasttemp}&deg;</span>
	        </div>
	        </Tooltip>
	      </TableCell>
	      <TableCell style={dstyles.deviceColumn}>
	        <Tooltip title={d.brand} placement="bottom-start" enterDelay={300}>
	          <div>{d.brand}</div>
	        </Tooltip>
	      </TableCell>
	      <TableCell style={dstyles.facilityColumn}>
	        <Tooltip title={d.facility} placement="bottom-start" enterDelay={300}>
	          <div>{d.facility}</div>
	        </Tooltip>
	      </TableCell>
	      <TableCell style={dstyles.lastpingColumn}>
	        <Tooltip title={d.lastping} placement="bottom-start" enterDelay={300}>
	          <div>{d.lastping}</div>
	        </Tooltip>
	      </TableCell>
	    </TableRow>
    )
}

export default ManualTableRow; 
