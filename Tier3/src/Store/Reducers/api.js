import GGConsts from '../../Constants';

const initState = {
    fetching: false,
    data: null,
    error: null
};

function APIreducer(state = initState, action) {
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

export default APIreducer;
