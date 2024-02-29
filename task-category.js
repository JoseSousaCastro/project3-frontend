
document.addEventListener("DOMContentLoaded", function () {
    getCategories();
    let validToken = sessionStorage.getItem("token");
});
  
async function getCategories() {
    let getCategories = `http://localhost:8080/project3-backend/rest/tasks/category/all`;
    try {
      const response = await fetch(
        getCategories,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/JSON",
            Accept: "*/*",
            token: sessionStorage.getItem("token"),
          },
        }
      );
      
    if (response.ok) {
      const categories = await response.json();
      showCategoryList(categories);
    } else {
      alert(response.status);
    }
  } catch (error) {
    console.error("Error loading categories list:", error);
  }
}
  
function showCategoryList(categoriesList) {
  document.querySelector(".category-table-body").innerHTML = "";
  categoriesList.forEach((category) => {
      const row = document.createElement("tr");
  
      // Criar célula para o nome da categoria
      const iDCell = document.createElement("td");
      iDCell.className = "clickable";
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
  
async function showCategoryDetail(categoryName) {
  const modal = document.getElementById("categoryDetailsModal");
  document.getElementById("categoryNameInput").value = categoryName;  
  modal.style.display = "block";
}

function closeCategoryDetailsModal() {
  const modal = document.getElementById("categoryDetailsModal");
  modal.style.display = "none";
}

function enableEdit() {
  document.getElementById("categoryNameInput").removeAttribute("readonly");
}

function disableEdit() {
  document.getElementById("categoryNameInput").setAttribute("readonly", true);
}

async function editCategory() {
  const categoryDto = {
    name: document.getElementById("categoryNameInput").value,
  };

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

  if (response.ok) {
    await getCategories();
  } else {
    alert("ERRO:" + response.status);
  }
}

function closeModal() {
  const modal = document.getElementById("categoryDetailsModal");
  modal.style.display = "none";
}

function addCategory() {
  const modal = document.getElementById("addCategoryModal");
  modal.style.display = "block";
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
        getCategories();
    } else {
      alert(message);
      document.getElementById("categoryName").value = "";
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


function removeCategory() {
  const modal = document.getElementById("removeCategoryModal");
  modal.style.display = "block";
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
        getCategories();
    } else {
      alert(message);
      document.getElementById("categoryId").value = "";
    }
  } catch (error) {
    console.error('Error:', error);
  }
}