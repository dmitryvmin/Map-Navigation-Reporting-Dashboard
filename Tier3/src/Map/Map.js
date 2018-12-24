import GGConsts from '../Constants';
import React, {Component} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import _ from 'lodash';
import ReactMapGL, {StaticMap, Marker} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';
import DeckGLOverlay from './deckgl-overlay.js';
import DeckGL, {GeoJsonLayer} from 'deck.gl';

import {
    navigationMap,
    getGeoJson,
    getNMapChild,
    getNMap,
    getNMapParent,
} from './../Utils';

import {setMapViewport} from './../Store/Actions';
import {
    makeActiveGeoLayer,
    makeInactiveGeoLayer,
} from './../Store/Sagas/getDeckLayers';

import IconClusterLayer from './IconClusterLayer';
import iconMapping from '../Data/location-icon-mapping.json';
import CityPin from './Pin';
import POITooltip from './Tooltip';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    // componentDidMount() {
    //     window.addEventListener('resize', this.resize);
    //     this.resize();
    // }
    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.resize);
    // }
    // resize = () => {
    //     const {map_viewport} = this.props;
    //
    //     this.props.setMapViewport({
    //         ...map_viewport,
    //         width: map_viewport.width || window.innerWidth,
    //         height: map_viewport.height || window.innerHeight
    //     });
    // }
    onViewStateChange = ({viewState}) => {
        this.props.setMapViewport({...viewState});
    }
    // DeckGL and mapbox will both draw into this WebGL context
    onWebGLInitialized = (gl) => {
        this.setState({gl});
    }
    addToGL = () => {
        const map = this._map;
        const deck = this._deck;
        const layers = this.renderLayers();

        if (map && deck && layers) {
            layers.forEach(layer => {
                let id = layer.id;
                map.addLayer(new MapboxLayer({id, deck}), 'water');
            });
        }
    }
    // Add deck layer to mapbox
    onMapLoad = () => this.addToGL();

    onLayerChange = (info, ui) => {
        const {x, y, object} = info;
        if (!object) {
            return null;
        }

        const {tier} = this.props;
        const NMchild = getNMapChild(tier, 'tier');

        let value = object.properties[NMchild.code]
        let type;

        if (value) {
            type = NMchild.type;
        } else {
            const NMparent = getNMap(tier, 'tier');
            value = object.properties[NMparent.code];
            type = NMparent.type;
        }

        if (!value) {
            console.log(`%c something wrong with the hovered location: ${value}`, 'background: #c50018; color: white; display: block;');
        } else {

            if (ui === 'hover') {
                this.props.navHovered({value, x, y});
            }
            else if (ui === 'click') {
                this.props.updateNav(type, value);
            }

            this.addToGL();
        }
    }

    renderLayers = () => {

        const {
            navigation,
            tier,
            hover
        } = this.props;

        const makeGeoLayer = (map, data, hover) => {
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
                onHover: info => this.onLayerChange(info, 'hover'),
                onClick: info => this.onLayerChange(info, 'click')
            })
        }

        const getGeoLayers = (type) => {
            const selected = navigation[type];
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
                if (parentNM) data = data.filter(f => f.properties[parentNM.code] === navigation[parentNM.type]);

                const activeLayer =  makeGeoLayer(NM, data, hover);
                return activeLayer;
            }
            // else {
            //     data = data.filter(f => {
            //         return ( f.properties[NM.code] !== selected );
            //     });
            //     layer = makeInactiveGeoLayer(NM, data, hover);
            // }
        }

        const layers = _.toArray(navigationMap).reduce((acc, cur) => {
            let layer = getGeoLayers(cur.type);
            if (layer) acc.push(layer);
            return acc;
        }, []);

        return layers;
    }

    render() {
        const {
            viewState,
            mapStyle,
            markers,
            active_layers,
        } = this.props;

        const {gl} = this.state;

        return (
            <MapContainer>
                <DeckGL
                    viewState={viewState}
                    controller={true}
                    onViewStateChange={this.onViewStateChange}
                    ref={(ref) => {
                        this._deck = ref && ref.deck  // reference to the Deck instance
                    }}
                    layers={this.renderLayers()}
                    onWebGLInitialized={this.onWebGLInitialized}
                >
                    {gl && <StaticMap
                        ref={ref => {
                            this._map = ref && ref.getMap(); // reference to the mapboxgl.Map instance
                        }}
                        preventStyleDiffing={true}
                        reuse
                        gl={gl}
                        mapStyle="mapbox://styles/mapbox/light-v9" // mapStyle={mapStyle}
                        onLoad={this.onMapLoad}
                        mapboxApiAccessToken={GGConsts.MAPBOX_TOKEN}>
                        {!_.isEmpty(markers) && markers.map((m, i) =>
                            <Marker
                                gl={gl}
                                key={`marker-${i}`}
                                longitude={m.longitude}
                                latitude={m.latitude}>
                                <CityPin
                                    value={m.value}
                                    chart={m.chart}
                                    zoom={viewState.zoom}
                                    name={m.name}
                                />
                            </Marker>
                        )}
                    </StaticMap>
                    }
                    <POITooltip />
                </DeckGL>
            </MapContainer>
        );
    }
}

const mapStateToProps = state => {
    return {
        viewState: state.mapReducer.map_viewport,
        mapStyle: state.mapReducer.map_style,
        layers: state.mapReducer.map_layers,
        country_selected: state.navigationReducer.country_selected,
        state_selected: state.navigationReducer.state_selected,
        lga_selected: state.navigationReducer.lga_selected,
        navigation: state.navigationReducer.navigation,
        tier: state.navigationReducer.nav_tier,
        hover: state.navigationReducer.nav_hover,
        display_data: state.displayReducer.display_data,
        metric_selected: state.metricReducer.metric_selected,
        markers: state.markersReducer.markers,
        active_layers: state.layersReducer.active_layers,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMapViewport: (map_viewport) => dispatch(setMapViewport(map_viewport)),
        navHovered: (nav_hover) => dispatch({type: GGConsts.NAV_HOVER, nav_hover}),
        updateNav: (navType, navVal) => dispatch({type: GGConsts.UPDATE_NAV, [navType]: navVal}),
    }
}

const MapContainer = styled.div`
    width: 100%; 
    height: 100%; 
`;


export default connect(mapStateToProps, mapDispatchToProps)(Map);
