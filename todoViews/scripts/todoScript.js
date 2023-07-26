const submitTodoNode = document.getElementById("submitTodo");
const userInputNode = document.getElementById("userInput");
const prioritySelectorNode = document.getElementById("prioritySelector");

const todoListNode = document.getElementById("todo-item");

// listen to click of submit button
submitTodoNode.addEventListener("click", function () {
  // get text from the input
  // send text to server using api ( fetch or xmlhttprequest )
  // get response from server
  // if request is successful then display text in the list
  // else display error message

  const todoText = userInputNode.value;
  const priority = prioritySelectorNode.value;

  if (!todoText || !priority) {
    alert("Please enter a todo");
    return;
  }

  const todo = {
    todoText, // if key and value are same then we can write it like this
    priority,
  };

  fetch("/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  }).then(function (response) {
    console.log(response);
    if (response.status === 200) {
      // display todo in UI
      showTodoInUI(todo);
    } else if (response.status === 401) {
      window.location.href = "/login";
    } else {
      alert("something weird happened");
    }
  });
});

function showTodoInUI(todo) {
  const todoTextNode = document.createElement("nikhil");
  todoTextNode.innerText = todo.todoText;

  const priorityNode = document.createElement("span");
  priorityNode.innerText = todo.priority;

  todoListNode.appendChild(todoTextNode);
  todoListNode.appendChild(priorityNode);
}

fetch("/todo-data")
  .then(function (response) {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      window.location.href = "/login";
    } else {
      alert("something weird happened");
    }
  })
  .then(function (todos) {
    todos.forEach(function (todo) {
      showTodoInUI(todo);
    });
  });
