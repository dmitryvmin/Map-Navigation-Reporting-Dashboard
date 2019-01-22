import L from 'leaflet';
import {
    getGeoJson,
    getNMap,
} from './../../Utils';

/**
 * Gets the bounding box object from the selected geojson multipolygon
 * https://docs.mapbox.com/mapbox-gl-js/api/#lnglatboundslike
 * http://turfjs.org/docs/
 *
 * @param {string} nav_tier
 * @param {object} navigation
 * @returns {object} - bbox
 */
function getBBox(nav_tier, navigation) {

    const NM = getNMap(nav_tier, 'tier');
    const geoJson = getGeoJson(NM.type);
    const selected = geoJson.filter(f => f.properties[NM.code] === navigation[NM.type]);

    if (selected && !selected.length) {
        return null;
    }

    const polygon = L.polygon(selected[0].geometry['coordinates']);

    // [SWNE]
    const bounds = polygon.getBounds();
    // [SW, NE]
    const bbox = [[bounds._northEast.lat, bounds._northEast.lng], [bounds._southWest.lat, bounds._southWest.lng]];

    return bbox;

}

export default getBBox;
