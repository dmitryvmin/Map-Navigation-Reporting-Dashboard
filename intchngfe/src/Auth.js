import * as React from 'react';
import GGConsts from './Constants';

class Auth {
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
  }

  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

export default Auth; 
