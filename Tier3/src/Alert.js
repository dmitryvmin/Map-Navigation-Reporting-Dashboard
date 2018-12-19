import * as React from 'react';
// import Avatar from 'material-ui/Avatar';
// import Close from 'material-ui/svg-icons/navigation/close';
// import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import AppContext from './Services/Context';
import {connect} from "react-redux";

class Alert extends React.Component {
    constructor(props) {
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
        this.setState({dialogOpen: true})
    }

    handleClose() {
        this.setState({dialogOpen: false});
    };

    handleClick() {
        this.setState({showAlert: false});
    }

    render() {
        if (!this.state.showAlert) {
            return null;
        }
        const {errors} = this.props;
        const errorKeys = (errors && Object.keys(errors)) || null;
        const errorsNum = errorKeys ? errorKeys.length : null;

        const actions = [
            <button label="Cancel"
                    primary={true}
                    onClick={this.handleClose}
            />,
            <button label="Submit"
                    primary={true}
                    onClick={this.handleClose}
            />
        ];

        return (
            <div style={{backgroundColor: "#C50018"}}>
                <div style={{width: "80vw", marginLeft: "auto", marginRight: "auto"}}>
                    <div style={{float: 'left', display: 'flex', alignItems: 'center', height: '48px'}}>
                        {/*<Avatar*/}
                            {/*color={"red"}*/}
                            {/*backgroundColor={"white"}*/}
                            {/*size={30}>*/}
                            {/*{errorsNum}*/}
                        {/*</Avatar>*/}
                        <span style={{color: 'white', marginLeft: '10px'}}>Devices have errors</span>
                    </div>
                    <div style={{float: 'right'}}>
                        {/*<button style={{color: "white", float: 'left', height: '48px'}}*/}
                                {/*label="View Errors"*/}
                                {/*onClick={this.handleOpen}/>*/}
                        {/*<IconButton>*/}
                            {/*<Close color={"white"}*/}
                                   {/*onClick={this.handleClick}/>*/}
                        {/*</IconButton>*/}
                        {/*<Dialog title={`${errorsNum} Devices reporting errors`}*/}
                                {/*actions={actions}*/}
                                {/*modal={false}*/}
                                {/*open={this.state.dialogOpen}*/}
                                {/*onRequestClose={this.handleClose}>*/}
                            {/*{errorKeys && errorKeys.map((e, i) => <p key={`alert-${i}`}*/}
                                                                               {/*style={{color: '#9e9e9e'}}>Sensor #{e}*/}
                                {/*- {errors[e]}</p>)}*/}
                        {/*</Dialog>*/}
                    </div>
                    <div style={{clear: 'both'}}></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    errors: state.errors
});

export default connect(mapStateToProps)(Alert);
