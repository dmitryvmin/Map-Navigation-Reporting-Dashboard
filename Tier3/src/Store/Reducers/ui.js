import GGConsts from '../../Constants';

function uiReducer(state = [], action) {
    switch (action.type) {
        case GGConsts.MAP_CLICKED:
            return {
                ...state,
                map_click: action.prop
            }
        default:
            return state;
    }
}

export default uiReducer;