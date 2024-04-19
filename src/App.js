import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="*" element={<Login />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
