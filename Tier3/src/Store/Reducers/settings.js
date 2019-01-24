import GGConsts from '../../Constants';

const initState = {
    settings_updating: false,
    metrics_threshold: 0.8,
}

const settingsReducer = (state = initState, action) => {
    switch (action.type) {
        case GGConsts.SETTINGS_UPDATING:
            return {
                ...state,
                settings_updating: true,
            }

        case GGConsts.SETTINGS: {
            return {
                ...state,
                settings_updating: false,
                metrics_threshold: action.metrics_threshold,
            };
        }
        default:
            return state;
    }
}

export default settingsReducer;
