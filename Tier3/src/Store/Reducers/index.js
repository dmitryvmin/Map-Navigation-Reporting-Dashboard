import { combineReducers } from "redux";
import _ from 'lodash';
import GGConsts from '../../Constants';


// reducer with initial state
// TODO: create initial state for all the reducers and move them to their own files
const initialState = {
    fetching: false,
    data: null,
    error: null
};

const navigationInitState = {
    country_selected: {name: 'all'},
    state_selected: {name: 'all'},
    map_viewport: {
        // flyTo: {center: [47.6144828, -122.3286736], zoom: 10, speed: 1.5},
        width: '100%',
        height: 712,
        latitude: 9.077751,
        longitude: 8.6774567,
        zoom: 5
    }
}

export function navigationReducer(state = navigationInitState, action) {
    switch (action.type) {
        case GGConsts.NAV_COUNTRY_SELECTED:
            return {
                ...state,
                country_selected: action.country_selected
            }
        case GGConsts.NAV_STATE_SELECTED:
            return {
                ...state,
                state_selected: action.state_selected
            }
        case GGConsts.NAV_LGA_SELECTED:
            return {
                ...state,
                lga_selected: action.lga_selected
            }
        case GGConsts.NAV_FACILITY_SELECTED:
            return {
                ...state,
                facility_selected: action.facility_selected
            }
        case GGConsts.NAV_MANUFACTURER_SELECTED:
            return {
                ...state,
                lga_manufacturer: action.manufacturer_selected
            }
        case 'MAP_VIEWPORT':

            return {
                ...state,
                map_viewport: {
                    ...state.map_viewport,
                    latitude: action.viewport.latitude,
                    longitude: action.viewport.longitude,
                    zoom: action.viewport.zoom,
                    // transitionDuration: action.viewport.transitionDuration,
                    // transitionInterpolator: action.viewport.transitionInterpolator,
                }
            }
        default:
            return state;
    }
}


export function APIreducer(state = initialState, action) {
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
};

export default reducers;
