import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import Close from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';


export default class Alert extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            showAlert: true,
            dialogOpen: false
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleOpen() {
        this.setState({ dialogOpen: true })
    }

    handleClose() {
        this.setState({ dialogOpen: false });
    };

    handleClick() {
        this.setState({ showAlert: false });
    }

    render() {
        if(!this.state.showAlert) {
            return null;
        }

        const actions = [
            <FlatButton label="Cancel"
                        primary={true}
                        onClick={this.handleClose}
            />,
            <FlatButton label="Submit"
                        primary={true}
                        keyboardFocused={true}
                        onClick={this.handleClose}
            />
        ];

        return (
            <div style={{backgroundColor: "#C50018"}}>
                <div style={{width: "80vw", marginLeft: "auto", marginRight: "auto"}}>
                    <div style={{float:'left', display: 'flex', alignItems: 'center', height: '48px'}}>
                        <Avatar
                            color={"red"}
                            backgroundColor={"white"}
                            size={30}>
                            3
                        </Avatar>
                        <span style={{color:'white', marginLeft:'10px'}}>Devices have errors</span>
                    </div>
                    <div style={{float: 'right'}}>
                        <FlatButton style={{color:"white", float: 'left', height: '48px'}}
                                    label="View Errors"
                                    onClick={this.handleOpen}/>
                        <IconButton>
                            <Close color={"white"}
                                   onClick={this.handleClick} />
                        </IconButton>
                        <Dialog title="3 Devices reporting errors"
                                actions={actions}
                                modal={false}
                                open={this.state.dialogOpen}
                                onRequestClose={this.handleClose}>
                            <a>View Device 1 Error Info..</a><br /><br />
                            <a>View Device 2 Error Info..</a><br /><br />
                            <a>View Device 3 Error Info..</a><br /><br />
                        </Dialog>
                    </div>
                    <div style={{clear: 'both'}}></div>
                </div>
            </div>
        );
    }
}