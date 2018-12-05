import axios from 'axios';
import GGConsts from '../Constants';

const loadDevices = async() => {
  const uri = `${GGConsts.API}:${GGConsts.REPORTING_PORT}/sensor/state`;
  const config = {
    headers: { 'Authorization': `Basic ${GGConsts.HEADER_AUTH}` }
  }

  try {
    
    let data = await axios.get(uri, config);

    if (data && data.data && data.data.sensors) {
      return data.data.sensors; 
    } else {
      console.warn("@loadDevices esensor data incomplete: ", data);
    }
    
  } catch (err) {
    console.warn("@loadDevices error: ", err);
  }
}

export default loadDevices; 
