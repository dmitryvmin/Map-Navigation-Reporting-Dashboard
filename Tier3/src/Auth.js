import GGConsts from './Constants';

class Auth {
  static authenticate(username, password,cb) {
    const creds = `${username}:${password}`;
    const header = {
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
}

export default Auth; 
