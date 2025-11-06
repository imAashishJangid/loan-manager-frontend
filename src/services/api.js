import axios from "axios";

const API = axios.create({
  baseURL:"https://loan-management-tcl0.onrender.com/api",
});

export default API;
