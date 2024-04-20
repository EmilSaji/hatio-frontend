import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../AuthContext";
import "./Home.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { loginDetails, setLoginDetails, setProjectDetails } = useContext(AuthContext);
  const [projects, setProjects] = useState(null);

  const fetchData = async () => {
    try {
      const userId = loginDetails.id;
      const response = await axios.get(
        `http://localhost:5000/project/fetch/${userId}`
      );
      console.log(response.data);
      setProjects(response.data.projects);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loginDetails.id) {
      fetchData();
    }
  }, [loginDetails.id]);

  const handleView = (projectId) => {
    console.log(projectId);
    setProjectDetails(projectId)
    navigate('/todo')
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/project/delete`, {
        data: { projectId: id }, // Send data as a body
      });
      Swal.fire({
        title: "Project Deleted",
        icon: "success",
        confirmButtonText: "OK",
      });
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const createProject = () => {
    navigate("/create-project");
  };

  return (
    <div className="project-root">
      <table className="project-table">
        <thead>
          <tr>
            <th colSpan={3} style={{ textAlign: "center" }}>
              <button onClick={() => createProject()} className="create-button">
                Create a Project
              </button>
            </th>
          </tr>
          <tr>
            <th>Title</th>
            <th colSpan={2} style={{ textAlign: "center" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {projects &&
            projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="edit-button"
                    onClick={() => handleView(project.id)}
                  >
                    View
                  </button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
