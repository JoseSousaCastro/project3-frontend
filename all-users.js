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
      "http://localhost:8080/proj3_vc_re_jc/rest/users/checkUsers",
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
      console.log(usersArray);
      showUsersList(usersArray);
      alert("Users found");
    } else {
      alert(response.status);
    }
  } catch (error) {
    console.error("Error loading users list:", error);
  }
}

function showUsersList(array) {
  array.forEach((user) => {
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
  });
}

async function showUserDetails(idUser) {
  const user = await findUserById(idUser);
  if (user) {
    const modal = document.getElementById("userDetailsModal");
    const userDetailsContainer = document.getElementById("userDetails");

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
    "http://localhost:8080/proj3_vc_re_jc/rest/users/userById",
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
  document.getElementById("roleInput").removeAttribute("readonly");
  document.getElementById("deletedInput").removeAttribute("readonly");
  document.getElementById("firstNameInput").removeAttribute("readonly");
  document.getElementById("lastNameInput").removeAttribute("readonly");
  document.getElementById("emailInput").removeAttribute("readonly");
  document.getElementById("phoneInput").removeAttribute("readonly");
}
