import axios from 'axios';
const API_URL = 'http://localhost:3000/v1';

// 기본 타임아웃
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

let interceptorReq;

export const initializeAxios = (accessToken) => {
    if (interceptorReq) axios.interceptors.request.eject(interceptorReq);

    interceptorReq = axios.interceptors.request.use(config => {
        config.headers.Authorization = accessToken;

        if (config.method === 'get') {
            if (!config.params) {
                // 조회조건이 하나도 없는 경우 오류가 발생하므로 빈 객체를 생성
                config.params = {};
            }
        }
        return config;
    }, err => {
        return Promise.reject(err);
    });
};

export const request = (settings) => {
    const config = {
        ...settings,
        baseURL: API_URL,
    };

    return axios(config).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        if (error.response) {
            // Request made and server responded
            console.log(error.response?.data);
            console.log(error.response?.status);
            console.log(error.response?.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        return Promise.reject(error);
    });
};

export default request;
