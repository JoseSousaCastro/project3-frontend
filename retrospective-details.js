window.onload = async function () {
  // Obter o ID da retrospectiva da URL
  const urlParams = new URLSearchParams(window.location.search);
  const retrospectiveId = urlParams.get("id");
  console.log("ID da retrospectiva:", retrospectiveId);

  if (retrospectiveId) {
    // Obter detalhes da retrospectiva e atualizar a página
    getRetrospectiveDetails(retrospectiveId);
  } else {
    console.error("ID da retrospectiva não encontrado na URL.");
  }

  const arrayComments = await getRetrospectiveComments(retrospectiveId);
  addAllCommentsToPanel(arrayComments);

  //fillUsersDropdown();
};

function getRetrospectiveIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function fillUsersDropdown() {
  const dropdownUsers = document.getElementById("dropdown-users");

  // Adicionar a opção padrão
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  defaultOption.textContent = "--Choose a user--";
  dropdownUsers.appendChild(defaultOption);

  // Obter usuários do backend
  const usersEndpoint =
    "http://localhost:8080/project3-backend/rest/users/checkUsers";

  try {
    const response = await fetch(usersEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const usersData = await response.json();

      usersData.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.username;
        option.textContent = user.username;
        dropdownUsers.appendChild(option);
      });
    } else if (response.status === 401) {
      alert("Invalid credentials1");
    } else if (response.status === 404) {
      alert("Users not found");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

async function getRetrospectiveComments(retrospectiveId) {
  const retrospectiveCommentsEndpoint = `http://localhost:8080/project3-backend/rest/retrospective/${retrospectiveId}/allComments`;

  try {
    const response = await fetch(retrospectiveCommentsEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const comments = await response.json();
      console.log(comments);
      return comments;
    } else if (response.status === 401) {
      alert("Invalid credentials2");
    } else if (response.status === 404) {
      alert("Retrospective not found");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong");
  }
}

async function getRetrospectiveDetails(retrospectiveId) {
  const retrospectiveEndpoint = `http://localhost:8080/project3-backend/rest/retrospective/${retrospectiveId}`;

  try {
    const response = await fetch(retrospectiveEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });

    if (response.ok) {
      const retrospectiveInfo = await response.json();

      const retroTitleElement = document.getElementById("retro-title");
      retroTitleElement.innerText = retrospectiveInfo.title;

      const retroTitleElement2 = document.getElementById("retro-title-aside");
      retroTitleElement2.innerText = retrospectiveInfo.title;

      const retroDateElement = document.getElementById("retro-date-each");
      retroDateElement.innerText = retrospectiveInfo.date;
    } else if (response.status === 401) {
      alert("Invalid credentials*****");
    } else if (response.status === 404) {
      alert("Retrospective not found");
    }
  } catch (error) {
    alert("Something went wrong");
  }
}

function createComment(description, commentStatus) {
  const comment = {
    comment: description,
    category: parseCommentIdToInt(commentStatus),
  };
  return comment;
}

function parseCommentIdToInt(commentStatus) {
  let newStatus = 0;
  if (commentStatus === "strengths") {
    newStatus = 100;
  } else if (commentStatus === "challenges") {
    newStatus = 200;
  } else if (commentStatus === "improvements") {
    newStatus = 300;
  }
  return newStatus;
}

function parseCommentIdToString(commentStatus) {
  let newStatus = "";
  if (commentStatus === 100) {
    newStatus = "strengths";
  } else if (commentStatus === 200) {
    newStatus = "challenges";
  } else if (commentStatus === 300) {
    newStatus = "improvements";
  }
  return newStatus;
}

document
  .getElementById("addCommentBTN")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const commentDescription = document.getElementById(
      "commentDescription-retro"
    ).value;
    const commentCategory = document.getElementById(
      "dropdown-categories"
    ).value;

    if (commentDescription === "" || commentCategory === "") {
      document.getElementById("warningMessage2").innerText =
        "Please fill in all fields";
    } else {
      document.getElementById("warningMessage2").innerText = "";
      const comment = createComment(commentDescription, commentCategory);
      const retrospectiveId = getRetrospectiveIdFromURL();
      console.log(retrospectiveId);
      console.log(comment);

      const response = await fetch(
        `http://localhost:8080/project3-backend/rest/retrospective/${retrospectiveId}/addComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: sessionStorage.getItem("token"),
          },
          body: JSON.stringify(comment),
        }
      );

      if (response.ok) {
        console.log("Comment added successfully");
        removeAllCommentsElements();

        //loadComments();
        addCommentToPanel(comment.category, comment.comment, comment.userId);
        cleanAllCommentFields();
        //createCommentElement(comment);
      } else if (response.status === 401) {
        alert("Invalid credentials5");
      } else if (response.status === 404) {
        alert("Retrospective not found");
      }
    }
  });

function addAllCommentsToPanel(commentsArray) {
  commentsArray.forEach((comment) => {
    addCommentToPanel(comment.category, comment.comment, comment.userId);
  });
}

async function addCommentToPanel(
  commentCategory,
  commentDescription,
  commentIdProfile
) {
  const panelStrengths = document.getElementById("strengths");
  const panelChallenges = document.getElementById("challenges");
  const panelImprovements = document.getElementById("improvements");

  const user = await getFirstName();

  const createCommentContainer = (category, description) => {
    const container = document.createElement("div");
    container.classList.add("comment-container");
    container.innerHTML = `${description} <i>by</i> <b>${commentIdProfile}</b>`;
    container.addEventListener("dblclick", () => {
      openEditDeleteModal(category, description);
    });
    return container;
  };

  if (commentCategory === "STRENGTHS") {
    panelStrengths.appendChild(
      createCommentContainer(commentCategory, commentDescription)
    );
  } else if (commentCategory === "CHALLENGES") {
    panelChallenges.appendChild(
      createCommentContainer(commentCategory, commentDescription)
    );
  } else if (commentCategory === "IMPROVEMENTS") {
    panelImprovements.appendChild(
      createCommentContainer(commentCategory, commentDescription)
    );
  }
}

function openEditDeleteModal(category, description) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const content = document.createElement("div");
  content.classList.add("modal-content");

  content.innerHTML = `
    <p>${category}</p>
    <p>${description}</p>
    
    <button onclick="editComment('${category}', '${description}')">Editar</button>
    <button onclick="deleteComment('${category}', '${description}')">Apagar</button>
    <button class="close-modal-btn" onclick="closeModal()">Fechar</button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.style.display = "none";
  }
}

function removeAllCommentsElements() {
  const comments = document.querySelectorAll(".comment");
  comments.forEach((comment) => {
    comment.remove();
  });
}

function cleanAllCommentFields() {
  document.getElementById("warningMessage2").innerText = "";
  document.getElementById("commentDescription-retro").value = "";
  document.getElementById("dropdown-categories").value = "";
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
    return user;
  } else if (!response.ok) {
    alert("Invalid credentials");
  }
}
