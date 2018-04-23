import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
//import FlatButton from 'material-ui/FlatButton';
import 'typeface-roboto'; // Font

const styles = {
  topHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '14px',
    paddingBottom: '14px',
    lineHeight: '64px',
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: 'white',
  },
  avatarFlag: {
    margin: '12px',
    lineHeight: '64px',
    verticalAlign: 'middle',
  },
  avatarUser: {
    margin: '12px',
    verticalAlign: 'middle',
  },
  titleArea: {
    fontWeight: '400',
    verticalAlign: 'middle',
    fontSize: '22px',
  },
  topNavArea: {
    lineHeight: '80px',
    verticalAlign: 'middle',
  },
  topNavButton: {
    textTransform: 'none',
  },
  userArea: {
    marginRight: '48px',
    lineHeight: '80px',
    verticalAlign: 'middle',
    fontSize: '18px',
  },
  downArrow: {
    verticalAlign: 'middle',
  },
  tabMod: {
    marginTop: '-48px',
  },
  footerwrap: {
    width: '100%',
    backgroundColor: 'white',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '2em 0',
  },
  ggfooter: {
    width: '80vw',
    margin: '0 auto',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  footerHeader: {
    marginTop: 0,
    fontWeight: 700,
  },
  footerUL: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  deviceTableHeader: {
    margin: "16px 0 16px 0",
  },
  logo: {
    height: "100%"
  },
  logoContainer: {
    height: "40px",
    margin: "20px 40px",
    display: "flex",
    alignItems: "center"
  }
};

export default class TopHead extends Component {
  constructor (props, context) {
    super(props, context);
    // Default text
    this.state = {
      moh: 'Kenya',
    }
  }

  testclick(e, content) {
    e.preventDefault();
    console.log(content);
    this.props.contentChange(content);
  }

  render () {
    return (
        <header style={styles.topHeader}>
          <div style={styles.titleArea} >
            <div style={styles.logoContainer}>
              <img style={styles.logo} src="/img/aucma_logo.jpg" alt="logo icon" />
            </div>
          </div>
           <div style={styles.topNavArea}>
            {/*<FlatButton label="People" style={styles.topNavButton} onClick={(e) => this.testclick(e, "people")} />
            <FlatButton label="Int ORGS" style={styles.topNavButton} onClick={(e) => this.testclick(e, "intorgs")} />
            <FlatButton label="Admin Tools" style={styles.topNavButton} onClick={(e) => this.testclick(e, "admin")} />*/}
          </div>
          <div style={styles.userArea} >
            <Avatar
              icon={<SocialPersonOutline />}
              style={styles.avatarUser}
            />
            Jon D.
            <IconMenu
              iconButtonElement={<IconButton style={styles.downArrow}><KeyboardArrowDown /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Change MOH" onClick={(e) => this.testclick(e, "changemoh")} />
              <MenuItem primaryText="Change User" onClick={(e) => this.testclick(e, "changeuser")} />
              <MenuItem primaryText="Settings" onClick={(e) => this.testclick(e, "settings")} />
              <MenuItem primaryText="Help" onClick={(e) => this.testclick(e, "help")} />
              <MenuItem primaryText="Sign out" onClick={(e) => this.testclick(e, "signout")} />
            </IconMenu>
          </div>
        </header>
      )
    }
}
