import { put, take, takeEvery, all, call, takeLatest, select, SagaEffects } from 'redux-saga/effects';
import axios from "axios";
import GGConsts from '../../Constants';
import _ from 'lodash';
import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries
import { getCode } from 'country-list';
import ReactMapGL, { LinearInterpolator, FlyToInterpolator } from 'react-map-gl';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getCountryObjByName } from './../../Utils';


const countries_endpoint = 'https://restcountries.eu/rest/v2/all';
const states_endpoint = `${'https://cors-anywhere.herokuapp.com/'}https://countryrestapi.herokuapp.com`; // TODO: save Nigeria states locally or find a better API
const lgas_endpoint = `http://locationsng-api.herokuapp.com/api/v1/states`;

const navigationMap = [
    {
        index: 0,
        type: GGConsts.COUNTRIES,
        reducer: GGConsts.NAV_COUNTRY_SELECTED,
        state: 'country_selected',
        map: GGConsts.COUNTRIES_MAP,
    },
    {
        index: 1,
        type: GGConsts.STATES,
        reducer: GGConsts.NAV_STATE_SELECTED,
        state: 'state_selected',
        map: GGConsts.STATES_MAP,
    },
    {
        index: 2,
        type: GGConsts.LGAS,
        reducer: GGConsts.NAV_LGA_SELECTED,
        state: 'lga_selected',
        map: GGConsts.LGAS_MAP,
    },
    {
        index: 3,
        type: GGConsts.FACILITIES,
        reducer: GGConsts.NAV_FACILITY_SELECTED,
        state: 'facility_selected',
        map: GGConsts.FACILITIES_MAP,
    }];

// rootSaga
export function* watcherSaga() {
       yield takeLatest(GGConsts.API_CALL_REQUEST, workerSaga);
       yield takeLatest(GGConsts.NAV_COUNTRY_SELECTED, updateNavigation);
       yield takeLatest(GGConsts.NAV_STATE_SELECTED, updateNavigation);
       yield takeLatest(GGConsts.NAV_LGA_SELECTED, updateNavigation);
}

// get Geo Data
export function* initSaga() {
    // init by fetching country data
    const data = yield getGeo(GGConsts.COUNTRIES);
    // save to store
    yield put({ type: GGConsts.COUNTRIES_MAP, data });
    // select Nigeria
    yield put({ type: GGConsts.NAV_COUNTRY_SELECTED, country_selected: 'Nigeria' });
}

// get Sensor  Data
export function* sensorDataSaga() {}

function* setToAll(navObj) {
    const state = yield select();

    // check if the navObj has a map available in store
    if ( !_.has(state, `dataReducer.${navObj.map}`) ) {
    // Need to fetch and save the data first
        const data = yield getGeo(navObj.type);
        yield put({ type: navObj.map, data });
    }

    yield put({ type: navObj.reducer, [navObj.state]: 'all' });

}

function* updateNavigation( action ) {
    // get information about newNavState so we know what needs to be updates
    const navObj = _.first(navigationMap.filter(n => n.reducer === action.type));
    // We are only concerned with nav elements down the chain
    const toUpdate = navigationMap.filter(n => n.index > navObj.index);

    if (toUpdate.length) {
        // if action is set to all, no need to update children

        if (action[navObj.state] !== 'all' && action[navObj.state] !== false) {
            // Set immediate child to `all`
            const child = toUpdate.shift();
            yield setToAll(child);
        }

        // TODO: optimize here: if child nav objects are already null, don't need to set them to null again
        // Set rest to null
        const forGenerator = function *(array) {
            for (var item of array) {
                yield put({ type: item.reducer, [item.state]: false });
            }
        }
        yield forGenerator(toUpdate);
    }

    // TODO: refactor
    if (action[navObj.state] !== 'all' && action[navObj.state] !== false) {

        const state = yield select();
        const { country_selected, state_selected, lga_selected } = state.navigationReducer;
        const location = `${(country_selected !== 'all') && country_selected} ${(state_selected !== 'all') && state_selected} ${(lga_selected !== 'all') && lga_selected}`;
        console.warn('@@location', location);
        yield centerMap(location);

    }
}

function* centerMap(location) {

    const results = yield geocodeByAddress(location);
    const coordinates = yield getLatLng(_.first(results));

    // TODO: Figure out transitionInterpolator to make map centering animate
    const viewport = {
        longitude: Math.abs(coordinates.lng),
        latitude: Math.abs(coordinates.lat),
        zoom: 5
        // transitionDuration: 300,
        // transitionInterpolator: new FlyToInterpolator(),
    };

    yield put({ type: GGConsts.MAP_VIEWPORT, viewport });
}


function* getGeo(type) {
    const state = yield select();
    const { country_selected,
            state_selected } = state.navigationReducer;

    switch(type) {
        case GGConsts.COUNTRIES:

            return yield getMapData(GGConsts.COUNTRIES, countries_endpoint, 'data');

        case GGConsts.STATES:

            const contry_code = getCode(country_selected).toLowerCase();
            const uri = `${states_endpoint}/${contry_code}`;
            return yield getMapData(GGConsts.STATES_MAP, uri, 'data.states');

        case GGConsts.LGAS:

            // NOTE: Eventually will need an API to retrieve LGAs for all countries, this is Nigeria specific
            if (country_selected === 'Nigeria') {
                const stateFormatted = state_selected.replace(/\State+[.!?]?$/, '').trim().toLowerCase();
                const uri = `${lgas_endpoint}/${stateFormatted}/details`;
                return yield getMapData(GGConsts.LGAS_MAP, uri, 'data.lgas');
            }
            return;

        case GGConsts.FACILITIES:

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
        if (type === GGConsts.COUNTRIES) data = formatCountryMap(data);

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