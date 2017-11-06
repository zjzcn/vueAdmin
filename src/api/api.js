import axios from 'axios';

let base = 'http://10.101.91.60:9200';

export default {
  clusterState() {
    return axios.get(`${base}/_cluster/state`);
  }
}