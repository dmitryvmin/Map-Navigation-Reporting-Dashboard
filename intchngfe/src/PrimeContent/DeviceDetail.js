import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// Font
import 'typeface-roboto';

/**
 * Dialog content can be scrollable.
 */
export default class DeviceDetail extends Component {

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.props.handleClose}
      />,
    ];
    const device = this.props.device;
    const facility = device ? device.facility.name : "-";
    const id = device ? device.id : "-";
    const status = device ? device.status : "-";
    const brand = device ? device.manufacturer + ' ' + device.model : '-';
    const country = device ? device.facility.country : "-";
    const district = device ? device.facility.district : "-";
    const holdover = device ? device.holdover : "?";
    const lastping = device ? device.temperature.timestamp : "-";
    const tempurature = device ? device.temperature.value : "?";

    return (
      <div>

        <Dialog
          title={facility}
          actions={actions}
          modal={false}
          open={this.props.isOpen}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <div>
            <h2>Facility: {facility}</h2>
            <p>ID: {id}</p>
            <p>Status: {status}</p>
            <p>Device: {brand}</p>
            <p>Country: {country}</p>
            <p>District: {district}</p>
            <p>Holdover: {holdover}</p>
            <p>Last Ping: {lastping}</p>
            <p>Tempurature: {tempurature}&deg;C</p>
          </div>
        </Dialog>
      </div>
    );
  }
}
