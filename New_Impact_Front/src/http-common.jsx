import axios from 'axios';
//Consulta la base del back end
const api = axios.create({
baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;