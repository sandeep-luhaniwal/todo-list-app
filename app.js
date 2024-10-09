const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// In-memory storage for todos
let todos = [];

// GET endpoint to fetch all todo items
app.get("/todos", (req, res) => {
    res.json(todos);
});

// POST endpoint to create a new todo item
app.post("/todos", (req, res) => {
    const todo = {
        id: todos.length + 1,
        title: req.body.title,
        completed: req.body.completed || false,
    };
    todos.push(todo);
    res.status(201).json(todo);
});

// PUT endpoint to update an existing todo item by id
app.put("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    // Update only the properties provided in the request body
    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    res.json(todo);
});

// DELETE endpoint to remove a todo item by id
app.delete("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Todo not found" });
    }
    todos.splice(index, 1);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
