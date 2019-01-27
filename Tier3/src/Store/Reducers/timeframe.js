import GGConsts from '../../Constants';

const initState = {
    timeframe_selected: GGConsts.TIMEFRAME_3,
    timeframe_updating: false
}

function timeframeReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.UPDATE_TIMEFRAME:
            return {
                ...state,
                timeframe_updating: true,
            }

        case GGConsts.TIMEFRAME_SELECTED:
            return {
                ...state,
                timeframe_updating: false,
                timeframe_selected: action.timeframe_selected,
            }

        default:
            return state;
    }
}

export default timeframeReducer;
