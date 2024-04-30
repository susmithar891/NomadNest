import axios from 'axios'


const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? "http://localhost:4000/" : "https://nomad-api-dot-centered-oasis-418917.wn.r.appspot.com/",
  timeout: 20000,
  withCredentials: true,
});

export default request