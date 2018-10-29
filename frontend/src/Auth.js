import auth0 from 'auth0-js';

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: 'dabija999.eu.auth0.com',
      audience: 'https://dabija999.eu.auth0.com/userinfo',
      clientID: 'LuBh5gFxjUDCa13TH20cbSCi4efaTNxx',
      redirectUri: 'http://localhost:3000/callback',
      responseType: 'token id_token',
      scope: 'openid profile'
    });
  }

  getProfile = () => {
    return this.profile;
  };

  getIdToken = () => {
    return this.idToken;
  };

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      })
    })
  };

  isAuthenticated = () => {
    return new Date().getTime() < this.expiresAt;
  };

  signIn = () => {
    this.auth0.authorize();
  };

  setSession(authResult, step) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
  }

  signOut = () => {
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: 'LuBh5gFxjUDCa13TH20cbSCi4efaTNxx',
    });
  };

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;