import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment-timezone';
import 'typeface-roboto'; // Font
import {dstyles} from '../Constants/deviceStyle';

/**
 * Dialog content can be scrollable.
 */
export default class DeviceDetail extends Component {

  precisionRound = (number, precision) => {
    if (isNaN(number)) {
      return '-';
    }
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />,
    ];
    const device = this.props.device;
    const facility = device ? device.facility.name : "-";
    const id = device ? device.id : "-";
    const status = device ? device.status : "-";
    const brand = device ? device.manufacturer + ' ' + device.model : "-";
    const manufacturer = device ? device.manufacturer : "-";
    const manufacture_date = device ? device.manufacture_date : "-";
    const model = device ? device.model : "-";
    const country = device ? device.facility.country : "-";
    const district = device ? device.facility.district : "-";
    const holdover = device ? this.precisionRound(device.holdover, 1) : "?";
    const lastping = device ? moment(device.temperature.timestamp).format('MMMM Do, h:mm:ss a') : "-";
    const tempurature = device ? this.precisionRound(device.temperature.value, 2) : "?";
    const city = device ? device.facility.city : "-";
    const region = device ? device.facility.region : "-";
    const contact_name = (device && device.contact) ? device.contact.name : "-";
    const contact_email = (device && device.contact) ? device.contact.email : "-";
    const contact_phone = (device && device.contact) ? device.contact.phone : "-";
    let errors = null;
    if ( device && device.errors ) {
      errors = device.errors;
    }
    // Cliff's expectation of what errors looks like...

   //  "errors": [
   //     {
   //         "level": 2,
   //         "source": "the fridge",
   //         "id": "error-00103",
   //         "info": "The fridge is made of bacon"
   //     }
   // ]

    return (
      <div>

        <Dialog
          title={facility}
          actions={actions}
          modal={false}
          open={this.props.isOpen}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
          titleStyle={{backgroundColor: status, color: 'white'}}
        >
          <div>
            <p>{(errors) ? JSON.stringify(errors) : ''}</p>
            <br/>
            <div style={dstyles.thirdCard}>Last Tempurature Reading<br/>{tempurature}&deg; C</div>
            <div style={dstyles.thirdCard}>Last Ping<br/>{lastping}</div>
            <div style={dstyles.thirdCard}>Holdover days<br/>{holdover}</div>
            <br/>
            <h3>Device Information</h3>
            <Divider />
            <div style={dstyles.thirdCard}>Serial Number<br/>{id}</div>
            <div style={dstyles.thirdCard}>Status<br/>{status}</div>
            <div style={dstyles.thirdCard}>Manufacturer<br/>{manufacturer}</div>
            <div style={dstyles.thirdCard}>Model<br/>{model}</div>
            <div style={dstyles.thirdCard}>Manufactured Date<br/>{manufacture_date}</div>
            <br/>
            <h3>Location &amp; Contact Information</h3>
            <Divider />
            <div style={dstyles.thirdCard}>Country<br/>{country}</div>
            <div style={dstyles.thirdCard}>City<br/>{city}</div>
            <div style={dstyles.thirdCard}>District<br/>{district}</div>

            <div style={dstyles.thirdCard}>Facility Contact<br/>{contact_name}</div>
            <div style={dstyles.thirdCard}>Contact Phone<br/>{contact_phone}</div>
            <div style={dstyles.thirdCard}>Email<br/>{contact_email}</div>
          </div>
        </Dialog>
      </div>
    );
  }
}
