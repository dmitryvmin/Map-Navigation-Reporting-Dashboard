import {createMuiTheme} from '@material-ui/core/styles';
import indigo from 'material-ui/colors/indigo';

// Theme
const THEME_COLOR = '#51326c';
const MUI_THEME = createMuiTheme({
    palette: {
        primary: {
            main: indigo[500],
        },
    },
    typography: {
        fontFamily: [
            "Roboto",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Arial",
            "sans-serif"
        ].join(","),
        useNextVariants: true
    }
});

// Colors
const SELECTED_COLOR = "#f5f5f5";
const DESELECTED_COLOR = "#bcbcbc";
const OFF_COLOR = "#6b6b6b";

// API Creds
const GG_CREDS = 'demo:Change is good!';
const API_HEADER = {
    'Accept': 'application/json',
    'Authorization': 'Basic ' + btoa(GG_CREDS)
};

// Endpoints
// TODO: clean up Endpoint const names
const API = 'http://20.36.19.106';
const HEADER_AUTH = 'Z2xvYmFsLmdvb2Q6fkYoRzNtKUtQeT8/ZHd4fg==';
const OWNER_ID = '5896a5c1-a931-4595-8205-8e7635ca4469';
const RT_HEADER = {headers: {'Authorization': `Basic ${HEADER_AUTH}`}};
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZG1pdHJ5bWluIiwiYSI6ImNqb3FmZ2VtcDAwMWszcG84cjJxdWg5NncifQ.mphHlEjmVZzV57R-3BWJqw';
const REPORTING_PORT = '9000';
const AUCMA_PORT = '9003';
const ADMIN_PORT = '8099';
const UPLOADED_DEVICES = '8780';
const SENSORS_ENDPOINT = `${API}:${REPORTING_PORT}/sensor/state`;

// API Actions
const API_CALL_REQUEST = "API_CALL_REQUEST";
const API_CALL_SUCCESS = "API_CALL_SUCCESS";
const API_CALL_FAILURE = "API_CALL_FAILURE";
const DEVICE_ERRORS = "DEVICE_ERRORS";

// Reducer Actions
const NAV_TIER = "NAV_TIER";
const COUNTRY_LEVEL = "COUNTRY_LEVEL";
const STATE_LEVEL = "STATE_LEVEL";
const LGA_LEVEL = "LGA_LEVEL";
const FACILITY_LEVEL = "FACILITY_LEVEL";

const NAVIGATION = 'NAVIGATION';
const UPDATE_NAV = 'UPDATE_NAV';
const MAP_CLICKED = 'MAP_CLICKED';

const COUNTRIES_MAP = "COUNTRIES_MAP";
const STATES_MAP = "STATES_MAP";
const LGAS_MAP = "LGAS_MAP";
const FACILITIES_MAP = "FACILITIES_MAP";

const SENSORS_MAP = "SENSORS_MAP";
const GEO_MAP = "GEO_MAP";

const MAP_VIEWPORT = "MAP_VIEWPORT";
const MAP_STYLE = "MAP_STYLE";
const NAV_HOVER = "NAV_HOVER";

const METRIC_ALARMS = "Alarms";
const METRIC_UPTIME = "Uptime";
const METRIC_REPORTING = "Reporting";
const METRIC_HOLDOVER = "Holdover";
const METRICS = [METRIC_ALARMS, METRIC_UPTIME, METRIC_REPORTING, METRIC_HOLDOVER];
const UPDATE_METRIC = "UPDATE_METRIC";
const METRIC_SELECTED = "METRIC_SELECTED"

const TIMEFRAME_1 = "7 Days";
const TIMEFRAME_2 = "30 Days";
const TIMEFRAME_3 = "60 Days";
const TIMEFRAME_4 = "All";
const TIMEFRAMES = [TIMEFRAME_1, TIMEFRAME_2, TIMEFRAME_3, TIMEFRAME_4];
const TIMEFRAME_SELECTED = "TIMEFRAME_SELECTED";
const UPDATE_TIMEFRAME = "UPDATE_TIMEFRAME";

const DEVICE_TYPE_UPLOADED = "DEVICE_TYPE_UPLOADED";
const DEVICE_TYPE_CONNECTED = "DEVICE_TYPE_CONNECTED";
const DEVICE_TYPE_ALL = "DEVICE_TYPE_ALL";
const DEVICE_TYPE_SELECTED = "DEVICE_TYPE_SELECTED";
const UPDATE_DEVICE_TYPE = "UPDATE_DEVICE_TYPE";

const DISPLAY_DATA = "DISPLAY_DATA";

const MARKERS = "MARKERS";

const UPDATE_LAYERS = "UPDATE_LAYERS";
const ACTIVE_LAYERS = "ACTIVE_LAYERS";
const INACTIVE_LAYERS = "INACTIVE_LAYERS";

const MAP_REF = "MAP_REF";

export default class GGConsts {

    static get MAP_REF() {
        return MAP_REF;
    }

    static get UPDATE_LAYERS() {
        return UPDATE_LAYERS;
    }
    static get ACTIVE_LAYERS() {
        return ACTIVE_LAYERS;
    }
    static get INACTIVE_LAYERS() {
        return INACTIVE_LAYERS;
    }

    static get MARKERS() {
        return MARKERS;
    }

    static get DEVICE_TYPE_UPLOADED() {
        return DEVICE_TYPE_UPLOADED;
    }
    static get DEVICE_TYPE_CONNECTED() {
        return DEVICE_TYPE_CONNECTED;
    }
    static get DEVICE_TYPE_ALL() {
        return DEVICE_TYPE_ALL;
    }
    static get DEVICE_TYPE_SELECTED() {
        return DEVICE_TYPE_SELECTED;
    }
    static get UPDATE_DEVICE_TYPE() {
        return UPDATE_DEVICE_TYPE;
    }

    static get TIMEFRAME_1() {
        return TIMEFRAME_1;
    }

    static get TIMEFRAME_2() {
        return TIMEFRAME_2;
    }

    static get TIMEFRAME_3() {
        return TIMEFRAME_3;
    }

    static get TIMEFRAME_4() {
        return TIMEFRAME_4;
    }

    static get TIMEFRAMES() {
        return TIMEFRAMES;
    }

    static get UPDATE_TIMEFRAME() {
        return UPDATE_TIMEFRAME;
    }

    static get TIMEFRAME_SELECTED() {
        return TIMEFRAME_SELECTED;
    }

    static get DISPLAY_DATA() {
        return DISPLAY_DATA;
    }

    static get MUI_THEME() {
        return MUI_THEME;
    }

    static get METRICS() {
        return METRICS;
    }

    static get METRIC_SELECTED() {
        return METRIC_SELECTED;
    }

    static get UPDATE_METRIC() {
        return UPDATE_METRIC;
    }

    static get METRIC_ALARMS() {
        return METRIC_ALARMS;
    }

    static get METRIC_UPTIME() {
        return METRIC_UPTIME;
    }

    static get METRIC_REPORTING() {
        return METRIC_REPORTING;
    }

    static get METRIC_HOLDOVER() {
        return METRIC_HOLDOVER;
    }

    static get NAV_HOVER() {
        return NAV_HOVER;
    }

    static get MAPBOX_TOKEN() {
        return MAPBOX_TOKEN;
    }

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

    static get OFF_COLOR() {
        return OFF_COLOR;
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

    static get SENSORS_ENDPOINT() {
        return SENSORS_ENDPOINT;
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
