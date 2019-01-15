import React, {Component} from 'react';
import {connect} from "react-redux";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class MfcDialog extends Component {
    // const [open, setOpen] = React.useState(false);
    //
    // function handleClickOpen() {
    //     setOpen(true);
    // }
    //
    // function handleClose() {
    //     setOpen(false);
    // }

    render() {

        const {
            toggle,
            open
        } = this.props;

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={toggle}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Select Manufacturers"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Mfc list...
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={toggle} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default MfcDialog;
