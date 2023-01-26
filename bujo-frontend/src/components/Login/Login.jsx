import React, { useState } from "react";
import "./style.css";
import { loginUser } from "../../services/Api";
function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const login = async (user) => {
    const result = await loginUser(user);
    console.log("___loginResult", result);
    return result;
  };

  const handleChange = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="content-holder">
      <div className="page-header">Login</div>
      <hr className="break-line" />
      <form
        className="input-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await login(user);
        }}
      >
        <input
          className="text-input"
          name="email"
          value={user.email}
          type="text"
          onChange={(e) => handleChange(e)}
          placeholder="user@email.com"
        ></input>
        <input
          className="text-input"
          name="password"
          value={user.password}
          type="password"
          onChange={(e) => handleChange(e)}
          placeholder="password"
        ></input>
        <button className="submit-btn" type="submit">
          LOGIN
        </button>
      </form>
    </div>
  );
}

export default Login;
