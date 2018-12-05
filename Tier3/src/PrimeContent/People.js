import React, { Component } from 'react';
// Font
import 'typeface-roboto';

const styles = {
  idBar: {
    backgroundColor: '#5c9aab',
    width: '100%',
    textAlign: 'center',
    paddingTop: '14px',
    paddingBottom: '24px',
    lineHeight: '30px',
    color: 'white',
  },
  idBarH: {
    fontWeight: '500',
    marginTop: '5px',
    marginBottom: '30px',
  },
};

export default class Moh extends Component {
  // constructor (props, context) {
  //   super(props, context);
  // }

  render () {
    return (
        <div>
          <div style={styles.idBar}>
            <h1 style={styles.idBarH}>People </h1>
          </div>
        </div>
      )
    }
}
