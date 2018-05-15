import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment-timezone';
import 'typeface-roboto'; // Font
import {dstyles} from '../Constants/deviceStyle';

const statusDisplay = (statusString) => {
  switch (statusString) {
    case "red":
      return <div style={dstyles.reddot} />
    case "yellow":
      return <div style={dstyles.yellowdot} />
    case "green":
      return <div style={dstyles.greendot} />
    default:
      return <div style={dstyles.cleardot} />
  }
}

const modalHeader = (statusString, modelbrand) => {
  return <div style={{backgroundColor: '#878787'}}>{statusDisplay(statusString)} &nbsp; <div style={dstyles.inlineBlock}>{modelbrand}</div></div>
}

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
    //const brand = device ? device.manufacturer + ' ' + device.model : "-";
    const manufacturer = device ? device.manufacturer : "-";
    const manufacture_date = device ? device.manufacture_date : "-";
    const model = device ? device.model : "-";
    const country = device ? device.facility.country : "-";
    const district = device ? device.facility.district : "-";
    const holdover = device ? this.precisionRound(device.holdover, 1) : "?";
    const lastping = device ? moment(device.temperature.timestamp).format('MMMM Do, h:mm:ss a') : "-";
    const lastPingAgo = device ? moment(device.temperature.timestamp + "Z").fromNow() : "-";
    const tempurature = device ? this.precisionRound(device.temperature.value, 2) : "?";
    let city = device ? device.facility.city : "";
    if ( city === null || city === "undefined" || city === undefined ) { city = " "; }
    const state_district = device ? `${city} ${device.facility.district}` : "-";
    //const region = device ? device.facility.region : "-";
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
          title={modalHeader(status, manufacturer + " " + model)}
          actions={actions}
          modal={false}
          open={this.props.isOpen}
          onRequestClose={this.props.handleClose}
          style={dstyles.ggModal}
          overlayStyle={dstyles.ggOverlayBg}
          autoScrollBodyContent={true}
          titleStyle={{backgroundColor: '#9a9a9a', color: 'white'}}
        >
          <div style={dstyles.modalBlock}>
            {(errors) ? <p>{JSON.stringify(errors)}</p> : ''}
            <br/>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Last Tempurature Reading</span><br/>{tempurature}&deg; C</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Last Ping</span><br/>{lastping}<br/><em>({lastPingAgo})</em></div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Holdover days</span><br/>{holdover}</div>
            <br/>
            <h3>Device Information</h3>
            <Divider />
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Serial Number</span><br/>{id}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Manufacturer</span><br/>{manufacturer}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Model</span><br/>{model}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Manufactured Date</span><br/>{manufacture_date}</div>
            <br/>
            <h3>Location &amp; Contact Information</h3>
            <Divider />
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Facility</span><br/>{facility}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Country</span><br/>{country}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>State/District</span><br/>{state_district}</div>

            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Facility Contact</span><br/>{contact_name}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Contact Phone</span><br/>{contact_phone}</div>
            <div style={dstyles.thirdCard}><span style={dstyles.detailTitleHead}>Email</span><br/>{contact_email}</div>
          </div>
        </Dialog>
      </div>
    );
  }
}
