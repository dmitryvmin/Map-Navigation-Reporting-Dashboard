import supercluster from 'supercluster';
import { point } from '@turf/helpers';
import { Children, PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
// import type { Node, Component } from 'react';

import { Marker } from 'react-map-gl';

const childrenKeys = children =>
    Children.toArray(children).map(child => child.key);

const shallowCompareChildren = (prevChildren, newChildren) => {
    if (Children.count(prevChildren) !== Children.count(newChildren)) {
        return false;
    }

    const prevKeys = childrenKeys(prevChildren);
    const newKeys = new Set(childrenKeys(newChildren));
    // console.log(prevKeys.length === newKeys.size && prevKeys.every(key => newKeys.has(key)), {prevChildren, newChildren})
    return (
        prevKeys.length === newKeys.size && prevKeys.every(key => newKeys.has(key))
    );
};

class Cluster extends PureComponent {
    static displayName = 'Cluster';

    static defaultProps = {
        minZoom: 0,
        maxZoom: 16,
        radius: 40,
        extent: 512,
        nodeSize: 64,
    };

    constructor(props) {
        super(props);

        this.state = {
            clusters: [],
        };
    }

    componentDidMount() {
        this.createCluster(this.props);
        this.recalculate();

        this.props.map.on('moveend', this.recalculate);
    }

    componentWillReceiveProps(newProps) {
        const shouldUpdate =
            newProps.minZoom !== this.props.minZoom ||
            newProps.maxZoom !== this.props.maxZoom ||
            newProps.radius !== this.props.radius ||
            newProps.extent !== this.props.extent ||
            newProps.nodeSize !== this.props.nodeSize ||
            !shallowCompareChildren(this.props.children, newProps.children);

        if (shouldUpdate) {
            this.createCluster(newProps);
            this.recalculate();
        }
    }

    createCluster = props => {
        const {
            minZoom,
            maxZoom,
            radius,
            extent,
            nodeSize,
            children,
            innerRef,
        } = props;

        const cluster = new supercluster({
            minZoom,
            maxZoom,
            radius,
            extent,
            nodeSize,
        });

        const points = Children.map(children, child => {
            if (child)
                return point([child.props.longitude, child.props.latitude], child);
            return null;
        });

        cluster.load(points);
        this.cluster = cluster;
        if (innerRef) innerRef(this.cluster);
    };

    recalculate = () => {
        const zoom = this.props.map.getZoom();
        const bounds = this.props.map.getBounds().toArray();
        const bbox = bounds[0].concat(bounds[1]);

        const clusters = this.cluster.getClusters(bbox, Math.floor(zoom));
        this.setState(() => ({ clusters }));
    };

    render() {
        const clusters = this.state.clusters.map(cluster => {
            if (cluster.properties.cluster) {
                const [longitude, latitude] = cluster.geometry.coordinates;
                return createElement(Marker, {
                    longitude,
                    latitude,
                    // TODO size
                    offsetLeft: -28 / 2,
                    offsetTop: -28,
                    children: createElement(this.props.element, {
                        cluster,
                        superCluster: this.cluster,
                    }),
                    key: `cluster-${cluster.properties.cluster_id}`,
                });
            }
            const { type, key, props } = cluster.properties;
            return createElement(type, { key, ...props });
        });
        return clusters;
    }
}

export default Cluster;