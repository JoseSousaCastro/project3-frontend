window.onload = function () {
  try {
    getFirstName();
    getPhotoUrl();
    userByToken();
    //clearInputValues();
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

//LOGOUT
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

async function userByToken() {
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

    document.getElementById("username-title-editProfile").innerText =
      user.username;
    document.getElementById("firstName-editProfile").value = user.firstName;
    document.getElementById("lastName-editProfile").value = user.lastName;
    document.getElementById("phone-editProfile").value = user.phone;
    document.getElementById("photoURL-editProfile").value = user.photoURL;
    document.getElementById("email-editProfile").value = user.email;
    document.getElementById("currentPass-editProfile").placeholder =
      user.password;
  } else {
    alert("erro:" + response.status);
  }
}

async function save_edit() {
  const username = document
    .getElementById("username-title-editProfile")
    .innerText.trim()
    .replace(/\s+/g, "");
  const firstName = document
    .getElementById("firstName-editProfile")
    .value.trim()
    .replace(/\s+/g, "");
  const lastName = document
    .getElementById("lastName-editProfile")
    .value.trim()
    .replace(/\s+/g, "");
  const phone = document
    .getElementById("phone-editProfile")
    .value.trim()
    .replace(/\s+/g, "");
  const photoURL = document
    .getElementById("photoURL-editProfile")
    .value.trim()
    .replace(/\s+/g, "");
  const email = document
    .getElementById("email-editProfile")
    .value.trim()
    .replace(/\s+/g, "");
  const password = document
    .getElementById("currentPass-editProfile")
    .placeholder.trim()
    .replace(/\s+/g, "");
  const newPassword = document
    .getElementById("newPassword-editProfile")
    .value.trim()
    .replace(/\s+/g, "");
  const newPassword2 = document
    .getElementById("newPasswordConfirm-editProfile")
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
    !firstName ||
    !lastName ||
    !phone ||
    !isValidPhotoURL ||
    !isEmailValid ||
    !isDotValid
  ) {
    alert("Invalid inputs");
  } else if (newPassword != newPassword2) {
    alert("Passwords are not the same");
  } else {
    const userEdited = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      photoURL: photoURL,
      email: email,
      password: newPassword,
    };
    console.log(userEdited);
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/users/editProfile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(userEdited),
      }
    );
    if (response.ok) {
      alert("profile updated");
    } else {
      alert(response.status);
    }
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
    console.log(user);
    console.log(user.photoURL);
    document.getElementById("profile-pic").src = user.photoURL;
  } else if (response.stateId === 401) {
    alert("Invalid credentials");
  } else if (response.stateId === 404) {
    alert("teste 404");
  }
};

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