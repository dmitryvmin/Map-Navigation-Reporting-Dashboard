import GGConsts from '../Constants';
import React, {Component} from 'react';
import {connect} from "react-redux";
import styled from 'styled-components';
import _ from 'lodash';
import {StaticMap, Marker} from 'react-map-gl';
// import {MapboxLayer} from '@deck.gl/mapbox';
// import DeckGLOverlay from './deckgl-overlay.js';
import DeckGL, {GeoJsonLayer} from 'deck.gl';
import {MapboxLayer} from '@deck.gl/mapbox';

import {
    navigationMap,
    getGeoJson,
    getNMapChild,
    getNMap,
    getNMapParent,
} from './../Utils';

import {
    setMapViewport,
    // saveMapRef,
} from './../Store/Actions';

// import {addToGL} from './MapUtils';
// import IconClusterLayer from './IconClusterLayer';
// import iconMapping from '../Data/location-icon-mapping.json';
import LocationPin from './Pin';
import POITooltip from './Tooltip';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldUpdateGLContext: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.hover && (prevState.hover && prevState.hover.value) !== (nextProps.hover && nextProps.hover.value)) {
            return {
                shouldUpdateGLContext: true
            };
        } else {
            return {
                shouldUpdateGLContext: false
            };
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //const {bbox} = this.props;

        if (prevState.shouldUpdateGLContext) {
            this.updateGLContext();
        }
    }

    onViewStateChange = ({viewState}) => {
        this.props.setMapViewport({...viewState, transitionDuration: 0});
    }

    // DeckGL and mapbox will both draw into this WebGL context
    onWebGLInitialized = (gl) => {
        this.setState({gl});
    }

    addToGL = (layers) => {

        const loaded = this._map.isStyleLoaded();

        if (loaded) {
            layers.forEach(layer => {
                let id = layer.id;
                // https://www.mapbox.com/mapbox-gl-js/api/#map#addlayer
                // Doesn't seem to add deck layers properly
                // if a `before` arg is not provided
                let deck = this._deck;

                this._map.addLayer(new MapboxLayer({id, deck}), 'water');
            });
        }
    }

    updateGLContext = () => {
        const {
            tier
        } = this.props;

        // TODO: more quick error handling for LGA tier, pretty up
        if (tier !== GGConsts.LGA_LEVEL) {

            const layers = this.renderLayers(this.props, this.onLayerChange);

            if (this._map && this._deck && layers.length) {
                this.addToGL(layers);
            }
        }
    }

    // Add Deck layer to mapbox
    onMapLoad = () => {
        this.updateGLContext();
    }

    onLayerChange = (info, ui) => {
        const {x, y, object} = info;
        if (!object) {
            return null;
        }

        // ###
        // TODO: optimize - tag each geojson polygon with a `tier - location` ID for faster look up
        const {tier} = this.props;

        if (tier === GGConsts.LGA_LEVEL || tier === GGConsts.FACILITY_LEVEL) {
            return;
        }

        const NMchild = getNMapChild(tier, 'tier');

        let value = object.properties[NMchild.code];
        let type;

        if (value) {
            type = NMchild.type;
        } else {
            const NMparent = getNMap(tier, 'tier');
            value = object.properties[NMparent.code];
            type = NMparent.type;
        }
        // ###

        if (!value) {
            console.log(`%c something wrong with the hovered location: ${value}`, GGConsts.CONSOLE_ERROR);
        } else {

            if (ui === 'hover') {
                const {hover} = this.props;

                if (!hover.value || hover.value !== value) {
                    this.props.navHovered({value, x, y});
                }
            }
            else if (ui === 'click') {
                this.props.updateNav(type, value);
            }
        }
    }

    makeGeoLayer = (layerType, map, data, hover) => {
        let val = hover ? hover.value : null;
        let id = (val) ? `${map.tier}_hover_${val}` : `${map.tier}`;

        const activeColor = (layerType === 'active') ? GGConsts.COLOR_SELECTED : [175, 175, 175];
        const inactiveColor = (layerType === 'active') ? [255, 255, 255] : [200, 200, 200];

        return new GeoJsonLayer({
            id,
            data,
            opacity: 0.8,
            stroked: true,
            filled: true,
            extruded: false,
            wireframe: false,
            fp64: true,
            lineWidthMinPixels: 1,
            getLineColor: [175, 175, 175],
            getFillColor: f => (f.properties[map.code] === val) ? activeColor : inactiveColor,
            updateTrigger: {getFillColor: val},
            pickable: true,
            onHover: info => this.onLayerChange(info, 'hover'),
            onClick: info => this.onLayerChange(info, 'click')
        })
    }

    getGeoLayers = (navigation, type, hover) => {
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
            if (parentNM) {
                data = data.filter(f => f.properties[parentNM.code] === navigation[parentNM.type]);
            }

            const activeLayer = this.makeGeoLayer('active', NM, data, hover);

            return activeLayer;
        }
        else {
            data = data.filter(f => f.properties[NM.code] !== selected);
            const inactiveLayer = this.makeGeoLayer('inactive', NM, data, hover);

            return inactiveLayer;
        }
    }

    renderLayers = () => {

        const {
            navigation,
            hover,
        } = this.props;

        const layers = _.toArray(navigationMap).reduce((acc, cur) => {
            let layer = this.getGeoLayers(navigation, cur.type, hover);
            if (layer) acc.push(layer);
            return acc;
        }, []);

        return layers;
    }

    getCohort = () => {
        const {
            display_data,
            hover,
            tier,
        } = this.props;

        if (!hover.value || tier === GGConsts.LGA_LEVEL || tier === GGConsts.FACILITY_LEVEL) {
            return null;
        }

        const NMchild = getNMapChild(tier, 'tier');
        const filtered = display_data.cells.filter(f => f[NMchild.map] === hover.value);
        const cohort = filtered.length ? filtered[0] : null;

        return cohort;

    }

    render() {
        const {
            viewState,
            mapStyle,
            markers,
            hover,
        } = this.props;

        const {gl} = this.state;
        const cohort = this.getCohort();

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
                        // mapStyle="mapbox://styles/mapbox/light-v9"
                        mapStyle={mapStyle}
                        onLoad={this.onMapLoad}
                        mapboxApiAccessToken={GGConsts.MAPBOX_TOKEN}
                    >
                        {!_.isEmpty(markers) && markers.map((m, i) =>
                            <Marker
                                gl={gl}
                                key={`marker-${i}`}
                                longitude={m.longitude}
                                latitude={m.latitude}
                            >
                                <LocationPin
                                    
                                    marker={m}
                                    zoom={viewState.zoom}
                                />
                            </Marker>
                        )}
                    </StaticMap>
                    }
                    {cohort &&
                        <POITooltip
                            hover={hover}
                            cohort={cohort}
                        />
                    }
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
        // map_ref: state.mapReducer.map_ref,
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
        bbox: state.bboxReducer.bbox,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMapViewport: (map_viewport) => dispatch(setMapViewport(map_viewport)),
        // saveMapRef: (map_ref) => dispatch(saveMapRef(map_ref)),
        navHovered: (nav_hover) => dispatch({type: GGConsts.NAV_HOVER, nav_hover}),
        updateNav: (navType, navVal) => dispatch({type: GGConsts.UPDATE_NAV, [navType]: navVal}),
    }
}

const MapContainer = styled.div`
    width: 100%; 
    height: 100%; 
`;

export default connect(mapStateToProps, mapDispatchToProps)(Map);
