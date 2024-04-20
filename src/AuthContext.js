import React, { createContext, useState } from "react";

const AuthContext = createContext({
  loginDetails: null,
  setLoginDetails: () => {},
  projectDetails: null,
  setProjectDetails: () => {},
});

export default AuthContext;
