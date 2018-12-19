import GGConsts from '../../Constants';

const initState = {
    metric_selected: GGConsts.METRIC_ALARMS,
    metric_updating: false
}

function metricReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.UPDATE_METRIC:
            return {
                ...state,
                metric_updating: true,
            }

        case GGConsts.METRIC_SELECTED:
            return {
                ...state,
                metric_updating: false,
                metric_selected: action.metric_selected,
            }

        default:
            return state;
    }
}

export default metricReducer;
