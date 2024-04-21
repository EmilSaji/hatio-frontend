import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import AuthContext from "./AuthContext";
import CreateProject from "./Components/CreateProject/CreateProject";
import Todo from "./Components/Todo/Todo";

const App = () => {
  const [loginDetails, setLoginDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);

  const value = {
    projectDetails,
    setProjectDetails,
    loginDetails,
    setLoginDetails,
  };

  return (
    <AuthContext.Provider value={value}>
      <Router>
        <div>
          <Routes>
            <Route path="*" element={<Login />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/create-project" element={<CreateProject />}></Route>
            <Route path="/todo" element={<Todo />}></Route>
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
