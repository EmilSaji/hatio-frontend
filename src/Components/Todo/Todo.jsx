import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Todo.css";

const Todo = () => {
  const navigate = useNavigate();
  const { projectDetails } = useContext(AuthContext);
  const [todos, setTodos] = useState(null);

  const fetchData = async () => {
    try {
      const id = projectDetails;
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
        data: { id: todoId }
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

  return (
    <div className="project-root">
      <table className="project-table">
        <thead>
          <tr>
            <th colSpan={6} style={{ textAlign: "center" }}>
              <button className="create-button">Add Todo</button>
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
                <td>{todo.created_date}</td>
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
