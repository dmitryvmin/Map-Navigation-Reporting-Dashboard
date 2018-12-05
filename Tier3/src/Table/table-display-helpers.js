import React from 'react';
import { dstyles } from './../Constants/deviceStyle';
import moment from 'moment-timezone';

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

const statusBg = (statusString) => {
  switch (statusString) {
    case "red":
      return {borderTop: '2px solid #e42527', borderBottom: '2px solid #e42527'};
    case "yellow":
      return {}
    case "green":
      return {}
    default:
      return {}
  }
}

const tempuratureShape = (temperature) => {
  const tempNum = parseFloat(temperature);
  if ( tempNum < 2.0 ) {
    return <div style={dstyles.coldtemp}>{temperature}&deg;</div>;
  }
  else if (tempNum > 8.0 ) {
    return <div style={dstyles.hottemp}>{temperature}&deg;</div>;
  }
  else if (tempNum > 6.0 && tempNum <= 8.0 ) {
    return <div style={dstyles.warntemp}>{temperature}&deg;</div>;
  }
  else if (tempNum >= 2.0 && tempNum < 4.0 ) {
    return <div style={dstyles.warntemp}>{temperature}&deg;</div>;
  }
  else {
    return <div style={dstyles.goodtemp}>{temperature}&deg;</div>;
  }
}

const timechecker48 = (rowtemp) => {
    if (rowtemp && rowtemp.timestamp) {
      let ping = moment(rowtemp.timestamp + "Z");
      let now = moment(Date.now());
      let diff = now.diff(ping, 'days');
      if ( diff >= 2 ) {
        return true;
      } else {
        return false;
      }
   } else {
     return false;
   }
}

const precisionRound = (number, precision) => {
  if (isNaN(number)) {
    return '-';
  }
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

const getLastPingHours = (sensor: any) => {
  let timestamp = (sensor.temperature && sensor.temperature.timestamp) ? sensor.temperature.timestamp : null;

  if (timestamp) {
    let now = moment();
    let before = moment.utc(timestamp);
    let diff = Math.abs(before.diff(now, 'hours'));
    // timestamp = moment(moment.utc(sensor.temperature.timestamp)).fromNow(true);

    return diff;
  } else {
    return null;
  }
}

const checkStatus = (sensor: any) => {
    // return 'red' if sensor has not reported in 26 hours otherwise return sensor.status
    let lastping = getLastPingHours(sensor);
    let holdover = precisionRound(sensor.holdover, 0);
    let temperature = Math.round(sensor.temperature.value); 
    if (lastping > 26) {
      return 'red';
    } else if (holdover < 2) {
      return 'yellow';
    } else if (holdover = 0) {
      return 'red';
    } else if (temperature < 2 || temperature > 8) {
      return 'red';
    } else {
      return sensor.status;
    }
  }

export { checkStatus,
         getLastPingHours,
         precisionRound, 
         statusDisplay, 
         statusBg, 
         tempuratureShape, 
         timechecker48 };

