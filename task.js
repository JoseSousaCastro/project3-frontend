window.onload = async function () {
  const tokenValue = sessionStorage.getItem("token");
  const idTask = sessionStorage.getItem("taskId");
  console.log("taskId ==> " + idTask);
  showTask(idTask);

    // Código de user para editar!!!!!

  if (tokenValue === null) {
    window.location.href = "index.html";
  } else {
    try {
      getFirstName(usernameValue, passwordValue);
      getPhotoUrl(usernameValue, passwordValue);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
};

const taskId = sessionStorage.getItem("taskId");

// Definir os botões de priority
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

async function updateTask() {

  let title = document.getElementById("titulo-task").value.trim();
  let description = document.getElementById("descricao-task").value.trim();
  let priority = returnPriorityFromSelectedButton();
  let startDate = document.getElementById("startDate-editTask").value;
  let endDate = document.getElementById("endDate-editTask").value;
  let category = document.getElementById("categoria-task").value;

  const task = {
    id: sessionStorage.getItem("taskId"),
    title: title,
    description: description,
    startDate: startDate,
    endDate: endDate,
    priority: priority,
    category: category,
  };
  let updateSelectedTask = `http://localhost:8080/project3-backend/rest/tasks/update`;
  try {
    const response = await fetch(
      updateSelectedTask,
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
    return message; // Return the message received from the backend
  } catch (error) {
    console.error("An error occurred:", error);
    alert("Something went wrong");
    throw error;
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

async function showTask(taskId) {
  const task = await findTaskById(taskId);
  if (task) {
    document.getElementById("tasktitle").innerHTML = task.title; // Colocar o título no título da página
    document.getElementById("titulo-task").textContent = task.title; // Colocar o título no input title
    document.getElementById("descricao-task").textContent = task.description; // Colocar a descrição na text area
    document.getElementById("categoria-task").textContent = task.category; // Colocar a descrição na text area
    document.getElementById("startDate-editTask").value = task.startDate;
    document.getElementById("endDate-editTask").value = task.endDate;

    if (task.priority == "LOW_PRIORITY") {
      lowButton.classList.add("selected");
      setPriorityButtonSelected(lowButton);
    } else if (task.priority == "MEDIUM_PRIORITY") {
      mediumButton.classList.add("selected");
      setPriorityButtonSelected(mediumButton);
    } else if (task.priority == "HIGH_PRIORITY") {
      highButton.classList.add("selected");
      setPriorityButtonSelected(highButton);
    }
  } else {
    alert("Task not found");
    sessionStorage.clear();
    window.location.href = "home.html";
  }
}

// Event listeners para os botões priority
lowButton.addEventListener("click", () => {
  setPriorityButtonSelected(lowButton);
});

mediumButton.addEventListener("click", () => {
  setPriorityButtonSelected(mediumButton);
});

highButton.addEventListener("click", () => {
  setPriorityButtonSelected(highButton);
});

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
    sessionStorage.setItem("taskId", "");
    window.location.href = "home.html";
  });

  cancelModal.style.display = "grid";
});

// Função para definir o estado no grupo de botões priority
function setPriorityButtonSelected(button) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
}

async function findTaskById(taskId) {
  let getTask = `http://localhost:8080/project3-backend/rest/tasks/task`;

  try {
    const response = await fetch(getTask, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
        taskId: taskId,
      },
    });
    if (response.ok) {
      const selectedTask = await response.json();
      return selectedTask;
    } else {
      const message = await response.text();
      alert(message);
      throw new Error(`Error fetching task: ${message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Task not created. Something went wrong");
    throw error;
  }
}

function convertPriorityEnum(priority) {
  let newPriority;
  if (priority === "low") {
    newPriority = "LOW_PRIORITY";
  } else if (priority === "medium") {
    newPriority = "MEDIUM_PRIORITY";
  } else if (priority === "high") {
    newPriority = "HIGH_PRIORITY";
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

// Event listener for the save button
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", async () => {
  try {
    const message = await updateTask(); // Capture the message returned from updateTask()

    // Check if the update task was successful 
    if (message === "Task updated successfully") {
      // If successful, clear taskId and navigate to home.html
      sessionStorage.setItem("taskId", "");
      alert(message);
      window.location.href = "home.html";
    } else {
      // If not successful, display an alert message
      alert(message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while updating the task");
  }
});

