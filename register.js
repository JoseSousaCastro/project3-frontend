document
  .getElementById("registrationForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = document.getElementById("username-register").value.trim();
    let password = document.getElementById("password-register").value.trim();
    let passwordConfirm = document
      .getElementById("passwordConfirm-register")
      .value.trim();
    let firstName = document.getElementById("firstName-register").value.trim();
    let lastName = document.getElementById("lastName-register").value.trim();
    let phone = document.getElementById("phone-register").value.trim();
    let photoURL = document.getElementById("photoURL-register").value.trim();

    // Validar o username
    if (username === "") {
      document
        .getElementById("username-register")
        .setCustomValidity("Username é obrigatório.");
    } else if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      document
        .getElementById("username-register")
        .setCustomValidity(
          'Username só pode ter letras (maiúsculas e minúsculas), dígitos, ".", "-" e "_".'
        );
    } else {
      document.getElementById("username-register").setCustomValidity("");
    }

    // Validar a password
    if (password === "") {
      document
        .getElementById("password-register")
        .setCustomValidity("Password é obrigatória.");
    } else if (
      !/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(password)
    ) {
      document
        .getElementById("password-register")
        .setCustomValidity(
          "Password só pode ter letras (maiúsculas e minúsculas), dígitos e caracteres especiais."
        );
    } else {
      document.getElementById("password-register").setCustomValidity("");
    }

    // Validar a confirmação da password
    if (passwordConfirm === "") {
      document
        .getElementById("passwordConfirm-register")
        .setCustomValidity("Confirmação de password é obrigatória.");
    } else if (password !== passwordConfirm) {
      document
        .getElementById("passwordConfirm-register")
        .setCustomValidity("A confirmação de password não coincide.");
    } else {
      document.getElementById("passwordConfirm-register").setCustomValidity("");
    }

    // Validar o primeiro nome
    if (firstName === "") {
      document
        .getElementById("firstName-register")
        .setCustomValidity("Primeiro nome é obrigatório.");
    } else if (!/^[a-zA-Z]+$/.test(firstName)) {
      document
        .getElementById("firstName-register")
        .setCustomValidity(
          "Primeiro nome só pode conter letras (maiúsculas e minúsculas)."
        );
    } else {
      document.getElementById("firstName-register").setCustomValidity("");
    }

    // Validar o último nome
    if (lastName === "") {
      document
        .getElementById("lastName-register")
        .setCustomValidity("Último nome é obrigatório.");
    } else if (!/^[a-zA-Z]+$/.test(lastName)) {
      document
        .getElementById("lastName-register")
        .setCustomValidity(
          "Último nome só pode conter letras (maiúsculas e minúsculas)."
        );
    } else {
      document.getElementById("lastName-register").setCustomValidity("");
    }

    // Validar o número de telefone
    if (phone === "") {
      document
        .getElementById("phone-register")
        .setCustomValidity("Número de telefone é obrigatório.");
    } else if (!/^\d{9}$/.test(phone)) {
      document
        .getElementById("phone-register")
        .setCustomValidity(
          "Por favor, insira um número de telefone válido com 9 dígitos."
        );
    } else {
      document.getElementById("phone-register").setCustomValidity("");
    }

    // Validar o URL da foto
    if (photoURL === "") {
      document
        .getElementById("photoURL-register")
        .setCustomValidity("URL da foto é obrigatório.");
    } else if (/\s/.test(photoURL)) {
      document
        .getElementById("photoURL-register")
        .setCustomValidity(
          'Por favor, insira uma URL válida começando com "http://" ou "https://".'
        );
    } else {
      document.getElementById("photoURL-register").setCustomValidity("");
    }

    let newUser = createUserData();
    console.log(newUser.deleted);
    console.log(newUser.role);

    const inputFieldIds = [
      "username-register",
      "password-register",
      "email-register",
      "passwordConfirm-register",
      "firstName-register",
      "lastName-register",
      "phone-register",
      "photoURL-register",
    ];

    try {
      const response = await fetch(
        "http://localhost:8080/proj3_vc_re_jc/rest/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        alert("Account registered successfully!");

        //depois da conta criada com sucesso, apaga os campos escritos pelo user

        inputFieldIds.forEach((fieldId) => {
          document.getElementById(fieldId).value = "";
        });
        window.location.href = "index.html";
      } else {
        switch (response.status) {
          case 422:
            const errorData = await response.text();
            switch (errorData) {
              case "There's an empty field, fill all values":
                alert("Please fill all fields");
                break;
              case "Invalid email":
                alert("The email you used is not valid");
                break;
              case "Image URL invalid":
                alert("Image url provided not valid");
                break;
              case "Invalid phone number":
                alert("The phone number is not valid");
                break;
              case "Username already in use":
                alert("Username already in use");
                break;
              default:
                console.error("Unknown error message:", errorData);
                alert("Something went wrong");
            }
            break;
          case 409:
            alert("Username already in use");
            break;
          default:
            alert("Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  });

function createUserData() {
  let username = document.getElementById("username-register").value.trim();
  let password = document.getElementById("password-register").value.trim();
  let email = document.getElementById("email-register").value.trim();
  let firstName = document.getElementById("firstName-register").value.trim();
  let lastName = document.getElementById("lastName-register").value.trim();
  let phone = document.getElementById("phone-register").value.trim();
  let photoURL = document.getElementById("photoURL-register").value.trim();
  let deleted = false;

  return {
    username: username,
    password: password,
    email: email,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    photoURL: photoURL,
    role: 'DEVELOPER',
    deleted: deleted,
  };
}
