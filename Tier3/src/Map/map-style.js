import {fromJS} from 'immutable';
import GGConsts from './../Constants';
import MAP_STYLE from './style.json';

const getFilterKey = type => {
    switch(type) {
        case GGConsts.COUNTRIES:
            return 'ADM0_A3_IS';
        case GGConsts.STATES:
            return 'gn_name';
        case GGConsts.LGAS:
            return 'admin2Name';
    }
}

const getSourceLayer = type => {
    switch(type) {
        case GGConsts.COUNTRIES:
            return 'ne_10m_admin_0_countries-4dnq47';
        case GGConsts.STATES:
            return 'ne_10m_admin_1_states_provinc-5n804v';
        case GGConsts.LGAS:
            return 'ngaadmbndaadm2osgof-4e7vz7';
    }
}

const getSourceUrl = type => {
    switch(type) {
        case GGConsts.COUNTRIES:
            return 'mapbox://dmitrymin.1tmjkbs7';
        case GGConsts.STATES:
            return 'mapbox://dmitrymin.d5bqzgth';
        case GGConsts.LGAS:
            return 'mapbox://dmitrymin.ak86ozz1';
    }
}

export const getMapStyle = () => {
    // Make a copy of the map style
    const map_style = {
        ...MAP_STYLE,
        sources: {...MAP_STYLE.sources},
        layers: MAP_STYLE.layers.slice()
    };

    return map_style;
}

export const applyLayerFilter = (map_style = MAP_STYLE, type = GGConsts.COUNTRIES, filter = 'all') => {

    const filterKey = getFilterKey(type);
    const sourceLayer = getSourceLayer(type);
    const sourceUrl = getSourceUrl(type);

    // Add the vector tile source
    map_style.sources[type] = {
        type: 'vector',
        url: sourceUrl
    };

    if (filter === 'all') {

        map_style.layers.splice(
            map_style.layers.findIndex(layer => layer.id === type), 0,
            {
                id: type,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: type,
                paint: {
                    'fill-outline-color': GGConsts.SELECTED_COLOR,
                    'fill-color': GGConsts.SELECTED_COLOR,
                },
                filter: ['all']
            },
        );

    } else {

        // Insert the country/state/nga layer before city labels
        map_style.layers.splice(
            map_style.layers.findIndex(layer => layer.id === type), 0,

            // Highlighted the selected county polygons
            // NOTE: instead of explicitly highlighting, just leave the 'selected' area not shaded
            // {
            //     id: type,
            //     type: 'fill',
            //     'source-layer': sourceLayer,
            //     visibility: 'visible',
            //     source: type,
            //     paint: {
            //         'fill-outline-color': GGConsts.SELECTED_COLOR,
            //         'fill-color': GGConsts.SELECTED_COLOR,
            //         // 'fill-opacity': 0.5
            //     },
            //     filter: ['in', filterKey, filter]
            // },
            // Shade the rest
            {
                id: `${type}_shaded`,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: type,
                paint: {
                    'fill-outline-color': GGConsts.SHADED_COLOR,
                    'fill-color': GGConsts.SHADED_COLOR,
                    // 'fill-opacity': 0.5
                },
                filter: ['!in', filterKey, filter]
            }
        );

    }

    return map_style;

}
