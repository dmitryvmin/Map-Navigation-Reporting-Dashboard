import { put, take, takeEvery, all, call, takeLatest, select, SagaEffects } from 'redux-saga/effects';
import axios from "axios";
import GGConsts from '../../Constants';
import _ from 'lodash';
import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries
import { getCode } from 'country-list';
import ReactMapGL, { LinearInterpolator, FlyToInterpolator } from 'react-map-gl';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getCountryObjByName } from './../../Utils';
import cc from 'country-code';
import { getMapStyle, getFilter, getChildFilter, applyLayerFilter } from './../../Map/map-style.js';

const countries_endpoint = 'https://restcountries.eu/rest/v2/all';
const states_endpoint = `${'https://cors-anywhere.herokuapp.com/'}https://countryrestapi.herokuapp.com`; // TODO: save Nigeria states locally or find a better API
const lgas_endpoint = `http://locationsng-api.herokuapp.com/api/v1/states`;
const sensors_endpoint = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

const navigationMap = [
    {
        index: 0,
        type: 'country_selected',
        map: 'countries',
    },
    {
        index: 1,
        type: 'state_selected',
        map: 'states',
    },
    {
        index: 2,
        type: 'lga_selected',
        map: 'lgas',
    },
    {
        index: 3,
        type: 'facility_selected',
        map: 'facilities',
    }];

// TODO: break up Sagas into their own files

// rootSaga
export function* watcherSaga() {
       yield takeLatest(GGConsts.API_CALL_REQUEST, workerSaga);
       yield takeLatest(GGConsts.UPDATE_NAV, navUpdate);
}

// get Geo Data
export function* initSaga() {
    const data = yield getGeo('countries');

    yield put({ type: GGConsts.GEO_MAP, data: { 'countries': data } });

    // init by fetching country data
    yield navUpdate({navState: { 'country_selected': 'Nigeria' }});
}

// get Sensor  Data
export function* sensorDataSaga() {
    const sensors = yield fetchData(sensors_endpoint, GGConsts.RT_HEADER);

    // TODO: build data maps

    yield put({ type: GGConsts.SENSORS_MAP, [GGConsts.SENSORS_MAP]: sensors });
}

const getTierName = navTier => {
    switch(navTier) {
        case 'country_selected':
            return 'COUNTRY_LEVEL';
        case 'state_selected':
            return 'STATE_LEVEL';
        case 'lga_selected':
            return 'LGA_LEVEL';
        case 'facility_selected':
            return 'FACILITY_LEVEL';
    }
}

// TODO: move to /selectors.js
const getNavState = state => state.navigationReducer.navigation;

const getTierState = state => state.navigationReducer.nav_tier;

const getGeoState = state => state.dataReducer.geo_map;

/**
 * Get
 * @param {number}
 * @param {number}
 * @returns {number}
 */
function* getNav(curNav, value) {
    // We are only concerned with nav elements down the chain

    const childNavs = navigationMap.filter(n => n.index > curNav.index);
    const navState = yield select(getNavState);

    // If current nav has a specific locatinn selected, Set immediate child to `all`
    if (childNavs.length && value !== 'all') {

        // remove the child from the childNavs array because the rest of the children will be turned off
        const child = _.first(childNavs.splice(0,1));

        const data = yield getGeo(child.map, value);
        yield put({ type: GGConsts.GEO_MAP, data: {[child.map]: data} });

        navState[child.type] = 'all';
    }

    // Set rest to null if needed
    if (childNavs.length) {
        for (let nav of childNavs) {
            // if item is not null, set to null
            if (!_.isNull(navState[nav.state])) {
                navState[nav.type] = false;
            }
        }
    }
    // update the explicitly selected nav
    navState[curNav.type] = value;

    return navState;
}

const getTier = (map, value) => {
    if (value !== 'All') {
        // If a specific geographic location is selected, the Tier is of that location type, e.g. location: WA, tier: State Level
        const navTier = getTierName(map.type);
        return navTier;

    } else {
        // If location is 'all', the Tier is of the parent type, e.g. state: all, tier: Country Level
        const parent = _.first(navigationMap.filter(nav => nav.index === map.index - 1));
        const navTier = getTierName(parent.type);
        return navTier;
    }
}

function* navUpdate( action ) {
    const { type, ...nav } = action.navState;

    const navType = _.first(_.keys(nav));
    const navValue = _.first(_.values(nav));

    if (!navValue || !navType) {
        console.log(`%c something wrong with the selected action: ${action}`, 'background: #c50018; color: white; display: block;');
    }

    // ## The update action properties can be found in the navObj map
    const navMap = _.first(navigationMap.filter(n => n.type === navType));

    // ## Set Tier
    const nav_tier = getTier(navMap, navValue);
    yield put({ type: GGConsts.NAV_TIER, nav_tier });

    // ## Update Navigation
    const navigation = yield getNav(navMap, navValue);
    yield put({ type: GGConsts.NAVIGATION, navigation });

    // ## Update Map position, zoom
    const map_viewport = yield getViewport(nav_tier, navigation);
    yield put({ type: GGConsts.MAP_VIEWPORT, map_viewport });

    // Update Map style
    const map_style = updateMapStyle(navigation, navMap, navValue);
    yield put({ type: GGConsts.MAP_STYLE, map_style });

}

/**
 * Update Map style/layers
 * @returns {string} location - Concatenated tiers
 */
const updateMapStyle = (navigation, navMap, navValue) => {
    // 1. Get a copy of the map style
    let map_style = getMapStyle();

    // 2. First shade the parent regions
    // const parentTiers = navigationMap.filter(n => n.index < navMap.index);
    // if (parentTiers.length) {
    //     parentTiers.forEach(n => {
    //         let type = n.type;
    //         let value = navigation[type];
    //         let filter = getFilter('exclude', type, value);
    //         map_style = applyLayerFilter(map_style, type, filter);
    //     });
    // }
    // 3. Shade current layer
    const filter = getFilter('exclude', navMap.type, navValue);
    map_style = applyLayerFilter(map_style, navMap.type, filter);

    // 4. Shade inner layer
    // NOTE: there's no map for facility level
    if (navMap.type !== 'lga_selected') {
        const childTier = _.first(navigationMap.filter(n => n.index === navMap.index + 1)) || null;
        const t = childTier.type;
        const f = getChildFilter('include', t, navValue);

        map_style = applyLayerFilter(map_style, t, f);
    }

    return map_style;
}

/**
 * Get the location selected in the navigation
 * @returns {string} location - Concatenated tiers
 */
function getLocation(navigation) {
    // const navState = yield select(getNavState);

    const {
        country_selected,
        state_selected,
        lga_selected
    } = navigation;

    const nav = [country_selected, state_selected, lga_selected];
    const activeNavs = [];

    nav &&_.forEach(nav, t => {
        // only looking for specific location names in the nav tier
        if (t && t !== 'all') {
            activeNavs.push(t);
        }
        // break out of the loop since subsequent locations can't exist
        else {
            return false;
        }
    });

    const location = activeNavs.join(', ');
    console.log(`%c selected location: ${location}`, 'background: #51326c; color: white; display: block;');

    return location;
}

/**
 * Get the zoom leve for the current tier state
 * @returns {number} zoom
 */
function getZoom(tier) {
    // const tier = yield select(getTierState);

    // TODO: Move this somewhere more fitting
    const zoomMap = {
        [GGConsts.COUNTRY_LEVEL]: 5,
        [GGConsts.STATE_LEVEL]: 8,
        [GGConsts.LGA_LEVEL]: 11,
        'default': 5,
    }

    const zoom = zoomMap[tier] || zoomMap.default;
    return zoom;
}


function* getViewport(tier, navigation) {
    const zoom = getZoom(tier);
    const location = getLocation(navigation);
    const results = yield geocodeByAddress(location);
    const coordinates = yield getLatLng(_.first(results));

    // TODO: Figure out transitionInterpolator to make map centering animate
    if (coordinates.lng && coordinates.lat) {
        const map_viewport = {
            longitude: Math.abs(coordinates.lng),
            latitude: Math.abs(coordinates.lat),
            zoom,
            // transitionDuration: 300,
            // transitionInterpolator: new FlyToInterpolator(),
        };

        return map_viewport;
    }
}


function* getGeo(type, selected = null) {

    switch(type) {
        case 'countries':

            return yield getMapData(GGConsts.COUNTRIES_MAP, countries_endpoint, 'data');

        case 'states':

            const contryCode = getCode(selected);

            if (!contryCode) {
                console.warn(`@@ Couldn't fetch states for ${selected}`);
                return;
            }
            const formattedCode = contryCode.toLowerCase();
            const uri = `${states_endpoint}/${formattedCode}`;

            return yield getMapData(GGConsts.STATES_MAP, uri, 'data.states');

        case 'lgas':

            // NOTE: Eventually will need an API to retrieve LGAs for all countries, this is Nigeria specific
            const { country_selected } = yield select(getNavState);

            if (country_selected === 'Nigeria') {
                let stateFormatted = selected.replace(/\State+[.!?]?$/, '').trim().toLowerCase();
                let uri = `${lgas_endpoint}/${stateFormatted}/details`;
                return yield getMapData(GGConsts.LGAS_MAP, uri, 'data.lgas');
            }

            return;

        case 'facilities':

            // TODO: take sensors map and filter by selected_lga
            const facilities = ['facility1', 'facility2', 'facility3'];
            addAllOption(facilities);
            return facilities;
    }
}

// add an 'all' option to the hash for the dropdown
const addAllOption = (data) => {
    data.unshift('All');
    return data;
}

const formatCountryMap = arr => {
    return arr.reduce((acc, cur) => {
        acc.push(cur.name);
        return acc;
    }, []);
}

// return Map for the store
function* getMapData(type, resource, key) {
    const response = yield fetchData(resource);
    let data = _.get(response, key);

    if (data) {
        // remove if data is saved locally instead of fetched from the API
        if (type === GGConsts.COUNTRIES_MAP) data = formatCountryMap(data);
        // sort alphabetically
        data.sort();
        // add an `all` option
        addAllOption(data);
        return data;

    } else {
        console.warn(`Unable to update ${type}. No ${key} in the response from ${resource}: ${JSON.stringify(response)}`);
    }
}

// makes the api request and returns a Promise response
function* fetchData(...args) {
    const [uri, config = ''] = args;
    const response = yield axios.get(uri, config);
    return response;
}

// makes the api call when watcher saga sees the action
function* workerSaga({uri, config, resource}) {
    try {
        const response = yield call(fetchData, uri, config);
        const data = response.data;

        // dispatch a success action to the store
        yield put({ type: GGConsts.API_CALL_SUCCESS });

        // store API response in the appropriate store map
        yield put({ type: resource, data });

    } catch (error) {
        // dispatch a failure action to the store with the error
        yield put({ type: GGConsts.API_CALL_FAILURE, error });
    }
}