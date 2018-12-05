import { combineReducers, createStore } from "redux";

export const DEVICE_ERRORS = "DEVICE_ERRORS";

export const storeErrors = errors => {
	return ({
	type: DEVICE_ERRORS,
	errors
})};

const rootReducer = (state = [], action) => {
  switch (action.type) {
    case DEVICE_ERRORS: {
      return {
      	...state,
        errors: action.errors
      };
    }
    default:
      return state;
  }
}

// const rootReducer = combineReducers({ 
// 	errorsReducer 
// });

export default rootReducer;

// const store = createStore(errorsReducer);
// export default store;