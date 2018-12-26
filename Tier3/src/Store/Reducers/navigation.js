import GGConsts from '../../Constants';

const initState = {
    nav_tier: null,
    nav_hover: {
        value: null,
        x: null,
        y: null,
    },
    nav_updating: false,
    navigation: {
        country_selected: 'Nigeria',
        state_selected: 'All',
        lga_selected: null,
        facility_selected: null,
    }
}

function navigationReducer(state = initState, action) {
    switch (action.type) {
        case GGConsts.NAV_TIER:
            return {
                ...state,
                nav_tier: action.nav_tier
            }

        case GGConsts.UPDATE_NAV:
            return {
                ...state,
                nav_updating: true,
            }

        case GGConsts.NAV_HOVER:
            return {
                ...state,
                nav_hover: {
                    value: action.nav_hover.value ? action.nav_hover.value : state.nav_hover.value,
                    x: action.nav_hover.x ? action.nav_hover.x : state.nav_hover.x,
                    y: action.nav_hover.y ? action.nav_hover.y : state.nav_hover.y,
                }
            }

        case GGConsts.NAVIGATION:
            return {
                ...state,
                nav_updating: false,
                navigation: {
                    ...action.navigation,
                }
            }

        default:
            return state;
    }
}

export default navigationReducer;
