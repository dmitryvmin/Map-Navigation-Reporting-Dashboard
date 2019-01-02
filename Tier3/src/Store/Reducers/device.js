import GGConsts from '../../Constants';

const initState = {
    device_type_selected: GGConsts.DEVICE_TYPE_ALL,
    device_type_updating: false,
    selected_connected: false,
    selected_uploaded: false,
}

function deviceReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.UPDATE_DEVICE_TYPE:
            return {
                ...state,
                device_type_updating: true,
            }

        case GGConsts.DEVICE_TYPE_SELECTED:
            return {
                ...state,
                device_type_updating: false,
                device_type_selected: action.device_type_selected,
            }

        case GGConsts.DEVICE_TYPE_CONNECTED:
            return {
                ...state,
                selected_connected: !state.selected_connected,
            }

        case GGConsts.DEVICE_TYPE_UPLOADED:
            return {
                ...state,
                selected_uploaded: !state.selected_uploaded,
            }

        default:
            return state;
    }
}

export default deviceReducer;
