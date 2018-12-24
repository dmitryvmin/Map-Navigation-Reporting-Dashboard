import GGConsts from '../../Constants';

const initState = {
    layers_updating: false,
    active_layers: [],
    inactive_layers: [],
}

function layersReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.UPDATE_LAYERS:
            return {
                ...state,
                layers_updating: true,
            }

        case GGConsts.ACTIVE_LAYERS:
            return {
                ...state,
                active_layers: action.active_layers,
                layers_updating: false,
            }

        case GGConsts.INACTIVE_LAYERS:
            return {
                ...state,
                inactive_layers: action.inactive_layers,
                layers_updating: false,
            }

        default:
            return state;
    }
}

export default layersReducer;
