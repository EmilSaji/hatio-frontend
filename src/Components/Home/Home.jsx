import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../AuthContext";
import "./Home.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { loginDetails, setLoginDetails, setProjectDetails } =
    useContext(AuthContext);
  const [projects, setProjects] = useState(null);

  const fetchData = async () => {
    try {
      const userId = loginDetails.id;
      const response = await axios.get(
        `http://localhost:5000/project/fetch/${userId}`
      );
      response.data.projects.length > 0
        ? setProjects(response.data.projects)
        : setProjects(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loginDetails.id) {
      fetchData();
    }
  }, [loginDetails.id]);

  const handleView = (projectId, title) => {
    setProjectDetails({ projectId, title });
    navigate("/todo");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/project/delete`, {
        data: { projectId: id },
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

  const logOut = () => {
    navigate("/");
  };

  return (
    <div className="project-root">
      <table className="project-table">
        <thead>
          <tr>
            <th colSpan={4}>
              <button onClick={() => createProject()} className="create-button">
                Create a Project
              </button>
              <button className="back-button-2" onClick={() => logOut()}>
                {" "}
                Log Out
              </button>
            </th>
          </tr>
          <tr>
            <th colSpan={6}>Project(s)</th>
          </tr>
          <tr>
            <th>Sl No.</th>
            <th>Title</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        {projects ? (
          <tbody>
            {projects.map((project, index) => (
              <tr key={project.id}>
                <td>{index + 1}</td>
                <td>{project.title}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleView(project.id, project.title)}
                  >
                    View
                  </button>
                </td>
                <td>
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
        ) : (
          <tbody>
            <tr>
              <th colSpan={6}>No Project(s) to display !!</th>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Home;
