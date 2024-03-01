window.onload = function() {
   
  const usernameValue = localStorage.getItem('username')
  const passwordValue = localStorage.getItem('password')

  
};
  



function cleanRetroFields() {
  document.getElementById('warningMessage2').innerText = '';
  document.getElementById('retroTitle').value = '';
  document.getElementById('retroDate').value = '';
}

  async function getFirstName() {
  
    let firstNameRequest = "http://localhost:8080/project3-backend/rest/users/getFirstName";
      
      try {
          const response = await fetch(firstNameRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  token: sessionStorage.getItem("token")
              },    
          });
  
          if (response.ok) {
  
            const data = await response.text();
            console.log(data.firstName)
            document.getElementById("first-name-label").innerText = data;
  
          } else if (!response.ok) {
              alert("Invalid credentials")
          }
  
      } catch (error) {
          console.error('Error:', error);
          alert("Something went wrong");
      }
  }
  
  async function getPhotoUrl() {
  
    let photoUrlRequest = "http://localhost:8080/project3-backend/rest/users/getPhotoUrl";
      
      try {
          const response = await fetch(photoUrlRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  token: sessionStorage.getItem("token")
              },    
          });
  
          if (response.ok) {
  
            const data = await response.text();
            document.getElementById("profile-pic").src = data;
  
          } else if (response.status === 401) {
              alert("Invalid credentials")
          } else if (response.status === 404) {
            alert("teste 404")
          }
  
      } catch (error) {
          console.error('Error:', error);
          alert("Something went wrong");
      }
  }

  async function getRetroList() {
  console.log("getRetroList")
    let retroListRequest = "http://localhost:8080/project3-backend/rest/retrospective/all";
      
      try {
          const response = await fetch(retroListRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  token: sessionStorage.getItem("token")                
                },    
          });
  
          if (response.ok) {
  
            const data = await response.json();
            console.log(data)

            data.forEach(retro => {
              createRetroTableBody(retro);
              console.log(retro);
            });
          } else if (response.status === 401) {
            alert("Invalid credentials");
          } else if (response.status === 404) {
            alert("Error 404");
          }
      } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
      }
}


async function addRetrospectiveToBackend(title, date) {
  const retro = createRetro(title, date);
  try {
    const response = await fetch("http://localhost:8080/project3-backend/rest/retrospective/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        token: sessionStorage.getItem("token"),
      },
      body: JSON.stringify(retro)
    });
    if (response.ok) {
      removeAllRetroElements();
      getRetroList(usernameValue, passwordValue); // substituir por token
      cleanRetroFields();
    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Error 404");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Something went wrong");
  }
    
}


function createRetro (title, date) {
  let retro = {
    title: title,
    date: date
  }
  return retro;
}

document.getElementById("addRetroBTN").addEventListener("click", function() {
  let date = document.getElementById('retroDate').value;
  let title = document.getElementById('retroTitle').value.trim();

if (date === '' || title === '') {
  console.log('entrou no if para verificar se os campos estão preenchidos');

  document.getElementById('warningMessage2').innerText = 'Please fill in all fields';
} else {
  let retro = createRetro(title, date);

  addRetrospectiveToBackend(retro.title, retro.date).then(() => {

})
}
});

function removeAllRetroElements() {
  const retros = document.querySelectorAll('.retros-row');
  retros.forEach(retro => retro.remove());
}

function createRetroTableBody(retro) {
  let tbody = document.querySelector(".retros-table-body");

  let row = document.createElement("tr");
  row.classList.add("retros-row");

  let dateCell = document.createElement("td");
  dateCell.textContent = retro.date;
  let titleCell = document.createElement("td");
  let titleLink = document.createElement("a");
  titleLink.href = `retrospective-details.html?id=${retro.id}`;
  titleLink.textContent = retro.title;
  titleLink.classList.add("retro-link");
  titleLink.setAttribute("data-retro-id", retro.id);
  titleCell.appendChild(titleLink);

  let membersCell = document.createElement("td");
  membersCell.textContent = retro.retrospectiveUsers ? retro.retrospectiveUsers.map(user => (user && user.username) ? user.username : '').join(", ") : '';

  row.appendChild(dateCell);
  row.appendChild(titleCell);
  row.appendChild(membersCell);

  tbody.appendChild(row);
}

//LOGOUT 
document.getElementById("logout-button-header").addEventListener('click', async function() {

  let logoutRequest = "http://localhost:8080/project3-backend/rest/users/logout";
    
    try {   
        const response = await fetch(logoutRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
            }, 
        });
        if (response.ok) {
            
          localStorage.removeItem("username");
          localStorage.removeItem("password");

          window.location.href="index.html";

        } 
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
})
