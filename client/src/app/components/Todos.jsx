"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editMode, setEditMode] = useState(true);
  const [editTodo, setEditTodo] = useState("");

  const createHandler = async () => {
    try {
      const response = await axios.post("http://localhost:1433/add-todo", {
        title: newTodo,
      });

      if (response.status === 201) {
        alert("Todo added successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:1433/delete-todo/${id}`
      );

      if (response.status === 200) {
        alert("Todo deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editHandler = async (id) => {
    const response = await axios.put(
      `http://localhost:1433/update-todo/${id}`,
      {
        title: editTodo,
      }
    );

    if (response.status === 200) {
      alert("Todo updated successfully!");
      window.location.reload();
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:1433/todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.error("Error fetching todos", err);
      });
  }, []);
  return (
    <div className="h-screen flex">
      {/* todo form start */}
      <div className="flex bg-red-500/10 flex-col flex-1 items-center justify-start gap-y-8">
        <h1 className="text-2xl font-semibold mt-24 ">Todo App</h1>
        <input
          type="text"
          placeholder="Enter a todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createHandler();
            }
          }}
          className="px-2 outline-none"
        />
        <button
          onClick={createHandler}
          className="bg-red-400 hover:bg-red-700 duration-300 px-3 text-white py-1 rounded-md"
        >
          Add Todo
        </button>
      </div>
      {/* todo form end */}

      {/* todos start */}
      <div className="flex-[3] bg-indigo-500/10 flex justify-start items-start p-12 ">
        <ul className="flex flex-col gap-y-4  bg-red-500/5 rounded-md w-full h-full p-12">
          {todos.map((todo) => (
            <li key={todo.id}>
              {editMode === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editTodo}
                    onChange={(e) => setEditTodo(e.target.value)}
                    className="text-black outline-none"
                    onKeyDown={(e) => e.key === "Enter" && editHandler(todo.id)}
                  />
                  <button
                    onClick={() => editHandler(todo.id)}
                    className="bg-green-300 text-white px-2 py-px"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 text-white px-2 py-px"
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-start gap-x-4">
                  {todo.title}
                  <button
                    onClick={() => deleteHandler(todo.id)}
                    className="bg-red-500 px-2 py-px rounded-sm text-white"
                  >
                    X
                  </button>
                  <button
                    onClick={() => {
                      setEditTodo(todo.title);
                      setEditMode(todo.id);
                    }}
                    className="bg-green-300 text-white px-2 py-px"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* todos end */}
    </div>
  );
};

export default Todos;
