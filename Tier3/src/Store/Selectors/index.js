
export const getNavState = state => state.navigationReducer.navigation;

export const getTierState = state => state.navigationReducer.nav_tier;

export const getGeoState = state => state.dataReducer.geo_map;

export const getViewport = state => state.mapReducer.map_viewport;

export const getUri = state => state.uri;