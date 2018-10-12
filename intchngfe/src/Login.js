import * as React from 'react';
// import {
//   BrowserRouter as Router,
//   Route,
//   Link,
//   Redirect,
//   withRouter
// } from 'react-router-dom';
import GGConsts from './Constants';

import TextField from 'material-ui-next/TextField';
import Button from 'material-ui-next/Button';
import Card from 'material-ui-next/Card';

const Auth = {
  authenticate(username, password,cb) {
    const creds: any = `${username}:${password}`;
    const header: any = {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + btoa(creds)
    };
    fetch(`${GGConsts.API}:${GGConsts.ADMIN_PORT}/account`, { headers: new Headers (header)})
        .then(function(response) {
      
      if (response.status === 200) {
        setTimeout(() => {cb(true)}, 100)
      } else {
        console.warn('Wrong login creds ', creds);
      }

    }).catch(function(err) {
      console.warn('Auth error', err)
    });
  },

  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

export default class Login extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      username: '',
      password: ''
    }
    this.login = this.login.bind(this);
  }

  authCallback = () => (bool) => {
    this.props.authenticate(bool);
  }

  login = () => {
    Auth.authenticate(this.state.username, this.state.password, this.authCallback());
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

   keyPress = (e) => {
      if(e.keyCode == 13){
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
      <Card style={{maxWidth: '500px', padding: '30px', marginTop: '30px', margin: '50px auto 0'}}>
          <p style={{textAlign: 'center', marginBottom: '2em'}}>Please login to view the Reporting Tool</p>
          <form style={{display: 'flex',  justifyContent: 'center'}} noValidate autoComplete="off">
        <TextField
          id="username"
          label="Username"
          margin="normal"
          style={{margin: '10px'}}
          value={this.state.username}
          onChange={this.handleChange('username')}
          onKeyDown={this.keyPress}
          margin="normal"/>
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
          margin="normal" />
      </form>
      <button style={{backgroundColor: '#7cd33b',padding: '8px 16px', margin: '0 auto', display: 'inherit', marginTop: '20px', color: 'white'}} onClick={this.login}>Log in</button>
      </Card>
    )
  }
}