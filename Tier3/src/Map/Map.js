import GGConsts from '../Constants';
import React, {Component} from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL, {MapView, FirstPersonView, OrbitView, MapController, FlyToInterpolator, GeoJsonLayer, IconLayer} from 'deck.gl';
import { navigationMap } from './../Utils';
import { connect } from "react-redux";
import _ from 'lodash';
import CityPin from './pin';
import IconClusterLayer from './icon-cluster-layer';

import {
    setMapViewport,
    mapClicked,
    navHovered
} from './../Store/Actions';

import markerData from './statesData.json';
import icon from './location-icon-atlas.png';
import iconMapping from './location-icon-mapping.json';
// Source data CSV
const DATA_URL =
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json';

const stopPropagation = evt => evt.stopPropagation();

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

    _onViewStateChange = ({ viewState }) => {
        this.props.setMapViewport({...viewState, transitionDuration: 0});
    }

    _onMapClick = e => {
        const { tier } = this.props;
        const layer = _.get(_.first(e.features), 'layer');
        const props = _.get(_.first(e.features), 'properties');

        // if (layer && props) {
        //     const type = _.first(layer.id.split('-'));
        //     const filter = getFilterKey(type);
        //     let value = _.get(props, filter);
        //     if (type === 'country_selected') value = getCountryName(value);
        //     // const toMap = _.first(navigationMap.filter(n => n.index === curMap.index + 1));
        //
        //     this.props.navigateTo({ [type]: value });
        // }
    }

    // _renderTooltip = () => {
    //     const {x, y, hoveredObject} = this.state;
    //     return (
    //         hoveredObject && (
    //             <div className="tooltip" style={{position: 'absolute', zIndex: 1000, top: y - 50, left: x}}>
    //                 <div>{hoveredObject.properties.admin2Name} </div>
    //             </div>
    //         )
    //     );
    // }

    _onLayerHover = ({x, y, object}) => {
        if (!object) {
            return null;
        }

        const { tier } = this.props;
        const curMap = _.first(navigationMap.filter(f => f.tier === tier));
        const newMap = _.first(navigationMap.filter(f => f.index === curMap.index + 1));
        const value = object.properties[newMap.code]

        if (!value) {
            console.log(`%c something wrong with the hovered location: ${value}`, 'background: #c50018; color: white; display: block;');
        } else {
            this.props.navHovered(value);
        }
    }

    _onLayerClick = e => {
        console.log(e.object.properties);
    }

    // DeckGL and mapbox will both draw into this WebGL context
    _onWebGLInitialized = (gl) => {
        this.setState({gl});
    }

    _renderLayers = () => {
        const { tier, navigation, hover, viewState } = this.props;
        const layers = [];

        const getChildGeoLayer = (map) => {
            return new GeoJsonLayer({
                id: `${hover && hover}-${map.type}`,
                data: map.data,
                opacity: 0.8,
                stroked: false,
                filled: true,
                extruded: false,
                wireframe: true,
                fp64: true,
                getLineColor: [255, 255, 255],
                getFillColor: f => (f.properties[map.code] === hover) ? [255, 255, 0] : [199, 233, 180],
                updateTrigger: {
                    getFillColor: hover
                },
                pickable: true,
                onHover: this._onLayerHover,
                onClick: this._onLayerClick,
            })

        }

        const getCurGeoLayer = (map, data) => {
            return new GeoJsonLayer({
                id: `${hover && hover}-${map.type}`,
                data: data,
                opacity: 0.8,
                stroked: false,
                filled: true,
                extruded: true,
                wireframe: true,
                fp64: true,
                getLineColor: [255, 255, 255],
                // getFilterValue: f => f.properties[map.code],
                getFillColor: [105, 105, 105],
                // pickable: true,
                // onHover: this._onHover,
                // onClick: this._onClick,
            })

        }

        // 1. Current Tier Layers
        const curMap = _.first(navigationMap.filter(f => f.tier === tier));
        const selected = navigation[curMap.type];

        const test = curMap.data.features.filter(f => f.properties[curMap.code] === selected);
        console.log('@@test', curMap.data.features, test);
        const data = curMap.data.features.filter(f => {

            return( f.properties[curMap.code] !== selected );
        });

        // Add Markers
        // data && this.setState({ markers: data });
        const getIconsLayer = (data) => {
            const icons = new IconLayer({
                id: 'icon',
                data,
                wrapLongitude: true,
                getIcon: d => 'marker',
                sizeScale: 15,
                getPosition: d => d.geometry.coordinates,
                getColor: [188, 0, 23],
                iconPoi: 'https://static.thenounproject.com/png/1164981-200.png',
                iconMapping: {
                    marker: {
                        x: 0,
                        y: 0,
                        width: 128,
                        height: 128,
                        anchorY: 128,
                        mask: true,
                    },
                },
            })
        }

        // const markers = getIconsLayer(data);
        // layers.push(markers);

        const curLayer = getCurGeoLayer(curMap, data);
        // layers.push(curLayer);

        // if (hovered !== selected) {
        //     this.setState({ hovered: selected });
        // }

        // 2. Child Tier Layers
        const childMap = _.first(navigationMap.filter(f => f.index === curMap.index + 1));
        const childLayer = getChildGeoLayer(childMap);

        layers.push(childLayer);
        
        const showCluster = true;

        const layerProps = {
            data: DATA_URL,
            pickable: true,
            wrapLongitude: true,
            getPosition: d => d.coordinates,
            iconMapping: iconMapping,
            iconAtlas: icon,
            sizeScale: 60
        };

        const size = viewState ? Math.min(Math.pow(1.5, viewState.zoom - 10), 1) : 0.1;

        const markerLayers = showCluster
            ? new IconClusterLayer({...layerProps, id: 'icon-cluster'})
            : new IconLayer({
                ...layerProps,
                id: 'icon',
                getIcon: d => 'marker',
                getSize: size
            });

        layers.push(markerLayers);


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

    _getViews = () => {
        const {
            settings: {orthographic}
        } = this.state;
        // https://github.com/uber/deck.gl/blob/6.3-release/examples/layer-browser/src/app.js
        return new MapView({id: 'basemap', controller: MapController, orthographic});
    }

    render() {
        const { viewState, mapStyle } = this.props;
        const { gl, markers } = this.state;

        const views = this._getViews();
        const layers = this._renderLayers();

        return (
            <div>
                <DeckGL
                    // initialViewState={INITIAL_VIEW_STATE}
                    viewState={viewState}
                    controller={{type: MapController, dragRotate: false}}
                    onViewStateChange={this._onViewStateChange}
                    // views={views}
                    ref={(ref) => {
                        // save a reference to the Deck instance
                        this._deck = ref && ref.deck
                    }}
                    layers={layers}
                    // onClick={this._onMapClick}
                    // onHover={this._onMapHover}
                    onWebGLInitialized={this._onWebGLInitialized}
                >
                    {gl && <StaticMap
                        ref={ref => {
                            // save a reference to the mapboxgl.Map instance
                            this._map = ref && ref.getMap();
                        }}
                        // gl={gl}
                        preventStyleDiffing={true}
                        reuse
                        mapStyle={'mapbox://styles/mapbox/light-v9'}
                        mapboxApiAccessToken={GGConsts.MAPBOX_TOKEN}>


                        {/*<Marker latitude={9.0820} longitude={8.6753} offsetLeft={-20} offsetTop={-10}>*/}
                        {/*<div>You are here</div>*/}
                        {/*</Marker>*/}

                    </StaticMap>
                    }

                    {/*{this._renderTooltip}*/}

                </DeckGL>

                {/*<ControlPanel*/}
                {/*containerComponent={this.props.containerComponent}*/}
                {/*onViewportChange={this._easeTo.bind(this)}*/}
                {/*interruptionStyles={interruptionStyles}*/}
                {/*onStyleChange={this._onStyleChange.bind(this)}*/}
                {/*/>*/}
            </div>
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
        navigateTo: (navState) => dispatch({ type: GGConsts.UPDATE_NAV, navState }),
        navHovered: (nav_hover) => dispatch({ type: GGConsts.NAV_HOVER, nav_hover }),
        // navHovered: (val) => dispatch(navHovered(val)),
        mapClicked: (prop) => dispatch(mapClicked(prop)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
