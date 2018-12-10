import { put, take, takeEvery, all, call, takeLatest, select, SagaEffects } from 'redux-saga/effects';
import axios from "axios";
import GGConsts from '../../Constants';
import _ from 'lodash';
import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries
import { getCode } from 'country-list';
import ReactMapGL, { LinearInterpolator, FlyToInterpolator } from 'react-map-gl';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getCountryObjByName } from './../../Utils';
import countryCode from 'country-code';
import { getMapStyle, applyLayerFilter } from './../../Map/map-style.js';

const countries_endpoint = 'https://restcountries.eu/rest/v2/all';
const states_endpoint = `${'https://cors-anywhere.herokuapp.com/'}https://countryrestapi.herokuapp.com`; // TODO: save Nigeria states locally or find a better API
const lgas_endpoint = `http://locationsng-api.herokuapp.com/api/v1/states`;
const sensors_endpoint = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;

const navigationMap = [
    {
        index: 0,
        // type: GGConsts.COUNTRIES,
        reducer: GGConsts.NAV_COUNTRY_SELECTED,
        type: 'country_selected',
        map: GGConsts.COUNTRIES_MAP,
    },
    {
        index: 1,
        // type: GGConsts.STATES,
        reducer: GGConsts.NAV_STATE_SELECTED,
        type: 'state_selected',
        map: GGConsts.STATES_MAP,
    },
    {
        index: 2,
        // type: GGConsts.LGAS,
        reducer: GGConsts.NAV_LGA_SELECTED,
        type: 'lga_selected',
        map: GGConsts.LGAS_MAP,
    },
    {
        index: 3,
        // type: GGConsts.FACILITIES,
        reducer: GGConsts.NAV_FACILITY_SELECTED,
        type: 'facility_selected',
        map: GGConsts.FACILITIES_MAP,
    }];

// TODO: break up Sagas into their own files

// rootSaga
export function* watcherSaga() {
       yield takeLatest(GGConsts.API_CALL_REQUEST, workerSaga);
       yield takeLatest(GGConsts.UPDATE_NAV, navUpdate);
}

// get Geo Data
export function* initSaga() {
    const data = yield getGeo('country_selected');
    yield  put({ type: GGConsts.COUNTRIES_MAP, data });

    // init by fetching country data
    yield navUpdate({ 'country_selected': 'Nigeria' });
}

// get Sensor  Data
export function* sensorDataSaga() {
    const sensors = yield fetchData(sensors_endpoint, GGConsts.RT_HEADER);

    // TODO: build data maps

    yield put({ type: GGConsts.SENSORS_MAP, [GGConsts.SENSORS_MAP]: sensors });
}

const getTierName = navTier => {
    switch(navTier) {
        case GGConsts.COUNTRIES:
            return 'COUNTRY_LEVEL';
        case GGConsts.STATES:
            return 'STATE_LEVEL';
        case GGConsts.LGAS:
            return 'LGA_LEVEL';
        case GGConsts.FACILITIES:
            return 'FACILITY_LEVEL';
    }
}

// TODO: move to /selectors.js
const getNavState = state => state.navigationReducer.navigation;

const getDataState = state => state.dataReducer;


function* updateMenus(curNav, value) {
    // We are only concerned with nav elements down the chain

    const childNavs = navigationMap.filter(n => n.index > curNav.index);
    const navState = yield select(getNavState);

    // If current nav has a specific locatinn selected, Set immediate child to `all`
    if (childNavs.length && value !== 'all') {
        const dataState = yield select(getDataState);
        const child = _.first(childNavs.splice(0,1));

        if (_.isEmpty(dataState[child.map])) {
            const data = yield getGeo(child.type);

            yield put({ type: child.map, data });
        }

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

// function difference(object, base) {
//     function changes(object, base) {
//         return _.transform(object, function(result, value, key) {
//             if (!_.isEqual(value, base[key])) {
//                 result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
//             }
//         });
//     }
//     return changes(object, base);
// }

// TODO break this up into smaller functions. The `(value && value !== 'all')` check if called several times, group together
function* navUpdate( action ) {
    const { type, ...nav } = action;

    // if (type === GGConsts.NAVIGATION) {
    //     return;
    // }

    const navType = _.first(_.keys(nav));
    const navValue = _.first(_.values(nav));


    // ## The update action properties can be found in the navObj map
    const navMap = _.first(navigationMap.filter(n => n.type === navType)); // TODO: rename navObj to curNav


    // ## Set Tier
    // if (value && value !== 'all') {
    //     // If a specific geographic location is selected, the Tier is of that location type, e.g. location: WA, tier: State Level
    //     const nav_tier = getTierName(navObj.type);
    //     console.log('@@nav_tier', nav_tier);
    //     // debugger;
    //     yield put({ type: GGConsts.NAV_TIER, nav_tier });
    // } else if (value && value === 'all') {
    //     // If location is 'all', the Tier is of the parent type, e.g. location: all, tier: Country Level
    //     const parent = _.first(navigationMap.filter(nav => nav.index === navObj.index - 1));
    //     const nav_tier = getTierName(parent.type);
    //     console.log('@@nav_tier', nav_tier);
    //     // debugger;
    //     yield put({ type: GGConsts.NAV_TIER, nav_tier });
    // }

   const navigation = yield updateMenus(navMap, navValue);
    

   yield put({ type: GGConsts.NAVIGATION, navigation });


    // ## Update Map position, zoom
    // if (value && value !== 'all') {
    //
    //     const state = yield select();
    //     const { country_selected,
    //             state_selected,
    //             lga_selected } = state.navigationReducer;
    //
    //     // create a location string for geocode positioning
    //     const location = [country_selected, state_selected, lga_selected].filter(str => (str && str !== 'all') && str).join(', ');
    //
    //     console.warn('@@location', location);
    //
    //     yield centerMap(location);
    // }

    // ## Update Map style/layers
    // Need to shade regions that are higher up the chain
    // const mapToUpdate = navigationMap.filter(n => n.index < navObj.index);
    // get a copy of the map style
    // let map_style = getMapStyle();




    // 1. First we shade the parent regions
    // const parentTiers = navigationMap.filter(n => n.index < navObj.index);






    // debugger;
    // if (value && value !== 'allzz') {
    //     // TODO: should countries be stored as Alpha3 codes? where's the best place to convert - when fetching/storing or when rendering?
    //     const filter = (action.type === GGConsts.NAV_COUNTRY_SELECTED) ? countryCode.find({name: value}).alpha3 : value;
    //
    //
    //     const childNav = _.first(navigationMap.filter(nav => nav.index === navObj.index + 1));
    //
    //     // map_style = applyLayerFilter(map_style, childNav.type, 'all');
    //     // debugger;
    //     // shade outer layers
    //     if (mapToUpdate.length) {
    //         const _state = yield select();
    //
    //         mapToUpdate.forEach(nav => {
    //             // TODO: refactor - need a helper function to get the filter code. Related to the above TODO
    //             let value = _state.navigationReducer[nav.state]
    //             let filter = (nav.type === GGConsts.COUNTRIES) ? countryCode.find({name: value}).alpha3 : value;
    //
    //             map_style = applyLayerFilter(map_style, nav.type, filter);
    //         });
    //     }

        // lastly, shade the selected nav layer



        // map_style = applyLayerFilter(map_style, navObj.type, filter);
        //
        // yield put({ type: GGConsts.MAP_STYLE, map_style });





    // } else if (value && value === 'all') {

        // Fot no country selected view only

        // map_style = applyLayerFilter(map_style, navObj.type, 'all');


        // yield put({ type: GGConsts.MAP_STYLE, map_style });


    // }

}

function* centerMap(location) {

    const results = yield geocodeByAddress(location);
    const coordinates = yield getLatLng(_.first(results));

    // TODO: Figure out transitionInterpolator to make map centering animate
    if (coordinates.lng && coordinates.lat) {
        const map_viewport = {
            longitude: Math.abs(coordinates.lng),
            latitude: Math.abs(coordinates.lat),
            zoom: 5
            // transitionDuration: 300,
            // transitionInterpolator: new FlyToInterpolator(),
        };

        yield put({ type: GGConsts.MAP_VIEWPORT, map_viewport });
    }
}


function* getGeo(type) {
    const navState = yield select(getNavState);
    const { country_selected,
            state_selected } = navState;

    switch(type) {
        case 'country_selected':

            return yield getMapData(GGConsts.COUNTRIES_MAP, countries_endpoint, 'data');

        case 'state_selected':

            let contry_code = getCode(country_selected).toLowerCase();
            let uri = `${states_endpoint}/${contry_code}`;
            return yield getMapData(GGConsts.STATES_MAP, uri, 'data.states');

        case 'lga_selected':

            // NOTE: Eventually will need an API to retrieve LGAs for all countries, this is Nigeria specific
            if (country_selected === 'Nigeria') {
                let stateFormatted = state_selected.replace(/\State+[.!?]?$/, '').trim().toLowerCase();
                let uri = `${lgas_endpoint}/${stateFormatted}/details`;
                return yield getMapData(GGConsts.LGAS_MAP, uri, 'data.lgas');
            }

        case 'facility_selected':

            // TODO: hook up to the sensors API
            const facilities = ['facility1', 'facility2', 'facility3'];
            addAllOption(facilities);
            return facilities;
    }
}

// add an 'all' option to the hash for the dropdown
const addAllOption = (data) => {
    data.unshift('all');
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