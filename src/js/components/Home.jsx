import React, { useState, useEffect } from "react";

const Home = () => {
    const [task, setTask] = useState("");
    const [todos, setTodos] = useState([]);
    const userName = "tu_nombre_de_usuario"; 
    const apiUrl = `https://playground.4geeks.com/todo/users/${userName}`;
    const apiTodoUrl = `https://playground.4geeks.com/todo/todos/${userName}`;

    
    const getTasks = async () => {
        try {
            const response = await fetch(apiUrl);
            if (response.status === 404) {
                
                createUser();
            } else {
                const data = await response.json();
                setTodos(data.todos);
            }
        } catch (error) {
            console.error("Error obteniendo tareas:", error);
        }
    };

   
    const createUser = async () => {
        try {
            await fetch(apiUrl, { method: "POST" });
            getTasks(); 
        } catch (error) {
            console.error("Error creando usuario:", error);
        }
    };

   
    const addTask = async (e) => {
        if (e.key === "Enter" && task.trim() !== "") {
            try {
                const response = await fetch(apiTodoUrl, {
                    method: "POST",
                    body: JSON.stringify({
                        label: task,
                        is_done: false
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                if (response.ok) {
                    setTask(""); 
                    getTasks();  
                }
            } catch (error) {
                console.error("Error agregando tarea:", error);
            }
        }
    };

    
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE"
            });
            if (response.ok) getTasks();
        } catch (error) {
            console.error("Error eliminando tarea:", error);
        }
    };

    
    const clearAll = async () => {
        
        
        try {
            await fetch(apiUrl, { method: "DELETE" });
            setTodos([]);
            createUser(); 
        } catch (error) {
            console.error("Error limpiando lista:", error);
        }
    };

    
    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h1 className="text-center">Mis Tareas</h1>
            <div className="card shadow">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <input
                            type="text"
                            className="form-control border-0"
                            placeholder="¿Qué hay que hacer?"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            onKeyDown={addTask}
                        />
                    </li>
                    {todos.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center task-item">
                            {item.label}
                            <button 
                                className="btn btn-sm btn-outline-danger border-0" 
                                onClick={() => deleteTask(item.id)}
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="card-footer text-muted small">
                    {todos.length} {todos.length === 1 ? "tarea" : "tareas"} restante(s)
                </div>
            </div>
            <button className="btn btn-danger mt-3 w-100" onClick={clearAll}>
                Limpiar todas las tareas
            </button>
        </div>
    );
};

export default Home;