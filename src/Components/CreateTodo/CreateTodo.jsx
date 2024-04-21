import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../AuthContext";
import Swal from "sweetalert2";

const CreateTodo = () => {
  const navigate = useNavigate();
  const { projectDetails } = useContext(AuthContext);

  const [description, setDescription] = useState("");

  const backToHome = () => {
    navigate("/todo");
  };

  const createTodo = async () => {
    try {
      await axios.post(`http://localhost:5000/todo/create`, {
        description: description,
        status: "Pending",
        projectId: projectDetails.projectId,
      });
      Swal.fire({
        title: "Todo Added",
        icon: "success",
        confirmButtonText: "OK",
      });
      setDescription('')
    } catch (error) {
      console.log(error);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="form-container">
      <label className="login-text" style={{ textAlign: "center" }}>
        Create your Todo
      </label>
      <input
        type="text"
        placeholder="Description"
        className="title-input"
        style={{ width: "241px" }}
        value={description}
        onChange={handleDescriptionChange}
      />
      <button
        type="submit"
        className="create-button-2"
        onClick={() => createTodo()}
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

export default CreateTodo;
