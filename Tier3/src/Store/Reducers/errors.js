import GGConsts from '../../Constants';

const errorsReducer = (state = [], action) => {
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

export default errorsReducer;
