import GGConsts from '../../Constants';

const initState = {
    markers: []
}

function markersReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.MARKERS:
            return {
                ...state,
                markers: action.markers,
            }

        default:
            return state;
    }
}

export default markersReducer;
