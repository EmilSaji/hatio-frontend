import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async () => {
    try {
      if (username && password) {
        const response = await axios.post("http://localhost:5000/user/signup", {
          username,
          password,
        });
        Swal.fire({
          title: "Account Created",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "Enter Username And Password",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed",
        icon: "error",
        text: error.response.data.message,
        confirmButtonText: "OK",
      });
    }
  };

  const handleLogin = async () => {
    try {
      if (username && password) {
        const response = await axios.post("http://localhost:5000/user/login", {
          username: username,
          password: password,
        });
        console.log(response.data);
      } else {
        Swal.fire({
          title: "Failed",
          icon: "error",
          text: "Enter Username And Password",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
        text: 'Please create an account',
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-text">Login / Sign Up</div>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button-1" onClick={handleLogin}>
        Login
      </button>
      <button className="login-button-2" onClick={handleCreate}>
        Create
      </button>
      <p>Note: If you are new here? Then click create then Login :)</p>
    </div>
  );
};

export default Login;
