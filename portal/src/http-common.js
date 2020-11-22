import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8000/api",
  //baseURL: "http://192.168.0.139:8000/api",
  headers: {
    "Content-type": "application/json",
//    "Access-Control-Allow-Origin": "*",
 //   "Access-Control-Allow-Credentials": "true",
  //  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
   // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    
  }
});