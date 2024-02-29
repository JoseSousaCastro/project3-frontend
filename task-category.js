
document.addEventListener("DOMContentLoaded", function () {
    getCategories();
});
  
async function getCategories() {
    const categoryId = {
      // definir médoto para encontrar category ID
      categoryId: document.getElementById("endDate-editTask").value,
    };
    let getCategories = `http://localhost:8080/proj3_vc_re_jc/rest/tasks/category/all`;
    try {
      const response = await fetch(
        getCategories,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/JSON",
            Accept: "*/*",
            token: sessionStorage.getItem("token"),
          },
          body: JSON.stringify(categoryId),
        }
      );
      if (response.ok) {
        const data = await response.text();
        let categories = data;
      } else if (!response.ok) {
        alert(data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      throw error; // Propagar o erro para ser tratado no catch do bloco que chamou a função
    }
}
  
function showCategoryList(categories) {
    categories.forEach((category) => {
      const row = document.createElement("tr");
  
      // Criar célula para o nome da categoria
      const categoryNameCell = document.createElement("td");
      categoryNameCell.className = "clickable";
      categoryNameCell.textContent = category.name;
      categoryNameCell.className = "clickable text-center";
    
      // Adicionar as células à linha
      row.appendChild(categoryNameCell);
  
      // Adicionar a linha à tabela
      document.querySelector(".category-table-body").appendChild(row);
  
      // Adicionar evento de clique para exibir detalhes do usuário
      categoryNameCell.addEventListener("dblclick", () => {
        showCategoryDetails(category.id);
      });
    });
}
  
  async function showCategoryDetail(categoryId) {
    const category = await findCategoryById(categoryId);
    if (category) {
      const modal = document.getElementById("categoryDetailsModal");
      const categoryDetailContainer = document.getElementById("categoryDetails");
      document.getElementById("categoryNameInput").value = category.name;  
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
    document.getElementById("categoryNameInput").removeAttribute("readonly");
}
  