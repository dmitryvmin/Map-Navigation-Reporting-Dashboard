import axios from "axios";

// makes the api request and returns a Promise response
function* fetchData(...args) {
    const [uri, config = ''] = args;
    const response = yield axios.get(uri, config);
    return response;
}

export default fetchData;