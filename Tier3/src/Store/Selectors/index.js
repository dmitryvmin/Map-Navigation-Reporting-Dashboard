import { createSelector } from 'reselect';

const viewportSelector = createSelector(
    (state, props) => state[props.key],
    viewport => viewport
);
// TODO: add reselect to the rest like the one above - https://github.com/reduxjs/reselect

const navSelector = state => state.navigationReducer.navigation;

const tierSelector = state => state.navigationReducer.nav_tier;

const geoSelector = state => state.dataReducer.geo_map;

const sensorsSelector = state => state.dataReducer.sensors_map;

const uriSelector = state => state.uri;

const metricSelector = state => state.metricReducer.metric_selected;

export {
    navSelector,
    tierSelector,
    geoSelector,
    sensorsSelector,
    viewportSelector,
    uriSelector,
    metricSelector,
}