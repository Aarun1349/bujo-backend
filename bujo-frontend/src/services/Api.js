/**
 * API Calls to backend servers
 */

/**
 * Login API Calls
 */

require("dotenv").config();

let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");
headers.append("Access-Control-Allow-Origin", "http://localhost:3000", "*");
headers.append("Access-Control-Allow-Credentials", "true");
// headers.append("GET", "POST", "OPTIONS");

const AUTH_BASE_URL =
  process.env.AUTH_BASE_URL || `http://localhost:8000/api/auth`;
  // 'http://localhost:8000/api/auth/login'

export const loginUser = async (body) => {
  console.log("Body params___", body);
//   const response = await fetch(`${AUTH_BASE_URL}/login`, {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    mode: "no-cors",
    method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const userSignup = async (body) => {
    console.log("Body params___", body);             
    // body = delete body.confirm;
  
//   const response = await fetch(`${AUTH_BASE_URL}/createuser`, {
  const response = await fetch(`http://localhost:8000/api/auth/createuser`, {
  mode: "no-cors",
  method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};
