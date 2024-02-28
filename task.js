window.onload = async function () {
  const tokenValue = sessionStorage.getItem("token");

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
};

const taskId = sessionStorage.getItem("taskId");

// Definir os botões de status
const todoButton = document.getElementById("todo-button"); // Atribuir o elemento respetivo à variável todoButton
const doingButton = document.getElementById("doing-button"); // Atribuir o elemento respetivo à variável doingButton
const doneButton = document.getElementById("done-button"); // Atribuir o elemento respetivo à variável doneButton

// Definir os botões de priority
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

async function updateTask() {

  const priority = returnPriorityFromSelectedButton();
  const stateId = returnStateIdFromSelectedButton();

  const task = {
    id: taskId,
    title: document.getElementById("title-task").value,
    description: document.getElementById("description-task").value,
    category: document.getElementById("category-task").value,
    priority: priority,
    stateId: stateId,
    description: document.getElementById("startDate-editTask").value,
    category: document.getElementById("endDate-editTask").value,
         
  };
  let firstNameRequest = `http://localhost:8080/proj3_vc_re_jc/rest/tasks/update`;
  try {
    const response = await fetch(
      firstNameRequest,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/JSON",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(task),
      }
    );
    const message = await response.text();
    alert(message);
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Something went wrong");
    throw error; // Propagar o erro para ser tratado no catch do bloco que chamou a função
  }
}

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
    alert("Something went wrong");
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
    const message = await response.text();
    alert(message);
  } catch (error) {
    alert("Something went wrong");
  }
}

async function showTask(taskId) {
  const task = await findTaskById(taskId);
  if (task) {
    document.getElementById("title-task").textContent = task.title; // Colocar o título no input title
    document.getElementById("description-task").textContent = task.description; // Colocar a descrição na text area
    document.getElementById("category-task").textContent = task.category; // Colocar a descrição na text area
    document.getElementById("tasktitle").innerHTML = task.title; // Colocar o título no título da página
    document.getElementById("startDate-editTask").value = task.startDate;
    document.getElementById("endDate-editTask").value = task.limitDate;

    let taskStateId = task.stateId;
  
    if (taskStateId == TODO) {
      todoButton.classList.add("selected");
      setStatusButtonSelected(todoButton);
    } else if (taskStateId == DOING) {
      doingButton.classList.add("selected");
      setStatusButtonSelected(doingButton);
    } else if (taskStateId == DONE) {
      doneButton.classList.add("selected");
      setStatusButtonSelected(doneButton);
    }

    let taskPriority = task.priority;

    if (taskPriority == LOW_PRIORITY) {
      lowButton.classList.add("selected");
      setPriorityButtonSelected(lowButton);
    } else if (taskPriority == MEDIUM_PRIORITY) {
      mediumButton.classList.add("selected");
      setPriorityButtonSelected(mediumButton);
    } else if (taskPriority == HIGH_PRIORITY) {
      highButton.classList.add("selected");
      setPriorityButtonSelected(highButton);
    }
  } else {
    alert("Task not found");
    sessionStorage.clear();
    window.location.href = "home.html";
  }
}


// Event listeners para os botões status
todoButton.addEventListener("click", () => setStatusButtonSelected(todoButton));
doingButton.addEventListener("click", () => setStatusButtonSelected(doingButton));
doneButton.addEventListener("click", () => setStatusButtonSelected(doneButton));

// Event listeners para os botões priority
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton));

const cancelbutton = document.getElementById("cancel-button");

cancelbutton.addEventListener("click", () => {
  // Abrir o modal de cancel
  const cancelModal = document.getElementById("cancel-modal");
  cancelModal.style.display = "block";

  const cancelButton = document.getElementById("continue-editing-button");
  cancelButton.addEventListener("click", () => {
    window.location.href = "task.html";
  });

  // Event listener para o botão de confirmação
  const confirmButton = document.getElementById("confirm-cancel-button");
  confirmButton.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "home.html";
  });

  cancelModal.style.display = "grid";
});

// Função para definir o estado no grupo de botões status
function setStatusButtonSelected(button) {
  const buttons = [todoButton, doingButton, doneButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
}

// Função para definir o estado no grupo de botões priority
function setPriorityButtonSelected(button) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
}

async function findTaskById(taskId) {
  try {
    const tasksArray = await getAllTasks();
    const task = tasksArray.find((task_1) => task_1.id === taskId);
    return task;
  } catch (error) {
    alert("Something went wrong while loading tasks");
  }
}

function convertPriorityEnum(priority) {
  let newPriority;
  if (priority === "low") {
    newPriority = LOW_PRIORITY;
  } else if (priority === "medium") {
    newPriority = MEDIUM_PRIORITY;
  } else if (priority === "high") {
    newPriority = HIGH_PRIORITY;
  }
  return newPriority;
}

function returnPriorityFromSelectedButton() {
  const buttons = [lowButton, mediumButton, highButton];
  let selectedButton = null;
  buttons.forEach((btn) => {
    if (btn.classList.contains("selected")) {
      selectedButton = btn;
    }
  });
  const priorityInt = convertPriorityEnum(selectedButton.innerText.toLowerCase());
  return priorityInt;
} 

function returnStateIdFromSelectedButton() {
  const buttons = [todoButton, doingButton, doneButton];
  let selectedButton = null;
  buttons.forEach((btn) => {
    if (btn.classList.contains("selected")) {
      selectedButton = btn;
    }
  });
  const stateIdInt = selectedButton.innerText.toUpperCase();
  return stateIdInt;
}

// Event listener para o botão save
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", async () => {

  try {
      await updateTask();
      alert("Task updated successfully");
      sessionStorage.clear();
      window.location.href = "home.html";
   
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while updating the task");
  }
});
