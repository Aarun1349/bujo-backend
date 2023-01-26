import React, { useState } from "react";
import "./style.css";
import { userSignup } from "../../services/Api";
function Signup() {
  const [check, setCheck] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const signUp = async (user) => {
    if (user.password !== user.confirm) {
      setCheck(true);
      console.log("check", check);
    } else {
      setCheck(false);
    }
    if (check === false) {
      try {
        const response = await userSignup(user);
        const result = (await response).json();
        console.log("___result", result);
        return result;
      } catch (error) {
        console.log("___signupError", error);
        return error;
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
    // console.log("___user", e.target.value);
  };
  return (
    <div className="content-holder">
      <div className="page-header">JOIN US</div>
      <hr className="break-line" />
      <form
        className="input-form"
        onSubmit={(e) => {
          e.preventDefault();
          signUp(user);
        }}
      >
        <input
          className="text-input"
          name="name"
          value={user.name}
          type="text"
          placeholder="user name"
          onChange={(e) => handleChange(e)}
        ></input>
        <input
          className="text-input"
          name="email"
          value={user.email}
          type="email"
          placeholder="user@email.com"
          onChange={(e) => handleChange(e)}
        ></input>
        <input
          className="text-input"
          name="password"
          value={user.password}
          type="password"
          placeholder="password"
          onChange={(e) => handleChange(e)}
        ></input>
        <input
          className="text-input"
          name="confirm"
          value={user.confirm}
          type="password"
          placeholder=" confirm password"
          onChange={(e) => handleChange(e)}
        ></input>
        <button className="submit-btn" type="submit">
          SIGNUP
        </button>
        {check && <p style={{ color: "red" }}>Passwords should match</p>}
      </form>
    </div>
  );
}

export default Signup;
