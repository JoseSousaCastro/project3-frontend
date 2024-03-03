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
  getPhotoUrl();
  getFirstName();
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
  document.querySelector(".users-table-body").innerHTML = "";
  array.forEach((user) => {
    if (user.deleted) {
    } else {
      const row = document.createElement("tr");

      // Criar célula para o nome de usuário
      const usernameCell = document.createElement("td");
      //usernameCell.className = "clickable";
      usernameCell.textContent = user.username;
      usernameCell.className = "username-cell";

      // Criar célula para a função do usuário (role)
      const roleCell = document.createElement("td");
      const roleText = roleMapping[user.role] || "Unknown Role";
      roleCell.textContent = roleText;
      //roleCell.className = "text-center";

      // Criar célula para o status de exclusão do usuário
      const deletedCell = document.createElement("td");
      const deletedText = deletedMapping[user.deleted] || "Unknown";
      deletedCell.textContent = deletedText;
      //deletedCell.className = "text-center";

      // Adicionar as células à linha
      row.appendChild(usernameCell);
      row.appendChild(roleCell);
      row.appendChild(deletedCell);

      if (user.role === 100) {
        row.classList.add("developer-highlight");
      } else if (user.role === 200) {
        row.classList.add("scrum-master-highlight");
      } else if (user.role === 300) {
        row.classList.add("product-owner-highlight");
      }

      // Adicionar a linha à tabela
      document.querySelector(".users-table-body").appendChild(row);

      // Adicionar evento de clique para exibir detalhes do usuário
      usernameCell.addEventListener("click", () => {
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

    document.getElementById("usernameInput-userDetailsModal").value = user.username;
    document.getElementById("roleInput-userDetailsModal").value =
      roleMapping[user.role] || "Unknown Role";
    document.getElementById("deletedInput-userDetailsModal").value =
      deletedMapping[user.deleted] || "Unknown";
    document.getElementById("firstNameInput-userDetailsModal").value = user.firstName;
    document.getElementById("lastNameInput-userDetailsModal").value = user.lastName;
    document.getElementById("emailInput-userDetailsModal").value = user.email;
    document.getElementById("phoneInput-userDetailsModal").value = user.phone;

    modal.style.display = "flex";
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
  document.getElementById("usernameInput-userDetailsModal").removeAttribute("readonly");
  document.getElementById("roleInput-userDetailsModal").removeAttribute("disabled");
  document.getElementById("deletedInput-label-userDetailsModal").removeAttribute("disabled");
  document.getElementById("firstNameInput-userDetailsModal").removeAttribute("readonly");
  document.getElementById("lastNameInput-userDetailsModal").removeAttribute("readonly");
  document.getElementById("emailInput-userDetailsModal").removeAttribute("readonly");
  document.getElementById("phoneInput-userDetailsModal").removeAttribute("readonly");
}

function disableEdit() {
  document.getElementById("usernameInput-userDetailsModal").setAttribute("readonly", true);
  document.getElementById("roleInput-userDetailsModal").setAttribute("disabled", true);
  document.getElementById("deletedInput-label-userDetailsModal").setAttribute("disabled", true);
  document.getElementById("firstNameInput-userDetailsModal").setAttribute("readonly", true);
  document.getElementById("lastNameInput-userDetailsModal").setAttribute("readonly", true);
  document.getElementById("emailInput-userDetailsModal").setAttribute("readonly", true);
  document.getElementById("phoneInput-userDetailsModal").setAttribute("readonly", true);
}

async function editProfile() {
  const userDto = {
    username: document.getElementById("usernameInput-userDetailsModal").value,
    firstName: document.getElementById("firstNameInput-userDetailsModal").value,
    lastName: document.getElementById("lastNameInput-userDetailsModal").value,
    email: document.getElementById("emailInput-userDetailsModal").value,
    phone: document.getElementById("phoneInput-userDetailsModal").value,
    deleted: document.getElementById("deletedInput-userDetailsModal").value,
    role: document.getElementById("roleInput-userDetailsModal").value,
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
  modal.style.display = "flex";
}

function closeAddUserModal() {
  const modal = document.getElementById("addUserModal");
  modal.style.display = "none";
}

async function submitNewUser() {
  const username = document
    .getElementById("username-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");
  const password = document
    .getElementById("password-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");
  const email = document
    .getElementById("email-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");
  const phone = document
    .getElementById("phone-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");
  const firstName = document
    .getElementById("firstName-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");
  const lastName = document
    .getElementById("lastName-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");
  const role = document.getElementById("role-select-addUserModal").value.trim().replace(/\s+/g, "");
  const photoURL = document
    .getElementById("photo-label-addUserModal")
    .value.trim()
    .replace(/\s+/g, "");

  // Validação do email com apenas um '@'
  const atSymbolIndex = email.indexOf("@");
  const isEmailValid =
    atSymbolIndex > 0 && email.indexOf("@", atSymbolIndex + 1) === -1;

  // Validação do email com pelo menos um '.'
  const dotSymbolIndex = email.indexOf(".", atSymbolIndex);
  const isDotValid = dotSymbolIndex > atSymbolIndex;
  const isValidPhotoURL = /^(ftp|http|https):\/\/[^ "]+$/.test(photoURL);

  if (
    !username ||
    !password ||
    !isEmailValid ||
    !isDotValid ||
    !phone ||
    !firstName ||
    !lastName ||
    !role ||
    !isValidPhotoURL
  ) {
    alert("Invalid inputs");
  } else {
    const newUser = {
      username: username,
      password: password,
      email: email,
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      role: role,
      photoURL: photoURL,
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
      fetchUsers();
      closeAddUserModal();
    } else {
      alert("ERRO: " + response.status);
      console.log(newUser.role);
    }
  }
}
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
    console.log(user);
    console.log(user.photoURL);
    document.getElementById("profile-pic").src = user.photoURL;
  } else if (response.stateId === 401) {
    alert("Invalid credentials");
  } else if (response.stateId === 404) {
    alert("teste 404");
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


document.getElementById("userDetailsModal").addEventListener("click", function(event) {
  const modalContent = document.getElementById("modal-content-users");

  // Verifica se o clique ocorreu fora do modal content
  if (!modalContent.contains(event.target)) {
    closeModal();
  }
});
document.getElementById("addUserModal").addEventListener("click", function(event) {
  const modalContent = document.getElementById("modal-content-addUsers");

  // Verifica se o clique ocorreu fora do modal content
  if (!modalContent.contains(event.target)) {
    closeModal();
  }
});

