import GGConsts from '../Constants';
import React, {Component} from 'react';
import {StaticMap, Marker} from 'react-map-gl';
import DeckGL, {
    MapView,
    FirstPersonView,
    OrbitView,
    MapController,
    FlyToInterpolator,
    GeoJsonLayer,
    IconLayer,
    ScreenGridLayer
} from 'deck.gl';

import {
    navigationMap,
    getGeoJson,
    getNMapChild,
    getNMap,
    getNMapParent,
} from './../Utils';

import {connect} from "react-redux";
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import _ from 'lodash';
import CityPin from './Pin';
import IconClusterLayer from './IconClusterLayer';

import {
    setMapViewport,
    mapClicked,
    navHovered
} from './../Store/Actions';

import markerData from '../Data/statesData.json';
import icon from '../Images/location-icon-atlas.png';
import iconMapping from '../Data/location-icon-mapping.json';

import lgasData from '../Data/lgasData.json';

import * as turf from '@turf/turf';

const colorRange = [
    [255, 255, 178, 25],
    [254, 217, 118, 85],
    [254, 178, 76, 127],
    [253, 141, 60, 170],
    [240, 59, 32, 212],
    [189, 0, 38, 255]
];

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                orthographic: false,
                multiview: false,
                infovis: false,
                useDevicePixels: true,
                pickingRadius: 0,
                drawPickingColors: false,

                // Model matrix manipulation
                separation: 0,
                rotationZ: 0,
                rotationX: 0
            },
            markers: [],
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _resize = () => {
        this.setState({
            viewState: {
                ...this.state.viewState,
                width: this.props.width || window.innerWidth,
                height: this.props.height || window.innerHeight
            }
        });
    }

    _onStyleChange(style) {
        this._interruptionStyle = style;
    }

    _onViewStateChange = ({viewState}) => {
        this.props.setMapViewport({...viewState});
    }

    _renderTooltip = () => {
        const {
            x,
            y,
            value
        } = this.props.hover;

        if (!x || !y || !value) {
            return null;
        }

        return (
            <Tooltip x={x} y={y}>
                <div>{value}</div>
            </Tooltip>
        );
    }

    _onLayerHover = ({x, y, object}) => {
        if (!object) {
            return null;
        }

        const {
            tier,
            hover
        } = this.props;

        const NMchild = getNMapChild(tier, 'tier');
        let value;
        value = object.properties[NMchild.code]

        if (!value) {
            const NMparent = getNMap(tier, 'tier');
            value = object.properties[NMparent.code];
        }

        if (!value) {
            console.log(`%c something wrong with the hovered location: ${value}`, 'background: #c50018; color: white; display: block;');
        } else {
            this.props.navHovered({value, x, y});
        }
    }

    // TODO: refactor - same as hover
    _onLayerClick = ({x, y, object}) => {
        if (!object) {
            return null;
        }

        const {
            tier,
        } = this.props;

        const NMchild = getNMapChild(tier, 'tier');
        let value, type;
        value = object.properties[NMchild.code];

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
            this.props.updateNav(type, value);
        }
    }

    // DeckGL and mapbox will both draw into this WebGL context
    _onWebGLInitialized = (gl) => {
        this.setState({gl});
    }

    _renderLayers = () => {
        const {
            tier,
            navigation,
            hover,
            viewState
        } = this.props;

        const layers = [];

        const makeActiveGeoLayer = (map, data) => {
            return new GeoJsonLayer({
                id: `${map.tier}-active-${hover && hover.value}`,
                data,
                opacity: 0.05,
                stroked: true,
                filled: true,
                extruded: false,
                wireframe: false,
                fp64: true,
                // getLineWidth: 1,
                // getElevation: 30,
                // lineWidthScale: 20,
                lineWidthMinPixels: 1,
                getLineColor: [160, 160, 160],
                getFillColor: f => (f.properties[map.code] === hover.value) ? [255, 255, 0] : [199, 233, 180],
                updateTrigger: {getFillColor: hover.value},
                pickable: true,
                onHover: this._onLayerHover,
                onClick: this._onLayerClick,
            })
        }

        const makeInactiveGeoLayer = (map, data) => {
            return new GeoJsonLayer({
                id: `${map.tier}-inactive-${hover && hover.value}`,
                data,
                opacity: 0.05,
                stroked: true,
                filled: true,
                extruded: false,
                wireframe: true,
                fp64: true,
                lineWidthMinPixels: 1,
                getLineColor: [100, 100, 100],
                // getFilterValue: f => f.properties[map.code],
                getFillColor: f => {
                    return (f.properties[map.code] === hover.value) ? [50, 50, 50] : [105, 105, 105]
                },
                updateTrigger: {
                    getFillColor: hover.value
                },
                // If we want inactive layers to be interactive uncomment below
                pickable: true,
                onHover: this._onLayerHover,
                onClick: this._onLayerClick,
            });
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

            let layer;
            if (selected === 'All') {
                // filter by parent
                let parentNM = getNMapParent(type, 'type');
                if (parentNM) data = data.filter(f => f.properties[parentNM.code] === navigation[parentNM.type]);
                layer = makeActiveGeoLayer(NM, data);

                // Add Markers
                // addMarkers();

            }
            else {
                data = data.filter(f => {
                    return ( f.properties[NM.code] !== selected );
                });
                layer = makeInactiveGeoLayer(NM, data);
            }

            layers.push(layer);

        }

        _.toArray(navigationMap).forEach(n => getGeoLayers(n.type));


        // POIs as a deck.gl layer
        // const curNM = getNMap(tier);
        // const childNM = getNMapChild(tier);
        //
        // if (childNM && childNM.data && childNM.data.features) {
        //     let points = childNM.data.features.filter(f => f.properties[curNM.code] === navigation[curNM.type]);
        //     // Calculate the centeroid for each geojson multipolygon
        //     points = points.map(f => {
        //         let coordinates = turf.centroid(f).geometry.coordinates;
        //         let name = f.properties[curNM.code];
        //         return {coordinates, name};
        //     });
        //
        //     const showCluster = true;
        //     const layerProps = {
        //         data: points,
        //         pickable: true,
        //         wrapLongitude: true,
        //         getPosition: d => d.coordinates,
        //         iconMapping: iconMapping,
        //         iconAtlas: icon,
        //         sizeScale: 60
        //     };
        //     const size = viewState ? Math.min(Math.pow(1.5, viewState.zoom - 10), 1) : 0.1;
        //     const markerLayers = showCluster
        //         ? new IconClusterLayer({...layerProps, id: 'icon-cluster'})
        //         : new IconLayer({
        //             ...layerProps,
        //             id: 'icon',
        //             getIcon: d => 'marker',
        //             getSize: size
        //         });
        //     layers.push(markerLayers);
        // }

        return layers;
    }

    _getViews = () => {
        const {
            settings: {orthographic}
        } = this.state;
        // https://github.com/uber/deck.gl/blob/6.3-release/examples/layer-browser/src/app.js
        return new MapView({id: 'basemap', controller: MapController, orthographic});
    }

    _getMarkers = () => {
        const {
            tier,
            navigation,
        } = this.props;

        if (!tier || !navigation) {
            return null
        }

        const curNM = getNMap(tier, 'tier');
        const childNM = getNMapChild(tier, 'tier');
        const geoJson = getGeoJson(childNM.type);

        if (childNM && geoJson) {

            let points = geoJson.filter(f => f.properties[curNM.code] === navigation[curNM.type]);

            // Calculate the centeroid for each geojson multipolygon
            points = points.map(f => {
                let coordinates = turf.centroid(f).geometry.coordinates;
                let name = f.properties[childNM.code];
                return {longitude: coordinates[0], latitude: coordinates[1], name};
            });

            return points;
        }
    }

    render() {
        const {viewState, mapStyle} = this.props;
        const {gl} = this.state;
        const markers = this._getMarkers();

        return (
            <MapContainer>
                <DeckGL
                    viewState={viewState}
                    controller={{type: MapController, dragRotate: false}}
                    onViewStateChange={this._onViewStateChange}
                    ref={(ref) => {
                        this._deck = ref && ref.deck  // reference to the Deck instance
                    }}
                    layers={this._renderLayers()}
                    onWebGLInitialized={this._onWebGLInitialized}
                >
                    {gl && <StaticMap
                        ref={ref => {
                            this._map = ref && ref.getMap(); // reference to the mapboxgl.Map instance
                        }}
                        preventStyleDiffing={true}
                        reuse
                        mapStyle={mapStyle}
                        mapboxApiAccessToken={GGConsts.MAPBOX_TOKEN}>

                        {markers && markers.map((m, i) =>
                            <Marker
                                key={`marker-${i}`}
                                longitude={m.longitude}
                                latitude={m.latitude}>
                                <CityPin location={m.name}
                                         zoom={viewState.zoom}
                                         name={m.name}
                                    // onClick={() => this.setState({popupInfo: m.name})}
                                />
                            </Marker>
                        )}

                    </StaticMap>
                    }

                    {/*<ControlPanel*/}
                    {/*containerComponent={this.props.containerComponent}*/}
                    {/*onViewportChange={this._easeTo.bind(this)}*/}
                    {/*onStyleChange={this._onStyleChange.bind(this)}*/}
                    {/*/>*/}

                    {this._renderTooltip}

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
const Tooltip = styled(Card)`
    position: absolute;
    width: 180px;
    height: 40px;
    z-index: 100;
    transform: translateX(-90px);
    left: 50%;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    // top: ${props => `${props.y - 50}px`};
    // left: ${props => `${props.x}px`};
`;

export default connect(mapStateToProps, mapDispatchToProps)(Map);
