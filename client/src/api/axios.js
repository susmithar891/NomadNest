import axios from 'axios'


const request = axios.create({
  baseURL: "https://nomad-api-dot-centered-oasis-418917.wn.r.appspot.com/",
  timeout: 20000,
  withCredentials: true,
});

export default request