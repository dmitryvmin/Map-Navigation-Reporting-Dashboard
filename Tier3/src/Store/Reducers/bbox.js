import GGConsts from '../../Constants';

const initState = {
    bbox: [],
    bbox_updating: false
}

function bboxReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.BBOX_UPDATING:
            return {
                ...state,
                bbox_updating: true,
            }

        case GGConsts.BBOX:
            return {
                ...state,
                bbox_updating: false,
                bbox: action.bbox,
            }

        default:
            return state;
    }
}

export default bboxReducer;
