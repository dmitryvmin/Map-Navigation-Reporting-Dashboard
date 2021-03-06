import GGConsts from '../../Constants';

/**
 * Get the zoom leve for the current tier state
 * @returns {number} zoom
 */
function getZoom(tier) {

    const zoomMap = {
        [GGConsts.COUNTRY_LEVEL]: 5.5,
        [GGConsts.STATE_LEVEL]: 7.5,
        [GGConsts.LGA_LEVEL]: 9,
        [GGConsts.FACILITY_LEVEL]: 11,
        'default': 5.5,
    }

    const zoom = zoomMap[tier] || zoomMap.default;
    return zoom;
}

export default getZoom;
