const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.userName = user;

  next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  if (name === "" || username === "") {
    return response.status(400).json({ error: "Name or user name invalid" });
  }

  const existsUser = users.find((user) => user.username === username)

  if(existsUser) {
    return response.status(400).json({error: 'User name registered'})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userName } = request;
  const {todos} = userName

  return response.status(200).json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { userName } = request;

  if (title === "" || deadline === "") {
    response.status(400).json({ menssagem: "Title or Deadline is null" });
  }

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  userName.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userName } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;


  userName.todos.map((todo) => {
    if (todo.id === id) {
      todo.title = title;
      todo.deadline = new Date(deadline)
      return response.status(200).json(todo);
    }
  });

  return response.status(404).json({ error: "Todo ID not found" });
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userName } = request;
  const { id } = request.params;

  userName.todos.map((todo) => {
    if (todo.id === id) {
      todo.done = true;
      return response.status(200).json(todo);
    }
  });

  return response.status(404).json({ error: "Todo ID not found" });
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { userName } = request;
  const { id } = request.params;

  const todoRemove = userName.todos.find((todo) => todo.id === id);

  if (todoRemove) {
    const indexTodo = userName.todos.indexOf(todoRemove);
    userName.todos.splice(indexTodo, 1);

    return response.status(204).send();
  }

  return response.status(404).json({ error: "Todo ID not found" });
});

module.exports = app;
