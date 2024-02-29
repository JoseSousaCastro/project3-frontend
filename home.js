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
      getFirstName(usernameValue, passwordValue);
      getPhotoUrl(usernameValue, passwordValue);
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

  console.log("Role from sessionStorage:", sessionStorage.getItem("role"));
  if (
    sessionStorage.getItem("role") === UserRole.DEVELOPER ||
    sessionStorage.getItem("role") === UserRole.SCRUM_MASTER
  ) {
    console.log("Devia disabled");
    document.getElementById("users-info").style.display = "none";
  } else {
    console.log("HERE");
  }
};

function cleanAllTaskFields() {
  document.getElementById("warningMessage2").innerText = "";
  // Limpar os input fields depois de adicionar a task
  document.getElementById("taskName").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskStartDate").value = "";
  document.getElementById("taskEndDate").value = "";
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

    const panelID = panel.id.toUpperCase;

    if (afterElement == null) {
      panel.appendChild(task);
      task.stateId = panelID;
    } else {
      panel.insertBefore(task, afterElement);
      task.stateId = panelID;
    }
    updateTaskStatus(sessionStorage.getItem("token"), task.id, panelID);
  });
});

async function updateTaskStatus(taskId, newStatus) {
  const updateTaskUrl = `http://localhost:8080/proj3_vc_re_jc/rest/tasks/status`;
  try {
    const response = await fetch(updateTaskUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
        taskId: taskId,
      },
      body: JSON.stringify(newStatus),
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
  let newTask = `http://localhost:8080/proj3_vc_re_jc/rest/tasks/addTask`;

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
    const message = await response.text();
    alert(message);
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

async function getAllTasks() {
  let getTasks = `http://localhost:8080/proj3_vc_re_jc/rest/tasks/all`;

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
  console.log("addTask button clicked");

  let title = document.getElementById("taskName").value.trim();
  let description = document.getElementById("taskDescription").value.trim();
  let category = document.getElementById("taskCategory").value.trim();
  let priority = taskPriority;
  let startDate = document.getElementById("taskStartDate").value;
  let endDate = document.getElementById("taskEndDate").value;

  if (
    title === "" ||
    description === "" ||
    category === "" ||
    startDate === "" ||
    endDate === "" ||
    startDate > endDate ||
    document.getElementsByClassName("selected").length === 0
  ) {
    document.getElementById("warningMessage2").innerText =
      "Fill in all fields and define a priority";
  } else {
    let task = createTask(
      title,
      description,
      category,
      priority,
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
  task.priority = parsePriorityToString(task.priority);
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

// Carrega as tarefas guardadas na local storage
function loadTasks() {
  getAllTasks()
    .then((tasksArray) => {
      tasksArray.forEach((task) => {
        const taskElement = createTaskElement(task);
        if (!taskElement) {
          console.error("Task element not created for task:", task);
          return;
        }
        task.stateId = task.stateId.toUpperCase();
        const panel = document.getElementById(task.stateId);
        if (!panel) {
          console.error("Panel not found for stateId:", task.stateId);
          return;
        }
        panel.appendChild(taskElement);
        attachDragAndDropListeners(taskElement);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong while loading tasks");
    });
}

function removeAllTaskElements() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => task.remove());
}

async function deleteTask(id) {
  let deleteTaskUrl = `http://localhost:8080/proj3_vc_re_jc/rest/tasks/updateDeleted`;

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

async function getFirstName(usernameValue, passwordValue) {
  let firstNameRequest =
    "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/getFirstName";

  try {
    const response = await fetch(firstNameRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        username: usernameValue,
        password: passwordValue,
      },
    });

    if (response.ok) {
      const data = await response.text();
      document.getElementById("first-name-label").innerText = data;
    } else if (!response.ok) {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

async function getPhotoUrl(usernameValue, passwordValue) {
  let photoUrlRequest =
    "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/getPhotoUrl";

  try {
    const response = await fetch(photoUrlRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        username: usernameValue,
        password: passwordValue,
      },
    });

    if (response.ok) {
      const data = await response.text();
      document.getElementById("profile-pic").src = data;
    } else if (response.stateId === 401) {
      alert("Invalid credentials");
    } else if (response.stateId === 404) {
      alert("teste 404");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}
