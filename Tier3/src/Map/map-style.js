import {fromJS} from 'immutable';
import GGConsts from './../Constants';
import MAP_STYLE from './style.json';

import { getFilterKey, getCountryCode } from './../Utils';

const getSourceLayer = type => {
    switch(type) {
        case 'country_selected':
            return 'ne_10m_admin_0_countries-4dnq47';
        case 'state_selected':
            return 'ne_10m_admin_1_states_provinc-5n804v';
        case 'lga_selected':
            return 'ngaadmbndaadm2osgof-4e7vz7';
    }
}

const getSourceUrl = type => {
    switch(type) {
        case 'country_selected':
            return 'mapbox://dmitrymin.1tmjkbs7';
        case 'state_selected':
            return 'mapbox://dmitrymin.d5bqzgth';
        case 'lga_selected':
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

export const getFilter = (mode, type, value) => {
    const filter = { mode };

    filter.fkey = getFilterKey(type);

    if (type === 'country_selected') {
        filter.fval = getCountryCode(value);
    } else {
        filter.fval = value;
    }

    return filter;
}

export const getChildFilter = (mode, type, value) => {
    const filter = { mode };

    if (type === 'state_selected') {
        filter.fkey = 'adm0_a3';
        filter.fval = getCountryCode(value);
    }

    if (type === 'lga_selected') {
        filter.fkey = 'admin1Name';
        filter.fval = value.replace(/.(state)$/i, '');
    }

    return filter;
}

export const applyLayerFilter = (map_style = MAP_STYLE, type = 'country_selected', filter = {mode: 'exclude', fkey: null, fval: 'all'}) => {
    const { mode, fkey, fval } = filter;
    const sourceLayer = getSourceLayer(type);
    const sourceUrl = getSourceUrl(type);

    // Add the vector tile source
    map_style.sources[`${type}-${mode}`] = {
        type: 'vector',
        url: sourceUrl
    };

    if (mode === 'exclude') {

        map_style.layers.splice(
            map_style.layers.findIndex(layer => layer.id === type), 0,

            // Highlighted the unselected but visible polygons DESELECTED_COLOR
            {
                id: `${type}-${mode}`,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: `${type}-${mode}`,
                paint: {
                    'fill-outline-color': (fkey === 'gn_name') ? 'white' : '#4e4e4e',
                    'fill-color': (fkey === 'ADM0_A3') ? GGConsts.OFF_COLOR : GGConsts.DESELECTED_COLOR,
                },
                filter: ['!in', fkey, fval],
            },
        );

    } else if (mode === 'include') {

        map_style.layers.splice(
            map_style.layers.findIndex(layer => layer.id === type), 0,

            // Highlighted the selected polygons SELECTED_COLOR
            {
                id: `${type}-${mode}`,
                type: 'fill',
                'source-layer': sourceLayer,
                visibility: 'visible',
                source: `${type}-${mode}`,
                paint: {
                    'fill-outline-color': '#4e4e4e',
                    'fill-color': GGConsts.SELECTED_COLOR,
                    "fill-opacity": ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        1,
                        0.5
                    ]

                },
                filter: ['in', fkey, fval],
            },
        );

    }

    return map_style;

}
