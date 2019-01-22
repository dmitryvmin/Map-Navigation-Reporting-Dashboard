import _ from 'lodash';
import GGConsts from '../../Constants';
import onLayerHover from './updateHover';
import onLayerClick from './updateClick';

import {
    select,
    put,
} from 'redux-saga/effects';
import {GeoJsonLayer} from 'deck.gl';

import {
    navSelector,
    tierSelector,
    hoverSelector,
} from './../Selectors';

import {
    navigationMap,
    getGeoJson,
    getNMapChild,
    getNMap,
    getNMapParent,
} from './../../Utils';

function* renderLayers() {

    const nav = yield select(navSelector);
    const tier = yield select(tierSelector);
    const hover = yield select(hoverSelector);

    const makeGeoLayer = function (map, data, hover) {
        let val = hover ? hover.value : null;
        let id = (val) ? `${map.tier}_hover_${val}` : `${map.tier}`;

        return new GeoJsonLayer({
            id,
            data,
            opacity: 0.5,
            stroked: true,
            filled: true,
            extruded: false,
            wireframe: false,
            fp64: true,
            lineWidthMinPixels: 1.5,
            getLineColor: [100, 100, 100],
            getFillColor: f => (f.properties[map.code] === val) ? [235, 78, 120] : [199, 233, 180],
            updateTrigger: {getFillColor: val},
            pickable: true,
            // onHover: info => {
            //     onLayerHover(info)
            // }
            // onClick: info => console.log('Clicked:', info)
        })
    }

    const getGeoLayers = (type) => {
        const selected = nav[type];
        if (!selected || type === 'facility_selected') {
            return;
        }

        const NM = getNMap(type, 'type');
        let data = getGeoJson(NM.type);
        if (!data) {
            return;
        }

        if (selected === 'All') {
            // filter by parent
            let parentNM = getNMapParent(type, 'type');
            if (parentNM) data = data.filter(f => f.properties[parentNM.code] === nav[parentNM.type]);

            makeGeoLayer(NM, data, hover);
        }
        // else {
        //     data = data.filter(f => {
        //         return ( f.properties[NM.code] !== selected );
        //     });
        //     layer = makeGeoLayer(NM, data, hover);
        // }
    }

    // const layers = [];
    // for (let n of _.toArray(navigationMap)) {
    //
    //     let layer = yield getGeoLayers(n.type);
    //     if (layer) layers.push(layer);
    //
    // }


    const layers = _.toArray(navigationMap).reduce((acc, cur) => {
        let layer = getGeoLayers(cur.type);

        if (layer) acc.push(layer);
        return acc;
    }, []);

    // if ( this._map && this._deck) {
    //     let t = this;
    //     debugger;
    //     this._map.addLayer(layers[1], 'test123');
    //     this._deck.setProps({
    //         layers: layers[1]
    //     });
    //
    //     debugger;
    // }

    return layers;
}

export default renderLayers;
