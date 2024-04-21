import React, { useState, useContext } from "react";
import "./CreateProject.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../AuthContext";
import Swal from "sweetalert2";


const CreateProject = () => {
  const navigate = useNavigate();
  const { loginDetails } = useContext(AuthContext);

  const [title, setTitle] = useState("");

  const backToHome = () => {
    navigate("/home");
  };

  const createTitle = async () => {
    try {
      await axios.post(`http://localhost:5000/project/create`, {
        title: title,
        userId: loginDetails.id
      });
      setTitle('')
      Swal.fire({
        title: "Project Added",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="form-container">
      <label className="login-text" style={{ textAlign: "center" }}>
        Create your title
      </label>
      <input
        type="text"
        placeholder="Title"
        className="title-input"
        style={{ width: "241px" }}
        value={title}
        onChange={handleTitleChange}
      />
      <button
        type="submit"
        className="create-button-2"
        onClick={() => createTitle()}
      >
        Create
      </button>
      <button
        type="button"
        className="back-button"
        onClick={() => backToHome()}
      >
        Back
      </button>
    </div>
  );
};

export default CreateProject;
