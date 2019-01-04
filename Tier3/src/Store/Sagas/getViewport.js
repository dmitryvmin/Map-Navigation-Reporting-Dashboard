import _ from 'lodash';
import {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
// import {
//     FlyToInterpolator,
//     LinearInterpolator
// } from 'react-map-gl';
import {select} from 'redux-saga/effects';
import getZoom from './getZoom';
import getLocation from './getLocation';
import {viewportSelector} from './../Selectors';

/**
 * Get the location selected in the navigation
 * @param
 * @param
 */
function* getViewport(tier, navigation) {
    const zoom = getZoom(tier);
    const location = getLocation(navigation);
    const currentVP = yield select(viewportSelector, {key: 'map_viewport'});

    let coordinates = null;
    if (location.length) {
        const results = yield geocodeByAddress(location);
        coordinates = yield getLatLng(_.first(results));
    }

    const map_viewport = {
        ...currentVP,
        longitude: coordinates ? Math.abs(coordinates.lng) : currentVP.longitude,
        latitude: coordinates ? Math.abs(coordinates.lat) : currentVP.latitude,
        transitionDuration: 1000,
        // transitionInterpolator: new FlyToInterpolator(),
        zoom,
    };

    return map_viewport;
}

export default getViewport;
