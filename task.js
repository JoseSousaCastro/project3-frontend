window.onload = async function () {
  const tokenValue = sessionStorage.getItem("token");
  const idTask = sessionStorage.getItem("taskId");
  console.log("taskId ==> " + idTask);
  showTask(idTask);


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

const LOW_PRIORITY = "Low";
const MEDIUM_PRIORITY = "Medium";
const HIGH_PRIORITY = "High";

// Definir os botões de priority
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

async function updateTask() {

  const priority = returnPriorityFromSelectedButton();
  console.log ("Prioridade ==> " + priority);

  console.log("Start date ==> " + document.getElementById("startDate-editTask").value);
  console.log("End date ==> " + document.getElementById("endDate-editTask").value);

  const task = {
    id: sessionStorage.getItem("taskId"),
    title: document.getElementById("titulo-task").value,
    description: document.getElementById("descricao-task").value,
    startDate: document.getElementById("startDate-editTask").value,
    endDate: document.getElementById("endDate-editTask").value,
    priority: priority,
    category: document.getElementById("categoria-task").value,
  };
  
  let updateSelectedTask = `http://localhost:8080/project3-backend/rest/tasks/update`;
  try {
    const response = await fetch( updateSelectedTask,{
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

async function showTask(idTask) {
  const task = await findTaskById(idTask);
  if (task) {
    document.getElementById("tasktitle").innerHTML = task.title; // Colocar o título no título da página
    document.getElementById("titulo-task").textContent = task.title; // Colocar o título no input title
    document.getElementById("descricao-task").textContent = task.description; // Colocar a descrição na text area
    document.getElementById("categoria-task").textContent = task.category; // Colocar a descrição na text area
    document.getElementById("startDate-editTask").value = task.startDate;
    document.getElementById("endDate-editTask").value = task.endDate;

    if (task.priority == LOW_PRIORITY) {
      lowButton.classList.add("selected");
      setPriorityButtonSelected(lowButton);
    } else if (task.priority == MEDIUM_PRIORITY) {
      mediumButton.classList.add("selected");
      setPriorityButtonSelected(mediumButton);
    } else if (task.priority == HIGH_PRIORITY) {
      highButton.classList.add("selected");
      setPriorityButtonSelected(highButton);
    }
  
  } else {
    alert("Task not found");
    sessionStorage.setItem("taskId", "");
    window.location.href = "home.html";
  }
}

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
    //sessionStorage.clear();
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
  if (priority === undefined) {
    newPriority = LOW_PRIORITY;
  } else if (priority === "LOW") {
    newPriority = LOW_PRIORITY;
  } else if (priority === "MEDIUM") {
    newPriority = MEDIUM_PRIORITY;
  } else if (priority === "HIGH") {
    newPriority = HIGH_PRIORITY;
  }
  return newPriority;
}


function returnPriorityFromSelectedButton() {
  const buttons = [lowButton, mediumButton, highButton];
  let selectedButton = buttons.find(btn => btn.classList.contains("selected"));
  if (selectedButton) {
    return convertPriorityEnum(selectedButton.innerText.toLowerCase());
  } else {
    throw new Error("No priority selected");
  }
}


// Event listener para o botão save
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", async () => {

  try {
      await updateTask();
      alert("Task updated successfully");
      window.location.href = "home.html";
   
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while updating the task");
  }
});
