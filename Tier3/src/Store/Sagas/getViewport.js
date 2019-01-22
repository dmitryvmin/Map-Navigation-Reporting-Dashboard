import _ from 'lodash';
import {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
// import {
//     FlyToInterpolator,
//     LinearInterpolator
// } from 'react-map-gl';
// import WebMercatorViewport from 'viewport-mercator-project';
import {WebMercatorViewport} from 'deck.gl';

import {
    select,
    call,
} from 'redux-saga/effects';
import getZoom from './getZoom';
import getLocation from './getLocation';
import {viewportSelector} from './../Selectors';
import getBBox from './getBBox';

/**
 * Get the location selected in the navigation
 * @param
 * @param
 */
function* getViewport(tier, navigation) {
    let longitude, latitude, zoom;
    const currentVP = yield select(viewportSelector, {key: 'map_viewport'});
    const bbox = yield call(getBBox, tier, navigation);

    if (bbox) {
        // https://github.com/uber/deck.gl/blob/master/docs/api-reference/web-mercator-viewport.md
        const viewport = new WebMercatorViewport(
            {
                width: currentVP.width,
                height: currentVP.height,
            }
        )
        const bounds = viewport.fitBounds(bbox, {
            // offset: [0, 10],
            padding: 5
        });

        longitude = bounds.longitude;
        latitude = bounds.latitude;
        zoom = bounds.zoom;

    }
    else {
        const location = getLocation(navigation);
        let coordinates = null;

        if (location.length) {
            const results = yield geocodeByAddress(location);
            coordinates = yield getLatLng(_.first(results));
        }

        longitude = coordinates ? Math.abs(coordinates.lng) : currentVP.longitude;
        latitude = coordinates ? Math.abs(coordinates.lat) : currentVP.latitude;
        zoom = yield getZoom(tier, location);
    }

    const map_viewport = {
        ...currentVP,
        longitude,
        latitude,
        zoom,
        transitionDuration: 1000,
        // transitionInterpolator: new FlyToInterpolator(),
    };

    return map_viewport;
}

export default getViewport;
