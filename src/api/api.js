import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getTrainData = params => { return axios.get(`${base}/data/getTrainData`, { params: params }); };


// export default {
//   clusterState() {
//     return axios.get(`${base}/_cluster/state`);
//   }
// }

export const getConfig = () => {
  return {
    storeType: [
      {key: 'code', value: '编写脚本'},
      {key: 'zip', value: '上传zip包'}
    ],
    algoPlatform: [
      {key: 'sklearn', value: 'ScikitLearn'},
      {key: 'tensorflow', value: 'TensorFlow'}
    ],
    algoType: [
      {key: 'word2vec', value: 'Word2Vec'},
      {key: 'svm', value: 'SVM'},
      {key: 'lstm', value: 'LSTM'},
      {key: 'logistic_regression', value: '逻辑回归'},
      {key: 'linear_regression', value: '线性回归'},
      {key: 'lda', value: '主题模型'}
    ],
    taskType: [
      {key: 'text_classification', value: '文本分类'},
      {key: 'sentiment_analysis', value: '情感分析'}
    ],
    serverIp: [
      {key: 'train_server1', value: '192.168.1.5'},
      {key: 'train_server2', value: '192.168.1.6'}
    ]
  }
}