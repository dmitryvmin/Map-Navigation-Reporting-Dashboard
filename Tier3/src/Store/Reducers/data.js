import GGConsts from '../../Constants';

const initState = {
    sensors_map: [],
    geo_map: {
        countries: [],
        states: [],
        lgas: [],
        facilities: [],
    },
    mfc_map: [],
}

function dataReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.COUNTRIES_MAP:
            return { ...state, [GGConsts.COUNTRIES_MAP]: action.data }

        case GGConsts.STATES_MAP:
            return { ...state, [GGConsts.STATES_MAP]: action.data }

        case GGConsts.LGAS_MAP:
            return { ...state, [GGConsts.LGAS_MAP]: action.data }

        case GGConsts.FACILITIES_MAP:
            return { ...state, [GGConsts.FACILITIES_MAP]: action.data }

        case GGConsts.GEO_MAP:  // TODO:  append marker lat long here.!!! 
            return {
                ...state,
                geo_map: {
                    ...state.geo_map,
                    ...action.data
                }
            }

        case GGConsts.SENSORS_MAP:
            return {
                ...state,
                sensors_map: action.data
            }

        case GGConsts.MFC_MAP:
            return {
                ...state,
                mfc_map: action.data
            }

        default:
            return state;
    }
}

export default dataReducer;
