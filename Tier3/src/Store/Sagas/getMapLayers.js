import {GeoJsonLayer} from 'deck.gl';
import GGConsts from '../../Constants';
import statesData from './../../Map/statesData.json';
import lgasData from './../../Map/lgasData.json';

const getMapLayers = (tier, navigation) => {

        debugger;

        const layers = [];

        let selected = null;

        const _onHover = ({x, y, object}) => {
            debugger;
            // object && this.setState({x, y, hoveredObject: object, selected_state: object.properties.admin1Name});
        }

        const _onClick = e => {
            console.log(e.object.properties);
        }

        // At country level, we show all the states
        if (GGConsts.COUNTRY_LEVEL) {


            const statesLayer = new GeoJsonLayer({
                id: `states`,
                data: statesData,
                opacity: 0.8,
                stroked: true,
                filled: true,
                extruded: true,
                wireframe: true,
                fp64: true,
                getLineColor: [255, 255, 255],
                getFillColor: f => (f.properties.admin1Name === selected) ? [255, 255, 0] : [199, 233, 180],
                updateTrigger: {
                    getFillColor: selected
                },
                pickable: true,
                onHover: _onHover,
                onClick: _onClick,
            });


        }

        // data.map(d => {
        //     // console.log('@@ name', d.properties.name,admin1Name);
        //     layers.push(new GeoJsonLayer({
        //         id: `geojson-${selected}`,
        //         data: d,
        //         opacity: 0.8,
        //         stroked: false,
        //         filled: true,
        //         extruded: true,
        //         wireframe: true,
        //         fp64: true,
        //         getLineColor: [255, 255, 255],
        //         getFillColor: f => (f.properties.admin1Name === selected) ? [255, 255, 0] : [199, 233, 180],
        //         updateTrigger: {
        //             getFillColor: selected
        //         },
        //         pickable: true,
        //         // onHover: this._onHover,
        //         // onClick: this._onClick,
        //     }))
        // });

        // FACILITIES.map(d => {
        //     layers.push(new ScatterplotLayer({
        //         id: 'geojson-facilities',
        //         data: d,
        //         radiusScale: 20,
        //         getPosition: d => ({longitude: d.coordinates.longitude, latitude: d.coordinates.latitude}),
        //         getColor: [255, 140, 0],
        //         pickable: true,
        //         // onHover: this._onHover
        //     }))
        // })

        return layers;

}

export default getMapLayers;
