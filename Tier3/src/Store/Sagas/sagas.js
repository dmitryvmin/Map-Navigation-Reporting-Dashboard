import { put, take, takeEvery, all, call, takeLatest, select, SagaEffects } from 'redux-saga/effects';
import axios from "axios";
import GGConsts from '../../Constants';
import _ from 'lodash';
import * as i18nIsoCountries from 'i18n-iso-countries'; //https://www.npmjs.com/package/i18n-iso-countries

import ReactMapGL, {LinearInterpolator, FlyToInterpolator} from 'react-map-gl';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import { getCountryObjByName } from './../../Utils';

// rootSaga
export function* watcherSaga() {
    // yield [
       yield takeLatest("API_CALL_REQUEST", workerSaga);
       yield takeLatest(GGConsts.NAV_COUNTRY_SELECTED, getGeo, GGConsts.STATES);
       yield takeLatest(GGConsts.NAV_STATE_SELECTED, getGeo, GGConsts.LGAS);
       yield takeLatest(GGConsts.NAV_LGA_SELECTED, getGeo, GGConsts.FACILITIES);
    // ]
}

// get Geo Data
export function* geoDataSaga() {
    yield call(getGeo, GGConsts.COUNTRIES);
    yield call(getGeo, GGConsts.STATES);
    // yield call(getGeo, 'LGAs');
    // yield call(getGeo, 'Facilities');

    // select Nigeria
    const state = yield select();
    const countries = state.dataReducer.COUNTRIES_MAP;
    const initCountry = getCountryObjByName(countries, 'Nigeria');
    yield put({ type: GGConsts.NAV_COUNTRY_SELECTED, country_selected: initCountry });
}

// get Sensor  Data
export function* sensorDataSaga() {}

function* getGeo(type) {
    const state = yield select();
    const { country_selected, state_selected, lga_selected, facility_selected } = state.navigationReducer;

    switch(type) {
        case GGConsts.COUNTRIES:

            const response = yield axios.get('https://restcountries.eu/rest/v2/all');
            const data = response.data;
            addAllOption(data);

            yield put({ type: GGConsts.COUNTRIES_MAP, data });

            return;

        case GGConsts.STATES:

            if (country_selected.name === 'all') {
                yield put({ type: GGConsts.NAV_STATE_SELECTED, state_selected: {name: 'all'} });

            } else {

                const countries = state.dataReducer.COUNTRIES_MAP;
                const countryObj = getCountryObjByName(countries, country_selected.name);
                // TODO: use this packages instead i18nIsoCountries
                const selected_country = countryObj.alpha2Code.toLowerCase();

                // TODO: find a better API or save country data locally
                // if (selected_country === 'ng') {
                //     const api = 'http://locationsng-api.herokuapp.com/api/v1/states';
                //     yield updateMap(GGConsts.STATES_MAP, api, 'data');
                //
                // } else {
                    const uri = `${'https://cors-anywhere.herokuapp.com/'}https://countryrestapi.herokuapp.com/${selected_country}`;
                    const data = yield updateMap(GGConsts.STATES_MAP, uri, 'data.states');

                const results = yield geocodeByAddress(country_selected.name);
                const coordinates = yield getLatLng(_.first(results));

                const viewport = {
                    longitude: Math.abs(coordinates.lng),
                    latitude: Math.abs(coordinates.lat),
                    zoom: 5
                    // transitionDuration: 300,
                    // transitionInterpolator: new FlyToInterpolator(),
                };

                yield put({ type: 'MAP_VIEWPORT', viewport });

                yield put({ type: GGConsts.STATES_MAP, data });
                yield put({ type: GGConsts.NAV_STATE_SELECTED, state_selected: {name: 'all'} });

                // }
            }

            return;

        case GGConsts.LGAS:

            if (state_selected.name === 'all') {
                yield put({ type: GGConsts.NAV_LGA_SELECTED, lga_selected: {name: 'all'} });

            } else {

                // need an API to retrieve LGAs for all countries...
                if (country_selected.name === 'Nigeria') {

                    const stateFormatted = state_selected.replace(/\State+[.!?]?$/, '').trim().toLowerCase();
                    const uri = `http://locationsng-api.herokuapp.com/api/v1/states/${stateFormatted}/details`

                    const data = yield updateMap(GGConsts.LGAS_MAP, uri, 'data.lgas');
                    yield put({ type: GGConsts.LGAS_MAP, data });
                }
            }

            return;

        case GGConsts.FACILITIES:

            // if (lga_selected === 'all') {
                const facilities = ['facility1', 'facility2', 'facility3'];
                addAllOption(facilities);
                yield put({ type: GGConsts.FACILITIES_MAP, data: facilities });
            // } else {
                // Reduce sensors  map to find any Facilities that fall within the selected LGA
            // }

            return;
    }
}

const addAllOption = (data) => {
    const option = _.first(data);

    if (typeof option === 'string') {
        data.unshift('all');
    } else {
        data.unshift({ name: 'all' });
    }

    return data;
}

// TODO: better to call saga put here or in getGeo caller saga?
function* updateMap(type, resource, key) {
    const response = yield fetchData(resource);
    const data = _.get(response, key);
    debugger;
    if (data) {
        addAllOption(data);
        return data;

    } else {
        console.warn(`Unable to update ${type}. No ${key} in the response from ${resource}: ${JSON.stringify(response)}`);
    }
}

// function that makes the api request and returns a Promise for response
function* fetchData(...args) {
    const [uri, config = ''] = args;
    const response = yield axios.get(uri, config);
    return response;
}

// worker saga: makes the api call when watcher saga sees the action
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