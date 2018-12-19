import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Person from '@material-ui/icons/PersonOutline';
// import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
// import MenuItem from '@material-ui/core/MenuItem';
// import IconButton from '@material-ui/core/IconButton';
import 'typeface-roboto';

const styles = {
    topHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '14px',
        paddingBottom: '14px',
        backgroundColor: 'white',
    },
    avatarFlag: {
        margin: '12px',
        objectFit: 'cover'
    },
    avatarUser: {
        margin: '12px',
    },
    titleArea: {
        fontWeight: '400',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center',
    },
    userArea: {
        fontSize: '18px',
    },
};

export default class TopHead extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            moh: 'Kenya'
        }
    }

    testclick(e, content) {
        e.preventDefault();
        console.log(content);
        this.props.contentChange(content);
    }

    render() {
        return (
            <header style={styles.topHeader}>
                <div style={styles.titleArea}>
                    <Avatar
                        src="/img/flag.jpg"
                        size={60}
                        style={styles.avatarFlag}
                        alt="flag icon"
                    />
                    Master Reporting Tool
                </div>
                <div style={styles.userArea}>
                    <Avatar style={styles.avatarUser}>
                        <Person />
                    </Avatar>

                    {/*<IconMenu*/}
                        {/*iconButtonElement={<IconButton style={styles.downArrow}><KeyboardArrowDown /></IconButton>}*/}
                        {/*anchorOrigin={{horizontal: 'right', vertical: 'top'}}*/}
                        {/*targetOrigin={{horizontal: 'right', vertical: 'top'}}*/}
                    {/*>*/}
                        {/*<MenuItem primaryText="Sign out" onClick={(e) => this.props.authenticate(false)}/>*/}
                    {/*</IconMenu>*/}
                </div>
            </header>
        )
    }
}
