import React, {Component} from 'react';
import {connect} from "react-redux";
import GGConsts from '../Constants';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class MfcDialog extends Component {

    toggleMfc = (mfc) => () => {
        this.props.toggleMfc(mfc);
    }

    render() {

        const {
            toggle,
            open,
            mfc_selected,
            mfc_map,
        } = this.props;

        return (
            <Dialog
                open={open}
                onClose={toggle}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Select Manufacturers"}</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {mfc_map.map(m => {
                            const checked = mfc_selected.includes(m);
                            return (
                                <FormControlLabel
                                    key={`mfc-select-${m}`}
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={this.toggleMfc(m)}
                                            value={m}
                                        />
                                    }
                                    label={m}
                                />
                            )
                        })}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={toggle}
                        color="primary"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        mfc_map: state.dataReducer.mfc_map,
        mfc_selected: state.mfcReducer.mfc_selected,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleMfc: (mfc) => dispatch({type: GGConsts.MFC_UPDATING, mfc}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MfcDialog);
