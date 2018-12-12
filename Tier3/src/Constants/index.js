// API Creds
const GG_CREDS = 'demo:Change is good!';
const API_HEADER = {
    'Accept': 'application/json',
    'Authorization': 'Basic ' + btoa(GG_CREDS)
};

// Theme
const THEME_COLOR = '#51326c';

// Endpoints
// TODO: clean up the names
const API = 'http://20.36.19.106';
const HEADER_AUTH = 'Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==';
const OWNER_ID = '5896a5c1-a931-4595-8205-8e7635ca4469';

const RT_HEADER = { headers: { 'Authorization': `Basic ${HEADER_AUTH}` }};

// Ports
const REPORTING_PORT = '9000';
const AUCMA_PORT = '9003';
const ADMIN_PORT = '8099';
const UPLOADED_DEVICES = '8780';

// API Actions
const API_CALL_REQUEST = "API_CALL_REQUEST";
const API_CALL_SUCCESS = "API_CALL_SUCCESS";
const API_CALL_FAILURE = "API_CALL_FAILURE";
const DEVICE_ERRORS = "DEVICE_ERRORS";

// Reducer Actions
export const NAV_TIER = "NAV_TIER";
export const COUNTRY_LEVEL = "COUNTRY_LEVEL";
export const STATE_LEVEL = "STATE_LEVEL";
export const LGA_LEVEL = "LGA_LEVEL";
export const FACILITY_LEVEL = "FACILITY_LEVEL";

export const UPDATE_NAV = 'UPDATE_NAV';
export const NAVIGATION = 'NAVIGATION';

export const MAP_CLICKED = 'MAP_CLICKED';

export const COUNTRIES_MAP = "COUNTRIES_MAP";
export const STATES_MAP = "STATES_MAP";
export const LGAS_MAP = "LGAS_MAP";
export const FACILITIES_MAP = "FACILITIES_MAP";

export const SENSORS_MAP = "SENSORS_MAP";
export const GEO_MAP = "GEO_MAP";

export const MAP_VIEWPORT = "MAP_VIEWPORT";
export const MAP_STYLE = "MAP_STYLE";

// Styles
export const SELECTED_COLOR = "#f5f5f5";
export const DESELECTED_COLOR = "#bcbcbc";

export default class GGConsts {

  static get MAP_VIEWPORT() {
    return MAP_VIEWPORT;
  }
  static get MAP_STYLE() {
    return MAP_STYLE;
  }

  static get SELECTED_COLOR() {
    return SELECTED_COLOR;
  }
  static get DESELECTED_COLOR() {
    return DESELECTED_COLOR;
  }

  static get API_CALL_SUCCESS() {
    return API_CALL_SUCCESS;
  }
  static get API_CALL_FAILURE() {
    return API_CALL_FAILURE;
  }
  static get API_CALL_REQUEST() {
    return API_CALL_REQUEST;
  }
  static get DEVICE_ERRORS() {
    return DEVICE_ERRORS;
  }

  static get SENSORS_MAP() {
    return SENSORS_MAP;
  }
  static get GEO_MAP() {
    return GEO_MAP;
  }

  static get COUNTRIES_MAP() {
    return COUNTRIES_MAP;
  }
  static get STATES_MAP() {
    return STATES_MAP;
  }
  static get LGAS_MAP() {
    return LGAS_MAP;
  }
  static get FACILITIES_MAP() {
    return FACILITIES_MAP;
  }

  static get NAV_TIER() {
    return NAV_TIER;
  }
  static get COUNTRY_LEVEL() {
    return COUNTRY_LEVEL;
  }
  static get STATE_LEVEL() {
    return STATE_LEVEL;
  }
  static get LGA_LEVEL() {
    return LGA_LEVEL;
  }
  static get FACILITY_LEVEL() {
    return FACILITY_LEVEL;
  }

  static get NAVIGATION() {
    return NAVIGATION;
  }
  static get UPDATE_NAV() {
    return UPDATE_NAV;
  }

  static get MAP_CLICKED() {
    return MAP_CLICKED;
  }

  static get GG_CREDS() {
    return GG_CREDS;
  }
  static get API() {
    return API;
  }
  static get RT_HEADER() {
    return RT_HEADER;
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
