import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Todo.css";

const Todo = () => {
  const navigate = useNavigate();
  const { projectDetails, setProjectDetails } = useContext(AuthContext);
  const [todos, setTodos] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(projectDetails.title);

  const fetchData = async () => {
    try {
      const id = projectDetails.projectId;
      const response = await axios.post("http://localhost:5000/todo/fetch", {
        projectId: id,
      });
      setTodos(response.data.todos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (projectDetails) {
      fetchData();
    }
  }, [projectDetails]);

  const changeStatus = async (todoId, status, desc) => {
    try {
      let newStatus = "";
      status == "Completed"
        ? (newStatus = "Pending")
        : (newStatus = "Completed");
      await axios.post("http://localhost:5000/todo/update", {
        id: todoId,
        status: newStatus,
        description: desc,
      });
      fetchData();
      Swal.fire({
        title: "Todo Updated",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      console.log(todoId);
      await axios.delete("http://localhost:5000/todo/delete", {
        data: { id: todoId },
      });
      fetchData();
      Swal.fire({
        title: "Todo Deleted",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createTodo = () => {
    navigate("/create-todo");
  };

  const backToHome = () => {
    navigate("/home");
  };

  const editTitle = async () => {
    try {
      const projectIdCopy = projectDetails.projectId;
      await axios.post(`http://localhost:5000/project/update`, {
        title: newTitle,
        projectId: projectIdCopy,
      });
      Swal.fire({
        title: "Project Title Changed",
        icon: "success",
        confirmButtonText: "OK",
      });
      setProjectDetails({
        title: newTitle,
        projectId: projectIdCopy,
      });
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  const exportToMarkdown = async () => {
    if (!todos) return;

    let markdownContent = `# ${projectDetails.title}\n\nSummary: ${
      todos.filter((todo) => todo.status === "Completed").length
    }/${todos.length} todos completed\n\n`;

    const pendingTodos = todos.filter((todo) => todo.status === "Pending");
    const completedTodos = todos.filter((todo) => todo.status === "Completed");

    if (pendingTodos.length > 0) {
      markdownContent += "### Pending\n";
      pendingTodos.forEach((todo) => {
        markdownContent += `-  [ ] ${todo.description}\n`;
      });
      markdownContent += "\n";
    }

    if (completedTodos.length > 0) {
      markdownContent += "### Completed\n";
      completedTodos.forEach((todo) => {
        markdownContent += `-  [x] ${todo.description}\n`;
      });
    }

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo_list.md";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    try {
      const response = await axios.post(
        "https://api.github.com/gists",
        {
          public: false,
          files: {
            "todo_list.md": {
              content: markdownContent,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );

      if (response.status === 201) {
        const gistUrl = response.data.html_url;
        console.log("Gist created successfully:", gistUrl);
        Swal.fire({
          title: "Exported to Gist",
          text: `Link: ${gistUrl}`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Failed to create gist:", response.statusText);
        Swal.fire({
          title: "Export Failed",
          text: "Failed to export markdown content as a Gist.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error exporting to Gist:", error);
      Swal.fire({
        title: "Export Failed",
        text: "An error occurred while exporting markdown content as a Gist.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="project-root">
      <table className="project-table">
        <thead>
          <tr>
            <th colSpan={6} style={{ textAlign: "center" }}>
              <button className="create-button" onClick={() => createTodo()}>
                Add Todo
              </button>
              <button className="back-button-2" onClick={() => backToHome()}>
                {" "}
                Back
              </button>
              <button
                className="export-button"
                onClick={() => exportToMarkdown()}
              >
                Export
              </button>
            </th>
          </tr>
          <tr>
            <th colSpan={6}>
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input-box-2"
                  />
                  <button
                    onClick={() => editTitle()}
                    className="title-edit-button"
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <>
                  {projectDetails.title}
                  <button
                    onClick={() => setEditMode(true)}
                    className="title-edit-button"
                  >
                    Edit
                  </button>
                </>
              )}
            </th>
          </tr>
          <tr>
            <th>Sl No.</th>
            <th>Description</th>
            <th>Created Date</th>
            <th>Status</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos &&
            todos.map((todo, index) => (
              <tr key={todo.id}>
                <td>{index + 1}</td>
                <td>{todo.description}</td>
                <td>{formatDate(todo.created_date)}</td>
                <td>{todo.status}</td>
                <td>
                  <button
                    className="status-button"
                    onClick={() =>
                      changeStatus(todo.id, todo.status, todo.description)
                    }
                  >
                    Change Status
                  </button>
                </td>
                <td>
                  <button
                    className="todo-delete-button"
                    onClick={() => deleteTodo(todo.id)}
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

export default Todo;
