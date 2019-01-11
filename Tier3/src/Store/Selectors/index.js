import { createSelector } from 'reselect';

const viewportSelector = createSelector(
    (state, props) => state[props.key],
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
}