import {MapboxLayer} from '@deck.gl/mapbox';

export const addToGL = (mapbox, deck, layers) => {

    const loaded = mapbox.isStyleLoaded();

    if (loaded) {
        layers.forEach(layer => {
            let id = layer.id;
            // https://www.mapbox.com/mapbox-gl-js/api/#map#addlayer
            // Doesn't seem to add deck layers properly
            // if a before arg is not provided
            mapbox.addLayer(new MapboxLayer({id, deck}), 'water');
        });
    }
}

