document.addEventListener("DOMContentLoaded", async function () {
  try {
    const allCategories = await getCategories(); // Wait for the categories to be fetched
    showCategoryList(allCategories);
  } catch (error) {
    console.error("Error loading categories:", error);
    // Handle error loading categories
  }

  try {
    getFirstName();
    getPhotoUrl();
  } catch (error) {
    console.error("An error occurred:", error);
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
      document.getElementById("buttonN").style.display = "none";
      document.getElementById("buttonNN").style.display = "none";

      break;

    case UserRole.SCRUM_MASTER:
      document.getElementById("buttonN").style.display = "none";
      document.getElementById("buttonNN").style.display = "none";
      break;

    case UserRole.PRODUCT_OWNER:
      break;

    default:
      break;
  }
});

async function getCategories() {
  let getCategories = `http://localhost:8080/project3-backend/rest/tasks/category/all`;
  try {
    const response = await fetch(getCategories, {
      method: "GET",
      headers: {
        "Content-Type": "application/JSON",
        Accept: "*/*",
        token: sessionStorage.getItem("token"),
      },
    });
    if (response.ok) {
      const categories = await response.json();
      return categories; // Return the array of categories
    } else {
      throw new Error(`Failed to fetch categories: ${response.text()}`);
    }
  } catch (error) {
    console.error("Error loading categories list:", error);
    throw error; // Re-throw the error to handle it in the caller function if needed
  }
}

function showCategoryList(categoriesList) {
  document.querySelector(".category-table-body").innerHTML = "";
  categoriesList.forEach((category) => {
    const row = document.createElement("tr");

    // Criar célula para o id da categoria
    const iDCell = document.createElement("td");
    iDCell.textContent = category.id;
    iDCell.className = "clickable text-center";

    // Criar célula para o nome da categoria
    const categoryNameCell = document.createElement("td");
    categoryNameCell.className = "clickable";
    categoryNameCell.textContent = category.name;
    categoryNameCell.className = "clickable text-center";

    // Adicionar as células à linha
    row.appendChild(iDCell);
    row.appendChild(categoryNameCell);

    // Adicionar a linha à tabela
    document.querySelector(".category-table-body").appendChild(row);

    // Adicionar evento de clique para exibir detalhes do usuário
    categoryNameCell.addEventListener("dblclick", () => {
      showCategoryDetails(category.name);
    });
  });
}

async function showCategoryDetails(categoryName) {
  const modal = document.getElementById("categoryDetailsModal");
  document.getElementById("categoryNameInput").value = categoryName;  
  modal.style.display = "flex";
}

function closeCategoryDetailsModal() {
  const modal = document.getElementById("categoryDetailsModal");
  modal.style.display = "none";
}

function closeModal() {
  const modal = document.getElementById("categoryDetailsModal");
  modal.style.display = "none";
}

let editbutton = document.getElementById("enableEdit-categoryDetailsModal");
let currentCategoryId;

// Event listener for edit button click
editbutton.addEventListener("click", async () => {
  // Ensure the list of categories is fetched before proceeding
  const listCategories = await getCategories();
  const currentCategoryName =
    document.getElementById("categoryNameInput").value;

  // Find the category ID based on the current category name
  listCategories.forEach((category) => {
    if (category.name === currentCategoryName) {
      currentCategoryId = category.id;
    }
  });

  document.getElementById("categoryNameInput").removeAttribute("readonly");
});

let saveButton = document.getElementById("saveEdit-categoryDetailsModal");
// Event listener for save button click
saveButton.addEventListener("click", () => {
  // Retrieve the new name from the input field
  const newName = document.getElementById("categoryNameInput").value;
  // Send both the new name and the ID to the backend endpoint
  editCategory(currentCategoryId, newName);

  document.getElementById("categoryNameInput").setAttribute("readonly", true);
});

async function editCategory(categoryId, categoryName) {
  const categoryDto = {
    id: categoryId,
    name: categoryName,
  };
  try {
    const response = await fetch(
      `http://localhost:8080/project3-backend/rest/tasks/category/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(categoryDto),
      }
    );
    const message = await response.text(); // Get response body as text
    if (response.ok) {
      alert(message);
      closeModal(); // Close the modal
      await refreshCategoryList(); // Refresh the category list
    } else {
      throw new Error(message);
    }
  } catch (error) {
    console.error("Error editing category:", error);
    alert("Error editing category: " + error.message);
  }
}

async function refreshCategoryList() {
  try {
    const allCategories = await getCategories(); // Wait for the categories to be fetched
    showCategoryList(allCategories);
  } catch (error) {
    console.error("Error loading categories:", error);
    // Handle error loading categories
  }
}

function addCategory() {
  const modal = document.getElementById("addCategoryModal");
  modal.style.display = "flex";
  document.getElementById("categoryName").value = "";
}

function closeAddCategoryModal() {
  const modal = document.getElementById("addCategoryModal");
  modal.style.display = "none";
}

async function submitNewCategory() {
  const ctgDto = {
    name: document.getElementById("categoryName").value,
  };

  try {
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/tasks/category/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(ctgDto),
      }
    );
    const message = await response.text(); // Get response body as text
    if (response.ok) {
      alert(message);
      closeAddCategoryModal(); // Close the modal
      await refreshCategoryList(); // Refresh the category list
    } else {
      alert(message);
      document.getElementById("categoryName").value = "";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function removeCategory() {
  const modal = document.getElementById("removeCategoryModal");
  modal.style.display = "flex";
  document.getElementById("categoryId").value = "";
}

function closeRemoveCategoryModal() {
  const modal = document.getElementById("removeCategoryModal");
  modal.style.display = "none";
}

async function submitRemoveCategory() {
  const ctgDto = {
    id: document.getElementById("categoryId").value,
  };

  try {
    const response = await fetch(
      "http://localhost:8080/project3-backend/rest/tasks/category/remove",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(ctgDto),
      }
    );
    const message = await response.text(); // Get response body as text
    if (response.ok) {
      alert(message);
      closeRemoveCategoryModal(); // Close the modal
      await refreshCategoryList(); // Refresh the category list
    } else {
      alert(message);
      document.getElementById("categoryId").value = "";
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
};