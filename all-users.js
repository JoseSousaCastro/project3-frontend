const roleMapping = {
  100: "DEVELOPER",
  200: "SCRUM_MASTER",
  300: "PRODUCT_OWNER",
};

const deletedMapping = {
  false: "Not deleted",
  true: "Deleted",
};

const tokenValue = sessionStorage.getItem("token");

document.addEventListener("DOMContentLoaded", function () {
  fetchUsers();
});

async function fetchUsers() {
  try {
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/users/checkUsers",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: tokenValue,
        },
      }
    );

    if (response.ok) {
      const usersArray = await response.json();

      showUsersList(usersArray);
    } else {
      alert(response.status);
    }
  } catch (error) {
    console.error("Error loading users list:", error);
  }
}

function showUsersList(array) {
  document.querySelector(".retros-table-body").innerHTML = "";
  array.forEach((user) => {
    if (user.deleted) {
    } else {
      const row = document.createElement("tr");

      // Criar célula para o nome de usuário
      const usernameCell = document.createElement("td");
      usernameCell.className = "clickable";
      usernameCell.textContent = user.username;
      usernameCell.className = "clickable text-center";

      // Criar célula para a função do usuário (role)
      const roleCell = document.createElement("td");
      const roleText = roleMapping[user.role] || "Unknown Role";
      roleCell.textContent = roleText;
      roleCell.className = "text-center";

      // Criar célula para o status de exclusão do usuário
      const deletedCell = document.createElement("td");
      const deletedText = deletedMapping[user.deleted] || "Unknown";
      deletedCell.textContent = deletedText;
      deletedCell.className = "text-center";

      // Adicionar as células à linha
      row.appendChild(usernameCell);
      row.appendChild(roleCell);
      row.appendChild(deletedCell);

      // Adicionar a linha à tabela
      document.querySelector(".retros-table-body").appendChild(row);

      // Adicionar evento de clique para exibir detalhes do usuário
      usernameCell.addEventListener("dblclick", () => {
        showUserDetails(user.id);
      });
    }
  });
}

async function showUserDetails(idUser) {
  const user = await findUserById(idUser);
  if (user) {
    const modal = document.getElementById("userDetailsModal");
    //const userDetailsContainer = document.getElementById("userDetails");

    document.getElementById("usernameInput").value = user.username;
    document.getElementById("roleInput").value =
      roleMapping[user.role] || "Unknown Role";
    document.getElementById("deletedInput").value =
      deletedMapping[user.deleted] || "Unknown";
    document.getElementById("firstNameInput").value = user.firstName;
    document.getElementById("lastNameInput").value = user.lastName;
    document.getElementById("emailInput").value = user.email;
    document.getElementById("phoneInput").value = user.phone;

    modal.style.display = "block";
  }
}

async function findUserById(idUser) {
  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/users/userById",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: tokenValue,
        id: idUser,
      },
    }
  );
  if (response.ok) {
    const user = await response.json();
    return user;
  }
}

function closeUserDetailsModal() {
  const modal = document.getElementById("userDetailsModal");
  modal.style.display = "none";
}

function enableEdit() {
  document.getElementById("usernameInput").removeAttribute("readonly");
  document.getElementById("roleInput").removeAttribute("disabled");
  document.getElementById("deletedInput").removeAttribute("disabled");
  document.getElementById("firstNameInput").removeAttribute("readonly");
  document.getElementById("lastNameInput").removeAttribute("readonly");
  document.getElementById("emailInput").removeAttribute("readonly");
  document.getElementById("phoneInput").removeAttribute("readonly");
}

function disableEdit() {
  document.getElementById("usernameInput").setAttribute("readonly", true);
  document.getElementById("roleInput").setAttribute("disabled", true);
  document.getElementById("deletedInput").setAttribute("disabled", true);
  document.getElementById("firstNameInput").setAttribute("readonly", true);
  document.getElementById("lastNameInput").setAttribute("readonly", true);
  document.getElementById("emailInput").setAttribute("readonly", true);
  document.getElementById("phoneInput").setAttribute("readonly", true);
}

async function editProfile() {
  const userDto = {
    username: document.getElementById("usernameInput").value,
    firstName: document.getElementById("firstNameInput").value,
    lastName: document.getElementById("lastNameInput").value,
    email: document.getElementById("emailInput").value,
    phone: document.getElementById("phoneInput").value,
    deleted: document.getElementById("deletedInput").value,
    role: document.getElementById("roleInput").value,
  };

  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/users/editOtherProfile",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: tokenValue,
      },
      body: JSON.stringify(userDto),
    }
  );

  if (response.ok) {
    await fetchUsers();
  } else {
    alert("ERRO:" + response.status);
  }
}

function closeModal() {
  const modal = document.getElementById("userDetailsModal");
  modal.style.display = "none";
}

function addNewUser() {
  const modal = document.getElementById("addUserModal");
  modal.style.display = "block";
}

function closeAddUserModal() {
  const modal = document.getElementById("addUserModal");
  modal.style.display = "none";
}

async function submitNewUser() {
  const newUser = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    role: document.getElementById("role").value,
    photoURL: document.getElementById("photo").value,
    deleted: false,
  };
  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/users/createUser",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: tokenValue,
      },
      body: JSON.stringify(newUser),
    }
  );
  if (response.ok) {
    alert("New user created.");
  } else {
    alert("ERRO: " + response.status);
    console.log(newUser.role);
  }
}
