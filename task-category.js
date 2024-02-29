
document.addEventListener("DOMContentLoaded", function () {
    getCategories();
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
  
function showCategoryList(categories) {
    categories.forEach((category) => {
      const row = document.createElement("tr");

      // Criar célula para o Id da categoria
      const categoryIdCell = document.createElement("td");
      categoryIdCell.className = "clickable";
      categoryIdCell.textContent = category.id;
      categoryIdCell.className = "clickable text-center";
  
      // Criar célula para o nome da categoria
      const categoryNameCell = document.createElement("td");
      categoryNameCell.className = "clickable";
      categoryNameCell.textContent = category.name;
      categoryNameCell.className = "clickable text-center";
    
      // Adicionar as células à linha
      row.appendChild(categoryIdCell);
      row.appendChild(categoryNameCell);      
  
      // Adicionar a linha à tabela
      document.querySelector(".category-table-body").appendChild(row);
  
      // Adicionar evento de clique para exibir detalhes do usuário
      categoryNameCell.addEventListener("dblclick", () => {
        showCategoryDetails(category.id, category.name);
      });
    });
}
  
async function showCategoryDetail(categoryId, categoryName) {
  const modal = document.getElementById("categoryDetailsModal");
  document.getElementById("categoryNameInput").value = categoryName;  
  modal.style.display = "block";
}

  
function closeUserDetailsModal() {
    const modal = document.getElementById("userDetailsModal");
    modal.style.display = "none";
}
  
function enableEdit() {
    document.getElementById("categoryNameInput").removeAttribute("readonly");
}
  