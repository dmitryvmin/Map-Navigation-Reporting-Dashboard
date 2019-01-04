import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga'
// import loggerMiddleware from 'redux-logger';
// import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import reducers from './Reducers/index.js';
import {
    startupSaga,
    watcherSaga
} from './Sagas';
// import {persistStore, persistReducer, persistCombineReducers} from 'redux-persist';
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
// import localforage from 'localforage';

// const persistConfig = {
//     key: 'root',
//     storage,
//     // storage: localforage,
//     blacklist: ['fetching'],
// }

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = [
    applyMiddleware(sagaMiddleware),
    ...(window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : [])
];

// const persistCombinedReducers = persistCombineReducers(persistConfig, reducers);

// create a redux store with reducers and middleware
const store = createStore(
    combineReducers(reducers),
    // persistCombinedReducers,
    compose(...middleware)
);

// run only once - when hooking up redux-persist, check if country state has already been fetched
// TODO: finish hook up redux-persist

sagaMiddleware.run(watcherSaga);
sagaMiddleware.run(startupSaga);

// export const persistor = persistStore(store);

export default store;