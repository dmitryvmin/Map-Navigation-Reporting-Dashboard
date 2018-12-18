import _ from 'lodash';
import GGConsts from '../../Constants';

/**
 * Get the zoom leve for the current tier state
 * @returns {number} zoom
 */
function getZoom(tier) {
    // const tier = yield select(getTierState);

    // TODO: Move this somewhere more fitting
    const zoomMap = {
        [GGConsts.COUNTRY_LEVEL]: 5,
        [GGConsts.STATE_LEVEL]: 7,
        [GGConsts.LGA_LEVEL]: 10,
        'default': 5,
    }

    const zoom = zoomMap[tier] || zoomMap.default;
    return zoom;
}

export default getZoom;
