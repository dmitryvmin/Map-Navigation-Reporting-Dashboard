import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan500,
         cyan700,
         grey100,
         grey300,
         grey400,
         grey500,
         white } from 'material-ui/styles/colors';

// ## Interchange Admin ##
const GG_CREDS = 'demo:Change is good!';
// const GG_CREDS = 'global.good:~F(G3m)KPy??dwx~';
const API_HEADER = {
    'Accept': 'application/json',
    'Authorization': 'Basic ' + btoa(GG_CREDS)
};
const API = 'http://20.36.19.106';
const HEADER_AUTH = 'Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==';
const REPORTING_PORT = '9000';
const AUCMA_PORT = '9003';
const ADMIN_PORT = '8099';
const UPLOADED_DEVICES = '8780';
const OWNER_ID = '5896a5c1-a931-4595-8205-8e7635ca4469';
const MUI_THEME = getMuiTheme({
  palette: {
    primary1Color: "#7cd33b",
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: '#7ccf46',
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey500,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: cyan500,
  }
});
const THEME_COLOR = '#51326c';

export default class GGConsts {
  static get GG_CREDS() {
    return GG_CREDS;
  }
  static get API() {
    return API;
  }
  static get HEADER_AUTH() {
    return HEADER_AUTH;
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
  static get THEME_COLOR() {
    return THEME_COLOR; 
  }
  static get UPLOADED_DEVICES() {
    return UPLOADED_DEVICES;
  }
}
