import { useState, useEffect } from 'react'
import axios from "axios"
import * as XLSX from 'xlsx'

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!text) return;
    try {
      await axios.post("http://localhost:5000/api/todos", { text });
      setText("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !completed
      });
      fetchTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText) return;
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, { text: editText });
      setEditId(null);
      setEditText("");
      fetchTodos();
    } catch (error) {
      console.error("Error saving todo edit:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(todos.map(todo => ({ Task: todo.text, Completed: todo.completed ? "Yes" : "No" })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ToDos");
    XLSX.writeFile(workbook, "todos.xlsx");
  };

  return (
    <div style={{
      padding: "20px",
      maxWidth: "400px",
      margin: '50px auto',
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ margin: 0 }}>To-Do List</h2>
        <button
          onClick={exportToExcel}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Export to Excel
        </button>
      </div>
      <div style={{ display: "flex", marginBottom: "15px" }}>
        <input
          type="text"
          value={text}
          placeholder="Add a new task..."
          onChange={(e) => setText(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "8px",
            borderRadius: "5px 0 0 5px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />
        <button
          onClick={addTodo}
          style={{
            backgroundColor: "#3c763d",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "0 5px 5px 0",
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{
            backgroundColor: "#f9f9f9",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            {editId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flexGrow: 1, marginRight: "10px", padding: "5px" }}
                />
                <button onClick={() => saveEdit(todo._id)} style={{ marginRight: "5px" }}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  onClick={() => toggleTodo(todo._id, todo.completed)}
                  style={{
                    flexGrow: 1,
                    cursor: "pointer",
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }}
                >
                  {todo.text}
                </span>
                <div>
                  <button onClick={() => startEdit(todo._id, todo.text)} style={{ marginRight: "5px" }}>Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
