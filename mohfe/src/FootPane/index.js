import React, { Component } from 'react';

// Font
import 'typeface-roboto';

const styles = {
  footerwrap: {
    width: '100%',
    backgroundColor: 'white',
    // position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '2em 0',
    marginTop: '40px',
    marginTop: '20px'
  },
  ggfooter: {
    width: '80vw',
    margin: '0 auto',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerHeader: {
    marginTop: 0,
    fontWeight: 700,
  },
  footerUL: {
    listStyle: 'none',
    paddingLeft: '0',
  },
};

export default class FootPane extends Component {
  // constructor (props, context) {
  //   super(props, context);
  // }

  render () {
    return (
      <div style={styles.footerwrap} >
        <footer style={styles.ggfooter} >
          <div onClick={this.props.reset}><img onClick={this.resetdata}  src="/img/gg-logo.png" alt="Global Good"/></div>
          <div>
            &copy; 2018 globalgood All Rights Reserved.
          </div>
          {/* <div>
              <h3 style={styles.footerHeader}>Footer</h3>
              <ul style={styles.footerUL}>
                <li>Footer Item</li>
                <li>Footer Item</li>
                <li>Footer Item</li>
              </ul>
          </div>
          <div>
              <h3 style={styles.footerHeader}>Footer</h3>
              <ul style={styles.footerUL}>
                <li>Footer Item</li>
                <li>Footer Item</li>
                <li>Footer Item</li>
              </ul>
          </div>
          <div>
              <h3 style={styles.footerHeader}>Footer</h3>
              <ul style={styles.footerUL}>
                <li>Footer Item</li>
                <li>Footer Item</li>
                <li>Footer Item</li>
              </ul>
          </div>
          <div>
              <h3 style={styles.footerHeader}>Footer</h3>
              <ul style={styles.footerUL}>
                <li>Footer Item</li>
                <li>Footer Item</li>
                <li>Footer Item</li>
              </ul>
          </div> */}
        </footer>
      </div>
      )
    }
}
