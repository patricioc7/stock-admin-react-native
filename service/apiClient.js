import axios from "axios";

const BASE_URL = "https://taller-prog-2-stock.herokuapp.com";

const ApiClient = {
  login: (body) => {
    console.log(body)
    return axios.post(`${BASE_URL}/user/login`, body);
  },
  getAllStocks: (jwt) => {
    return axios.get(`${BASE_URL}/stock/`, {
      headers: {
        Authorization: jwt,
      },
    });
  },
  getAllProducts: (jwt) => {
    return axios.get(`${BASE_URL}/product/`, {
      headers: {
        Authorization: jwt,
      },
    });
  },
  getAllStores: (jwt) => {
    return axios.get(`${BASE_URL}/store/`, {
      headers: {
        Authorization: jwt,
      },
    });
  },
};
export default ApiClient;
