"use client";
import React from "react";
import LoginForm from "../_components/login/Loginform.jsx";
import CheckLogin from "../_components/privateroutes/CheckLogin";

const Login = () => {
  return <LoginForm />;
};

export default CheckLogin(Login);
