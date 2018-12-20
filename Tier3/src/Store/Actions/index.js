import GGConsts from './../../Constants';

export const setMapViewport = map_viewport => {
    return {
        type: GGConsts.MAP_VIEWPORT,
        map_viewport: {
            ...map_viewport,
            transitionDuration: 0,
        },
    }
};

export const mapClicked = nav_click => {
    return {
        type: GGConsts.MAP_CLICKED,
        nav_click,
    }
}

export const navHovered = nav_hover => {
    return {
        type: GGConsts.NAV_HOVER,
        nav_hover,
    }
}