window.onload = async function () {
  const tokenValue = sessionStorage.getItem("token");
  const UserRole = {
    DEVELOPER: "DEVELOPER",
    SCRUM_MASTER: "SCRUM_MASTER",
    PRODUCT_OWNER: "PRODUCT_OWNER",
  };

  if (tokenValue === null) {
    window.location.href = "index.html";
  } else {
    try {
      getFirstName();
      getPhotoUrl();
      loadTasks();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/users/roleByToken",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    const role = data.role;
    sessionStorage.setItem("role", role);
  } else {
    alert("role not found");
  }

  console.log("Role from sessionStorage: ", sessionStorage.getItem("role"));
  const role = sessionStorage.getItem("role");

  switch (role) {
    case UserRole.DEVELOPER:
      document.getElementById("users-info").style.display = "none";
      document.getElementById("users-info-scrum-master").style.display = "none";
      document.getElementById("categoryMenu").style.display = "none";
      document.getElementById("recycleMenu").style.display = "none";
      document.getElementById("div-filters").style.display = "none";
      break;

    case UserRole.SCRUM_MASTER:
      document.getElementById("users-info").style.display = "none";
      document.getElementById("first-name-label").style.display = "none";
      document.getElementById("categoryMenu").style.display = "none";
      break;

    case UserRole.PRODUCT_OWNER:
      document.getElementById("first-name-label").style.display = "none";
      document.getElementById("users-info-scrum-master").style.display = "none";
      break;

    default:
      break;
  }
};

// Function to load all tasks
async function loadTasks() {
  removeAllTaskElements();
  const tasks = await getAllTasks();
  displayTasks(tasks);
}

// Function to display tasks on the UI
function displayTasks(tasksArray) {
  tasksArray.forEach((task) => {
    const taskElement = createTaskElement(task);
    if (!taskElement) {
      console.error("Task element not created for task:", task);
      return;
    }
    task.stateId = task.state.toLowerCase();
    const panel = document.getElementById(task.stateId);
    if (!panel) {
      console.error("Panel not found for stateId:", task.stateId);
      return;
    }
    panel.appendChild(taskElement);
    attachDragAndDropListeners(taskElement);
  });
}

function cleanAllTaskFields() {
  document.getElementById("warningMessage2").innerText = "";
  // Limpar os input fields depois de adicionar a task
  document.getElementById("taskName").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("task-startDate").value = "";
  document.getElementById("task-limitDate").value = "";
  document.getElementById("dropdown-task-categories").value = "";
  removeSelectedPriorityButton();
  taskPriority = null;
}

const tasks = document.querySelectorAll(".task");
const panels = document.querySelectorAll(".panel");

function attachDragAndDropListeners(task) {
  // Adiciona os listeners de drag and drop a uma tarefa criada dinamicamente
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
}

panels.forEach((panel) => {
  panel.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(panel, e.clientY);
    const task = document.querySelector(".dragging");
    const panelID = panel.id.toUpperCase();

    if (afterElement == null) {
      panel.appendChild(task);
      task.state = panelID;
    } else {
      panel.insertBefore(task, afterElement);
      task.state = panelID;
    }
    updateTaskStatus(task.id, panelID);
  });
});

async function updateTaskStatus(taskId, newStatus) {
  const state = { state: newStatus };

  const updateTaskUrl = `http://localhost:8080/project3-backend/rest/tasks/status`;
  try {
    const response = await fetch(updateTaskUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
        taskId: taskId,
      },
      body: JSON.stringify(state),
    });
    const message = await response.text();
    console.log(message);
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

function getDragAfterElement(panel, y) {
  const draggableElements = [...panel.querySelectorAll(".task:not(.dragging)")]; // Dentro da lista de painéis, seleciona todos os elementos com a classe task que nao tenham a classe dragging
  return draggableElements.reduce(
    (closest, child) => {
      // Retorna o elemento mais próximo do que está a ser arrastado e que está a ser comparado
      const box = child.getBoundingClientRect(); // Retorna o tamanho do elemento e a sua posição relativamente ao viewport
      const offset = y - box.top - box.height / 2; // Calcula a distância entre o elemento que está a ser arrastado e o que está a ser comparado
      if (offset < 0 && offset > closest.offset) {
        // Se a distância for menor que 0 e maior que a distância do elemento mais próximo até agora
        return { offset: offset, element: child };
      } else {
        //
        return closest; // Retorna o elemento mais próximo até agora
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Definir os botões de priority
const lowButton = document.getElementById("low-button-home");
const mediumButton = document.getElementById("medium-button-home");
const highButton = document.getElementById("high-button-home");
let taskPriority;

function setPriorityButtonSelected(button, priority) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
  taskPriority = priority;
}

function removeSelectedPriorityButton() {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
}

getCategories()
  .then((categories) => {
    // Get the select element
    let dropdown = document.getElementById("dropdown-task-categories");

    // Add a placeholder option
    let placeholderOption = document.createElement("option");
    placeholderOption.text = "Choose an category";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropdown.add(placeholderOption);

    // Add options for categories
    categories.forEach(function (category) {
      let option = document.createElement("option");
      option.text = category.name;
      dropdown.add(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });

async function getCategories() {
  let getCategories = `http://localhost:8080/project3-backend/rest/tasks/category/all`;
  try {
    const response = await fetch(getCategories, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });
    if (response.ok) {
      const categories = await response.json();
      return categories; // Return the array of categories
    } else {
      throw new Error(`Failed to fetch categories: ${response.text()}`);
    }
  } catch (error) {
    console.error("Error loading categories list:", error);
    throw error; // Re-throw the error to handle it in the caller function if needed
  }
}

// Event listeners para os botões priority
lowButton.addEventListener("click", () =>
  setPriorityButtonSelected(lowButton, "LOW_PRIORITY")
);
mediumButton.addEventListener("click", () =>
  setPriorityButtonSelected(mediumButton, "MEDIUM_PRIORITY")
);
highButton.addEventListener("click", () =>
  setPriorityButtonSelected(highButton, "HIGH_PRIORITY")
);

// Cria uma nova task com os dados inseridos pelo utilizador => Input para função newTask
function createTask(
  title,
  description,
  priority,
  category,
  startDate,
  endDate
) {
  const task = {
    title: title,
    description: description,
    priority: priority,
    category: category,
    startDate: startDate,
    endDate: endDate,
  };
  return task;
}

async function newTask(task) {
  let newTask = `http://localhost:8080/project3-backend/rest/tasks/addTask`;

  try {
    const response = await fetch(newTask, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      // Handle error response
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const message = await response.text();
    alert(message);
  } catch (error) {
    console.error("Error updating task status:", error.message);
    alert("An error occurred while adding the task: " + error.message);
  }
}

async function getAllTasks() {
  let getTasks = `http://localhost:8080/project3-backend/rest/tasks/all`;

  try {
    const response = await fetch(getTasks, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const tasks = await response.json();
      return tasks;
    } else {
      const message = await response.text();
      alert(message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Task not created. Something went wrong");
  }
}

// Event listener do botão add task para criar uma nova task e colocá-la no painel ToDo (default para qualquer task criada)
document.getElementById("addTask").addEventListener("click", function () {
  let title = document.getElementById("taskName").value.trim();
  let description = document.getElementById("taskDescription").value.trim();
  let priority = taskPriority;
  let startDate = document.getElementById("task-startDate").value;
  let endDate = document.getElementById("task-limitDate").value;
  let category = document
    .getElementById("dropdown-task-categories")
    .value.trim();

  if (title === "") {
    document.getElementById("warningMessage2").innerText =
      "Please enter a title for the task.";
  } else if (description === "") {
    document.getElementById("warningMessage2").innerText =
      "Please enter a description for the task.";
  } else if (category === "") {
    document.getElementById("warningMessage2").innerText =
      "Please select a category for the task.";
  } else if (startDate === "") {
    document.getElementById("warningMessage2").innerText =
      "Please select a start date for the task.";
  } else if (endDate === "") {
    document.getElementById("warningMessage2").innerText =
      "Please select an end date for the task.";
  } else if (startDate > endDate) {
    document.getElementById("warningMessage2").innerText =
      "End date must be after start date.";
  } else if (document.getElementsByClassName("selected").length === 0) {
    document.getElementById("warningMessage2").innerText =
      "Please define a priority for the task.";
  } else {
    let task = createTask(
      title,
      description,
      priority,
      category,
      startDate,
      endDate
    );
    newTask(task).then(() => {
      removeAllTaskElements();
      loadTasks();
      cleanAllTaskFields();
    });
  }
});

function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.id = task.id;
  task.priority = task.priority;
  taskElement.priority = task.priority;
  taskElement.classList.add("task");
  if (task.priority === "LOW_PRIORITY") {
    taskElement.classList.add("low");
  } else if (task.priority === "MEDIUM_PRIORITY") {
    taskElement.classList.add("medium");
  } else if (task.priority === "HIGH_PRIORITY") {
    taskElement.classList.add("high");
  }
  taskElement.draggable = true;
  taskElement.description = task.description;
  taskElement.title = task.title;
  taskElement.stateId = task.stateId;

  const postIt = document.createElement("div");
  postIt.className = "post-it";

  const taskTitle = document.createElement("h3");
  taskTitle.textContent = task.title;
  const descriptionContainer = document.createElement("div");
  descriptionContainer.className = "post-it-text";
  const displayDescription = document.createElement("p");
  displayDescription.textContent = task.description;

  const deleteButton = document.createElement("img");
  deleteButton.src = "multimedia/dark-cross-01.png";
  deleteButton.className = "apagarButton";
  deleteButton.dataset.taskId = task.id;

  descriptionContainer.appendChild(displayDescription);
  postIt.appendChild(taskTitle);
  postIt.appendChild(deleteButton);
  postIt.appendChild(descriptionContainer);
  taskElement.appendChild(postIt);

  taskElement.addEventListener("dblclick", function () {
    sessionStorage.setItem("taskId", taskElement.id);
    window.location.href = "task.html";
  });

  return taskElement;
}

document.addEventListener("click", function (event) {
  if (event.target.matches(".apagarButton")) {
    const taskElement = event.target.closest(".task");
    const taskId = event.target.dataset.taskId;

    const deletemodal = document.getElementById("delete-modal");
    deletemodal.style.display = "grid";

    function deleteButtonClickHandler() {
      deleteTask(taskId);
      taskElement.remove();
      deletemodal.style.display = "none";
      deletebtn.removeEventListener("click", deleteButtonClickHandler);
    }

    const deletebtn = document.getElementById("delete-button");
    deletebtn.addEventListener("click", deleteButtonClickHandler);

    const cancelbtn = document.getElementById("cancel-delete-button");
    cancelbtn.addEventListener("click", () => {
      deletemodal.style.display = "none";
    });
  }
});

function removeAllTaskElements() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => task.remove());
}

async function deleteTask(id) {
  let deleteTaskUrl = `http://localhost:8080/project3-backend/rest/tasks/updateDeleted`;

  try {
    const response = await fetch(deleteTaskUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
        taskId: id,
      },
    });
    const message = await response.text(); // Extract the message from the response
    console.log(message);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

window.onclose = function () {
  // Limpa a local storage quando a página é fechada
  localStorage.removeItem("token");
};

//LOGOUT
document
  .getElementById("logout-button-header")
  .addEventListener("click", async function () {
    let logoutRequest =
      "http://localhost:8080/project3-backend/rest/users/logout";

    try {
      const response = await fetch(logoutRequest, {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
      });
      if (response.ok) {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  });

async function getFirstName() {
  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/users/userByToken",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    }
  );

  if (response.ok) {
    const user = await response.json();
    document.getElementById("first-name").innerText = user.firstName;
  } else if (!response.ok) {
    alert("Invalid credentials");
  }
}

async function getPhotoUrl() {
  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/users/userByToken",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    }
  );

  if (response.ok) {
    const user = await response.json();
    console.log(user.photoURL);
    document.getElementById("profile-pic").src = user.photoURL;
  } else if (response.stateId === 401) {
    alert("Invalid credentials");
  } else if (response.stateId === 404) {
    alert("teste 404");
  }
}

// Function to filter tasks by user
async function filterByUser(selectedUser) {
  removeAllTaskElements();
  const tasks = await getUserTasks(selectedUser);
  displayTasks(tasks);
}

// Event listener for the filter button for users
document
  .getElementById("filter-button-users")
  .addEventListener("click", function () {
    const selectedUser = document.getElementById("dropdown-users-select").value;
    if (selectedUser !== "Choose an user") {
      filterByUser(selectedUser);
    }
  });

getUsernames()
  .then((usernames) => {
    // Get the select element
    let dropdown = document.getElementById("dropdown-users-select");

    // Add a placeholder option
    let placeholderOption = document.createElement("option");
    placeholderOption.text = "Choose an user";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropdown.add(placeholderOption);

    // Add options for categories
    usernames.forEach(function (user) {
      let option = document.createElement("option");
      option.text = user.username;
      dropdown.add(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching users:", error);
  });

async function getUsernames() {
  let getUsers = `http://localhost:8080/project3-backend/rest/users/username`;
  try {
    const response = await fetch(getUsers, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });
    if (response.ok) {
      const usernames = await response.json();
      return usernames; // Return the array of users
    } else {
      throw new Error(`Failed to fetch users: ${response.text()}`);
    }
  } catch (error) {
    console.error("Error loading users list:", error);
    throw error; // Re-throw the error to handle it in the caller function if needed
  }
}

// Function to fetch tasks for the selected username
async function getUserTasks(username) {
  let getTasks = `http://localhost:8080/project3-backend/rest/tasks/userTasks`;
  try {
    const response = await fetch(getTasks, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
        username: username,
      },
    });
    if (response.ok) {
      const tasks = await response.json();
      return tasks; // Return the array of tasks
    } else {
      throw new Error(`Failed to fetch tasks: ${response.text()}`);
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
    throw error;
  }
}

// Function to filter tasks by category
async function filterByCategory(selectedCategory) {
  removeAllTaskElements();
  console.log("entrei2");
  const tasks = await getCategoryTasks(selectedCategory);
  console.log("passou");
  displayTasks(tasks);
}

document
  .getElementById("filter-button-categories")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    const selectedCategory = document.getElementById(
      "dropdown-category-select"
    ).value;
    if (selectedCategory !== "Choose an category") {
      filterByCategory(selectedCategory);
      console.log("entrei");
    } else {
      console.log("não entrei");
    }
  });

getCategories()
  .then((categories) => {
    // Get the select element
    let dropdown1 = document.getElementById("dropdown-category-select");

    // Add a placeholder option
    let placeholderOption1 = document.createElement("option");
    placeholderOption1.text = "Choose an category";
    placeholderOption1.disabled = true;
    placeholderOption1.selected = true;
    dropdown1.add(placeholderOption1);

    // Add options for categories
    categories.forEach(function (category) {
      let option = document.createElement("option");
      option.text = category.name;
      dropdown1.add(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });

// Function to fetch tasks for the selected category
async function getCategoryTasks(categoryName) {
  console.log(categoryName);
  let getTasks = `http://localhost:8080/project3-backend/rest/tasks/categoryTasks`;
  const response = await fetch(getTasks, {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
      Accept: "*/*",
      token: sessionStorage.getItem("token"),
      categoryName: categoryName,
    },
  });
  if (response.ok) {
    const tasks = await response.json();
    console.log(tasks);
    return tasks; // Return the array of tasks
  } else {
    console.log(response.status);
  }
}
