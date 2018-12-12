import GGConsts from './../../Constants';

export const setMapViewport = (map_viewport) => {
    return {
        type: GGConsts.MAP_VIEWPORT,
        map_viewport,
    }
};

export const mapClicked = (prop) => {
    return {
        type: GGConsts.MAP_CLICKED,
        prop
    }
}

