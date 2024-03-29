document.addEventListener("DOMContentLoaded", async function () {
  try {
    const allDeletedTasks = await getDeletedTasks(); // Wait for the categories to be fetched
    showTaskList(allDeletedTasks);
    getFirstName();
    getPhotoUrl();
  } catch (error) {
    console.error("Error loading categories:", error);
    // Handle error loading categories
  }
  const UserRole = {
    DEVELOPER: "DEVELOPER",
    SCRUM_MASTER: "SCRUM_MASTER",
    PRODUCT_OWNER: "PRODUCT_OWNER",
  };

  
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

  const role = sessionStorage.getItem("role");
  switch (role) {
    case UserRole.DEVELOPER:
      document.getElementById("restoreb").style.display = "none";
      document.getElementById("restorebb").style.display = "none";
      document.getElementById("restorebbb").style.display = "none";
      break;

    case UserRole.SCRUM_MASTER:
      document.getElementById("restoreb").style.display = "none";
      document.getElementById("restorebb").style.display = "none";
      document.getElementById("restorebbb").style.display = "none";
      break;

    case UserRole.PRODUCT_OWNER:
      break;

    default:
      break;
  }
});

async function getDeletedTasks() {
  let getDeleted = `http://localhost:8080/project3-backend/rest/tasks/deletedTasks`;
  try {
    const response = await fetch(getDeleted, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });
    if (response.ok) {
      const tasks = await response.json();
      return tasks; // Return the array of categories
    } else {
      throw new Error(`Failed to fetch categories: ${response.text()}`);
    }
  } catch (error) {
    console.error("Error loading categories list:", error);
    throw error; // Re-throw the error to handle it in the caller function if needed
  }
}

function showTaskList(tasks) {
  document.querySelector(".recycle-table-body").innerHTML = "";
  tasks.forEach((task) => {
    const row = document.createElement("tr");
    // Criar célula para o id da categoria
    const iDCell = document.createElement("td");
    iDCell.textContent = task.id;
    iDCell.className = "clickable text-center";

    // Criar célula para o nome da categoria
    const nameCell = document.createElement("td");
    nameCell.textContent = task.title;
    nameCell.className = "clickable text-center";

    // Adicionar as células à linha
    row.appendChild(iDCell);
    row.appendChild(nameCell);

    // Adicionar a linha à tabela
    document.querySelector(".recycle-table-body").appendChild(row);
  });
}

async function refreshList() {
  try {
    const allDeleted = await getDeletedTasks(); // Wait for the categories to be fetched
    showTaskList(allDeleted);
  } catch (error) {
    console.error("Error loading categories:", error);
    // Handle error loading categories
  
  function restoreTask() {
    const modal = document.getElementById("restoreTaskModal");
    modal.style.display = "flex";
    document.getElementById("restoreId").value = "";
  }
}
}


function restoreTask() {
  const modal = document.getElementById("restoreTaskModal");
  modal.style.display = "block";
  document.getElementById("restoreId").value = "";
}

function closeRestoreTaskModal() {
  const modal = document.getElementById("restoreTaskModal");
  modal.style.display = "none";
}

async function submitRestoreTask() {
  const idRestore = document.getElementById("restoreId").value;

  try {
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/tasks/restoreDeleted",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
          taskId: idRestore,
        },
      }
    );
    const message = await response.text(); // Get response body as text
    if (response.ok) {
      alert(message);
      closeRestoreTaskModal(); // Close the modal
      await refreshList(); // Refresh the displayed list
    } else {
      alert(message);
      document.getElementById("restoreId").value = "";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

  
  
  function removeTask() {
    const modal = document.getElementById("removeTaskModal");
    modal.style.display = "flex";
    document.getElementById("removeId").value = "";
  }
  
  function closeRemoveTaskModal() {
    const modal = document.getElementById("removeTaskModal");
    modal.style.display = "none";
  }
  
  async function submitRemoveTask() {
    const idRemove = document.getElementById("removeId").value;
    try {
      const response = await fetch(
        "http://localhost:8080/project3-backend/rest/tasks/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: sessionStorage.getItem("token"),
            taskId: idRemove,
          },
        }
      );
    const message = await response.text(); // Get response body as text
    if (response.ok) {
      alert(message);
      closeRemoveTaskModal(); // Close the modal
      await refreshList(); // Refresh the displayed list
    } else {
      alert(message);
      document.getElementById("removeId").value = "";
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

async function removeAllUserTasks() {
  try {
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/tasks/updateDeleted/userTasks",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
      }
    );
    const message = await response.text(); // Get response body as text
    if (response.ok) {
      alert(message);
      await refreshList(); // Refresh the displayed list
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


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