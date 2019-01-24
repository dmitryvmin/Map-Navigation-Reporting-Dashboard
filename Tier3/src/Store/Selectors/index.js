import { createSelector } from 'reselect';

const viewportSelector = createSelector(
    (state, props) => state.mapReducer[props.key],
    viewport => viewport
);

// TODO: add reselect to the rest like the one above - https://github.com/reduxjs/reselect

const navSelector = state => state.navigationReducer.navigation;

const tierSelector = state => state.navigationReducer.nav_tier;

const hoverSelector = state => state.navigationReducer.nav_hover;

const geoSelector = state => state.dataReducer.geo_map;

const sensorsSelector = state => state.dataReducer.sensors_map;

const uriSelector = state => state.uri;

const metricSelector = state => state.metricReducer.metric_selected;

const displaySelector = state => state.displayReducer.display_data;

const markersSelector = state => state.markersReducer.markers;

const mfcSelector = state => state.mfcReducer.mfc_selected;

const deviceTypeSelector = state => state.deviceReducer.device_type_selected;

const timeframeSelector = state => state.timeframeReducer.timeframe_selected;

const thresholdSelector = state => state.settingsReducer.metrics_threshold;

export {
    navSelector,
    tierSelector,
    hoverSelector,
    geoSelector,
    sensorsSelector,
    viewportSelector,
    uriSelector,
    metricSelector,
    displaySelector,
    markersSelector,
    mfcSelector,
    deviceTypeSelector,
    timeframeSelector,
    thresholdSelector
}