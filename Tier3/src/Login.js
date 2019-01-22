import * as React from 'react';
// import {
//   BrowserRouter as Router,
//   Route,
//   Link,
//   Redirect,
//   withRouter
// } from 'react-router-dom';
import Auth from './Auth';
import styled from 'styled-components';
import TextField from 'material-ui-next/TextField';
import Card from 'material-ui-next/Card';

export default class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            username: 'demo',
            password: 'Change is good!'
        }
        this.login = this.login.bind(this);
    }

    authCallback = () => (bool) => {
        this.props.authenticate(bool);
    }

    login = () => {
        const {
            username,
            password
        } = this.state;

        Auth.authenticate(username, password, this.authCallback());
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    keyPress = (e) => {
        if (e.keyCode === 13) {
            Auth.authenticate(this.state.username, this.state.password, this.authCallback());
        }
    }

    render() {
        // const { from } = this.props.location.state || { from: { pathname: '/' } }
        // const { redirectToReferrer } = this.state

        // if (redirectToReferrer === true) {
        //   return <Redirect to={from} />
        // }

        return (
            <StyledCard>
                <Title>Please login to view the CCE Explorer</Title>
                <Form noValidate autoComplete="off">
                    <TextField
                        id="username"
                        label="Username"
                        margin="normal"
                        style={{margin: '10px'}}
                        value={this.state.username}
                        onChange={this.handleChange('username')}
                        onKeyDown={this.keyPress}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        margin="normal"
                        style={{margin: '10px'}}
                        autoComplete="current-password"
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        onKeyDown={this.keyPress}
                    />
                </Form>
                <Button onClick={this.login}>Log in</Button>
            </StyledCard>
        )
    }
}

const StyledCard = styled(Card)`
    max-width: 500px;
    padding: 30px;
    margin-top: 30px; 
    margin: 50px auto 0;
    display: initial;
`;
const Title = styled.p`
    text-align: center;
    margin-bottom: 2em;
`;
const Form = styled.form`
    display: flex;
    justify-content: center;
`;
const Button = styled.button`
    background-color: #7cd33b;
    padding: 8px 16px;
    margin: 0 auto;
    display: inherit;
    margin-top: 20px;
    color: white;
`;
