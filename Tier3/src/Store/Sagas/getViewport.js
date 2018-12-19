import _ from 'lodash';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { FlyToInterpolator } from 'react-map-gl';
import getZoom from './getZoom';
import getLocation from './getLocation';

/**
 * Get the location selected in the navigation
 * @param
 * @param
 */
function* getViewport(tier, navigation) {
    const zoom = getZoom(tier);
    const location = getLocation(navigation);
    let coordinates;

    if (location.length) {
        const results = yield geocodeByAddress(location);
        coordinates = yield getLatLng(_.first(results));
    }

    const map_viewport = {
        zoom,
        pitch: 0,
        bearing: 0,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
    };

    if (location.length) {
        map_viewport.longitude = Math.abs(coordinates.lng);
        map_viewport.latitude = Math.abs(coordinates.lat);
    }

    return map_viewport;
}

export default getViewport;
