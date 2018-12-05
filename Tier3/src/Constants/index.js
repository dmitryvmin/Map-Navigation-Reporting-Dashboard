// API Creds
const GG_CREDS = 'demo:Change is good!';
const API_HEADER = {
    'Accept': 'application/json',
    'Authorization': 'Basic ' + btoa(GG_CREDS)
};

// Endpoints
const API = 'http://20.36.19.106';
const HEADER_AUTH = 'Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==';
const REPORTING_PORT = '9000';
const AUCMA_PORT = '9003';
const ADMIN_PORT = '8099';
const UPLOADED_DEVICES = '8780';
const OWNER_ID = '5896a5c1-a931-4595-8205-8e7635ca4469';
const THEME_COLOR = '#51326c';

// API Actions
const API_CALL_REQUEST = "API_CALL_REQUEST";
const API_CALL_SUCCESS = "API_CALL_SUCCESS";
const API_CALL_FAILURE = "API_CALL_FAILURE";
const DEVICE_ERRORS = "DEVICE_ERRORS";

// Reducer Actions
export const NAV_COUNTRY_SELECTED = "NAV_COUNTRY_SELECTED";
export const NAV_STATE_SELECTED = "NAV_STATE_SELECTED";
export const NAV_LGA_SELECTED = "NAV_LGA_SELECTED";
export const NAV_FACILITY_SELECTED = "NAV_FACILITY_SELECTED";
export const NAV_MANUFACTURER_SELECTED = "NAV_MANUFACTURER_SELECTED";

export const COUNTRIES_MAP = "COUNTRIES_MAP";
export const STATES_MAP = "STATES_MAP";
export const LGAS_MAP = "LGAS_MAP";
export const FACILITIES_MAP = "FACILITIES_MAP";

export const COUNTRIES = "COUNTRIES";
export const STATES = "STATES";
export const LGAS = "LGAS";
export const FACILITIES = "FACILITIES";

export const SENSORS_MAP = "SENSORS_MAP";

export default class GGConsts {

  static get COUNTRIES() {
    return COUNTRIES;
  }
  static get STATES() {
    return STATES;
  }
  static get LGAS() {
    return LGAS;
  }
  static get FACILITIES() {
    return FACILITIES;
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

  static get NAV_COUNTRY_SELECTED() {
    return NAV_COUNTRY_SELECTED;
  }
  static get NAV_STATE_SELECTED() {
    return NAV_STATE_SELECTED;
  }
  static get NAV_LGA_SELECTED() {
    return NAV_LGA_SELECTED;
  }
  static get NAV_FACILITY_SELECTED() {
    return NAV_FACILITY_SELECTED;
  }
  static get NAV_MANUFACTURER_SELECTED() {
    return NAV_MANUFACTURER_SELECTED;
  }

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
