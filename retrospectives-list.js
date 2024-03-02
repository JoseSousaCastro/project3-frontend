window.onload = function () {
  //getFirstName();
  getPhotoUrl();
  getRetroList();
};

function cleanRetroFields() {
  document.getElementById("warningMessage2").innerText = "";
  document.getElementById("retroTitle").value = "";
  document.getElementById("retroDate").value = "";
}

async function getRetroList() {
  console.log("getRetroList");
  let retroListRequest =
    "http://localhost:8080/project3-backend/rest/retrospective/all";

  try {
    const response = await fetch(retroListRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      data.forEach((retro) => {
        createRetroTableBody(retro);
        console.log(retro.eventId);
      });
    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Error 404");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

function createRetro(title, date) {
  let retro = {
    title: title,
    date: date,
  };
  return retro;
}

async function addRetrospectiveToBackend(title, date) {
  const retro = {
    title: title,
    schedulingDate: date,
  };

  console.log(retro);
  try {
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/retrospective/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(retro),
      }
    );
    if (response.ok) {
      removeAllRetroElements();
      getRetroList();
      cleanRetroFields();
    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Error 404");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

document.getElementById("addRetroBTN").addEventListener("click", function () {
  let date = document.getElementById("retroDate").value.toString();
  let title = document.getElementById("retroTitle").value.trim();

  if (date === "" || title === "") {
    console.log("entrou no if para verificar se os campos estão preenchidos");

    document.getElementById("warningMessage2").innerText =
      "Please fill in all fields";
  } else {
    addRetrospectiveToBackend(title, date);
  }
});

function removeAllRetroElements() {
  const retros = document.querySelectorAll(".retros-row");
  retros.forEach((retro) => retro.remove());
}

async function createRetroTableBody(retro) {
  let tbody = document.querySelector(".retros-table-body");

  let row = document.createElement("tr");
  row.classList.add("retros-row");

  let dateCell = document.createElement("td");
  dateCell.textContent = retro.schedulingDate;

  let titleCell = document.createElement("td");
  let titleLink = document.createElement("a");
  const retroId = retro.eventId;
  titleLink.href = `retrospective-details.html?id=${retroId}`;
  titleLink.textContent = retro.title;
  titleLink.classList.add("retro-link");
  titleLink.setAttribute("data-retro-id", retro.id);
  titleCell.appendChild(titleLink);
  console.log("***" + retro.members);

  const response = await fetch(
    `http://localhost:8080/project3-backend/rest/retrospective/${retroId}/allMembers`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: sessionStorage.getItem("token"),
      },
    }
  );
  if (response.ok) {
    const retroMembers = await response.json();
    console.log(retroMembers);
  } else {
    alert(response.status);
  }

  let membersCell = document.createElement("td");
  membersCell.textContent = retro.retroMembers;

  row.appendChild(dateCell);
  row.appendChild(titleCell);
  row.appendChild(membersCell);

  tbody.appendChild(row);
}

//LOGOUT
document
  .getElementById("logout-button-header")
  .addEventListener("click", async function () {
    let logoutRequest =
      "http://localhost:8080/project3-backend/rest/users/logout";

    try {
      const response = await fetch(logoutRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON",
          Accept: "*/*",
        },
      });
      if (response.ok) {
        localStorage.removeItem("username");
        localStorage.removeItem("password");

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
// Abre o modal
function openModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

// Fecha o modal
function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

document.getElementById("closeModal").addEventListener("click", closeModal);
