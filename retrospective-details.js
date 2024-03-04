window.onload = async function () {
  try {
    getFirstName();
    getPhotoUrl();
    //clearInputValues();
  } catch (error) {
    console.error("An error occurred:", error);
  }


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
};

async function display() {
  const panels = document.querySelectorAll(".panel");

  panels.forEach((panel) => {
    panel.innerHTML = "";
  });
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
}

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
      console.log("************" + comments);
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
        display();
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
  const modalId = "myModal";
  const modal = document.createElement("div");
  modal.id = modalId;
  modal.classList.add("modal");

  const content = document.createElement("div");
  content.classList.add("modal-content");

  content.innerHTML = `
    <label for="editInput">Category:</label>
    <input type="text" id="editInput" value="${category}" />

    <label for="descriptionInput">Description:</label>
    <input type="text" id="descriptionInput" value="${description}" />

    <button onclick="editComment('${description}');closeModal();">Edit</button>
    <button id="deletebutooN" onclick="deleteComment('${description}');closeModal();">Delete</button>
    <button class="close-modal-btn" onclick="closeModal()">Close</button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
  modal.style.display = "block";
}

const categoryMapping = {
  STRENGTHS: 100,
  CHALLENGES: 200,
  IMPROVEMENTS: 300,
};

async function editComment(description) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const arrayComments = await getRetrospectiveCommentsss(id);
  console.log("ARRAY", arrayComments);
  const commentToDelete = arrayComments.find(
    (comment) => comment.comment === description
  );
  console.log(commentToDelete);
  const id2 = commentToDelete.commentId;
  const descriptionValue = document
    .getElementById("descriptionInput")
    .value.trim();
  const user = await getUser();
  console.log("user" + user);
  const idOfUser = user.id;
  console.log("TUTU" + idOfUser);
  console.log(commentToDelete);
  console.log("TATA" + commentToDelete.userId);

  if (descriptionValue === "" || idOfUser != commentToDelete.userId) {
    alert("description cannot be empty or this commentary is not yours");
    return;
  }

  if (document.getElementById("editInput").value === "STRENGTHS") {
    const commentary = {
      comment: document.getElementById("descriptionInput").value,
      category: categoryMapping.STRENGTHS,
      eventId: commentToDelete.eventId,
      userId: commentToDelete.userId,
    };

    const response = await fetch(
      `http://localhost:8080/project3-backend/rest/retrospective/${id}/editComment/${id2}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(commentary),
      }
    );

    if (response.ok) {
      display();
      console.log("retro edited");
    } else {
      console.log("not edited " + response.status);
    }
  } else if (document.getElementById("editInput").value === "CHALLENGES") {
    const commentary = {
      comment: document.getElementById("descriptionInput").value,
      category: categoryMapping.CHALLENGES,
      eventId: commentToDelete.eventId,
      userId: commentToDelete.userId,
    };

    const response = await fetch(
      `http://localhost:8080/project3-backend/rest/retrospective/${id}/editComment/${id2}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(commentary),
      }
    );

    if (response.ok) {
      display();
      console.log("retro edited");
    } else {
      console.log("not edited " + response.status);
    }
  } else if (document.getElementById("editInput").value === "IMPROVEMENTS") {
    const commentary = {
      comment: document.getElementById("descriptionInput").value,
      category: categoryMapping.IMPROVEMENTS,
      eventId: commentToDelete.eventId,
      userId: commentToDelete.userId,
    };

    const response = await fetch(
      `http://localhost:8080/project3-backend/rest/retrospective/${id}/editComment/${id2}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(commentary),
      }
    );

    if (response.ok) {
      display();
      console.log("retro edited");
    } else {
      console.log("not edited " + response.status);
    }
  }
}

async function getRetrospectiveCommentsss(id) {
  const response = await fetch(
    "http://localhost:8080/project3-backend/rest/retrospective/commentById",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
        id: id,
      },
    }
  );
  if (response.ok) {
    const arrayComments = await response.json();
    console.log(JSON.stringify(arrayComments));
    return arrayComments;
  } else {
    alert(response.status);
  }
}
async function deleteComment(description) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const arrayComments = await getRetrospectiveCommentsss(id);
  console.log("array comments" + arrayComments);
  const commentToDelete = arrayComments.find(
    (comment) => comment.comment === description
  );
  const id2 = commentToDelete.commentId;
  console.log(commentToDelete);
  console.log("*****" + id2);
  console.log("******" + description);
  console.log(id);
  const response = await fetch(
    `http://localhost:8080/project3-backend/rest/retrospective/${id}/deleteComment/${id2}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    }
  );
  if (response.ok) {
    console.log("commentary deleted");
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

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

async function getUser() {
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
    return user;
  } else if (!response.ok) {
    alert("Invalid credentials");
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
};