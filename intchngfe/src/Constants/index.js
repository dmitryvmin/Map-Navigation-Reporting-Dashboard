//## Interchange Admin ##
const GG_CREDS = 'global.good:~F(G3m)KPy??dwx~';

// API Fetch
const API_HEADER = {
    'Accept': 'application/json',
    'Authorization': 'Basic ' + btoa(GG_CREDS)
};
const API = 'http://20.36.19.106';
const REPORTING_PORT = '9000';
const AUCMA_PORT = '9003';
const ADMIN_PORT = '8099';
const OWNER_ID = '5896a5c1-a931-4595-8205-8e7635ca4469';

export default class GGConsts {
    static get GG_CREDS() {
      return GG_CREDS;
    }
    static get API() {
      return API;
    }
    static get API_HEADER() {
      return API_HEADER;
    }
    static get AUCMA_PORT() {
      return AUCMA_PORT;
    }
    static get ADMIN_PORT() {
      return ADMIN_PORT;
    }
    static get REPORTING_PORT() {
      return REPORTING_PORT;
    }
    static get OWNER_ID() {
      return OWNER_ID;
    }
}
