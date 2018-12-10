import { combineReducers } from "redux";
import _ from 'lodash';
import GGConsts from '../../Constants';
import { getMapStyle } from './../../Map/map-style.js';

// TODO: create initial state for all the reducers and move them into their own files
const apiInitState = {
    fetching: false,
    data: null,
    error: null
};

const navigationInitState = {
    nav_tier: false,
    navigation: {
        country_selected: 'Nigeria',
        state_selected: 'all',
        lga_selected: false,
        facility_selected: false,
    }
}

const mapInitState = {
    map_style: getMapStyle(),
    map_viewport: {
        // flyTo: {center: [47.6144828, -122.3286736], zoom: 10, speed: 1.5},
        width: '100%',
        height: 712,
        latitude: 9.077751,
        longitude: 8.6774567,
        zoom: 5
    }
}

export function mapReducer(state = mapInitState, action) {
    switch (action.type) {
        case GGConsts.MAP_VIEWPORT:
            return {
                ...state,
                map_viewport: {
                    ...state.map_viewport,
                    latitude: action.map_viewport.latitude,
                    longitude: action.map_viewport.longitude,
                    zoom: action.map_viewport.zoom,
                    // transitionDuration: action.viewport.transitionDuration,
                    // transitionInterpolator: action.viewport.transitionInterpolator,
                }
            }
        case GGConsts.MAP_STYLE:
            return {
                ...state,
                map_style: action.map_style
            }
        default:
            return state;
    }
}

export function navigationReducer(state = navigationInitState, action) {
    switch (action.type) {
        case GGConsts.NAV_TIER:
            return {
                ...state,
                nav_tier: action.nav_tier
            }
        case GGConsts.UPDATE_NAV:
            return {
                ...state,
                nav_update: action
            }
        case GGConsts.NAVIGATION:
            return {
                ...state,
                navigation: {
                    ...state.navigation,
                    ...action.navState
                }
            }

        default:
            return state;
    }
}


export function APIreducer(state = apiInitState, action) {
    switch (action.type) {
        case GGConsts.API_CALL_REQUEST:
            return { ...state,
                     fetching: true,
                     error: null,
                     uri: action.uri,
                     config: action.config,
                     resource: action.resource,
                    };
        case GGConsts.API_CALL_SUCCESS:
            return { ...state, fetching: false };
        case GGConsts.API_CALL_FAILURE:
            return { ...state, fetching: false, error: action.error };

        case 'persist/REHYDRATE':
            return { ...state, persistedState: action.payload };

        default:
            return state;
    }
}

export function dataReducer(state = [], action) {
    switch (action.type) {
        case GGConsts.COUNTRIES_MAP:
            return { ...state, [GGConsts.COUNTRIES_MAP]: action.data }
        case GGConsts.STATES_MAP:
            return { ...state, [GGConsts.STATES_MAP]: action.data }
        case GGConsts.LGAS_MAP:
            return { ...state, [GGConsts.LGAS_MAP]: action.data }
        case GGConsts.FACILITIES_MAP:
            return { ...state, [GGConsts.FACILITIES_MAP]: action.data }

        case GGConsts.SENSORS_MAP:
            return { ...state, [GGConsts.SENSORS_MAP]: action.data }
        default:
            return state;
    }
}

export const errorsReducer = (state = [], action) => {
    switch (action.type) {
        case GGConsts.DEVICE_ERRORS: {
            return {
                ...state,
                errors: action.errors
            };
        }
        default:
            return state;
    }
}

const reducers = {
    errorsReducer,
    navigationReducer,
    APIreducer,
    dataReducer,
    mapReducer
};

export default reducers;
