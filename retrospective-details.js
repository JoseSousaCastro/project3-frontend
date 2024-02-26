window.onload = async function() {
   
  const usernameValue = localStorage.getItem('username')
  const passwordValue = localStorage.getItem('password')


  console.log('window on load está a funcionar!')
  getFirstName(usernameValue, passwordValue);
  getPhotoUrl(usernameValue, passwordValue);

  // Obter o ID da retrospectiva da URL
  const urlParams = new URLSearchParams(window.location.search);
  const retrospectiveId = urlParams.get('id');
  console.log('ID da retrospectiva:', retrospectiveId);

  if (retrospectiveId) {
    // Obter detalhes da retrospectiva e atualizar a página
    getRetrospectiveDetails(usernameValue, passwordValue, retrospectiveId);
  } else {
    console.error('ID da retrospectiva não encontrado na URL.');
  }

  const arrayComments = await getRetrospectiveComments(retrospectiveId);
  addAllCommentsToPanel(arrayComments);


  fillUsersDropdown(usernameValue, passwordValue);
  
};

function getValuesFromLocalStorage() {
  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');
  const userValues = [usernameValue, passwordValue];     
  return userValues;
}

function getRetrospectiveIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


async function fillUsersDropdown(usernameValue, passwordValue) {
  const dropdownUsers = document.getElementById('dropdown-users');

  // Adicionar a opção padrão
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.hidden = true;
  defaultOption.textContent = '--Choose a user--';
  dropdownUsers.appendChild(defaultOption);

  // Obter usuários do backend
  const usersEndpoint = 'http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/all';

  try {
    const response = await fetch(usersEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });

    if (response.ok) {
      const usersData = await response.json();

      usersData.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.username; // ou outra propriedade que identifique exclusivamente o usuário
        option.textContent = user.username; // ou outra propriedade que você deseja exibir
        dropdownUsers.appendChild(option);

      });
    } else if (response.status === 401) {
      alert('Invalid credentials');
    } else if (response.status === 404) {
      alert('Users not found');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

async function getRetrospectiveComments(retrospectiveId) {
  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');

  const retrospectiveCommentsEndpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/retrospective/${retrospectiveId}/allComments`;
  
  try {
    const response = await fetch(retrospectiveCommentsEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });

    if (response.ok) {
      const comments = await response.json();
      console.log('comments:', comments);
      return comments;
    } else if (response.status === 401) {
      alert('Invalid credentials');
    } else if (response.status === 404) {
      alert('Retrospective not found');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

async function getRetrospectiveDetails(usernameValue, passwordValue, retrospectiveId) {
  const retrospectiveEndpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/retrospective/${retrospectiveId}`;

  try {
    const response = await fetch(retrospectiveEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });

    if (response.ok) {
      const retrospectiveInfo = await response.json();

      const retroTitleElement = document.getElementById('retro-title');
      retroTitleElement.innerText = retrospectiveInfo.title;

      const retroTitleElement2 = document.getElementById('retro-title-aside');
      retroTitleElement2.innerText = retrospectiveInfo.title;

      const retroDateElement = document.getElementById('retro-date-each');
      retroDateElement.innerText = retrospectiveInfo.date;

    } else if (response.status === 401) {
      alert("Invalid credentials");
    } else if (response.status === 404) {
      alert("Retrospective not found");
    }

  } catch (error) {
    alert("Something went wrong");
  }
}

async function getFirstName(usernameValue, passwordValue) {

  let firstNameRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/getFirstName";
    
    try {
        const response = await fetch(firstNameRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                username: usernameValue,
                password: passwordValue
            },    
        });

        if (response.ok) {

          const data = await response.text();
          document.getElementById("first-name-label").innerText = data;

        } else if (!response.ok) {
            alert("Invalid credentials")
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}
  
  async function getPhotoUrl(usernameValue, passwordValue) {

  
    let photoUrlRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/getPhotoUrl";
      
      try {
          const response = await fetch(photoUrlRequest, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/JSON',
                  'Accept': '*/*',
                  username: usernameValue,
                  password: passwordValue
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


function createComment(description, commentStatus) {
const comment = {
  description: description,
  commentStatus: parseCommentIdToInt(commentStatus)
};
return comment;
}


function parseCommentIdToInt (commentStatus) {
  let newStatus = 0;
  if(commentStatus === 'strengths') {
    newStatus = 100;
  } else if(commentStatus === 'challenges') {
    newStatus = 200;
  } else if(commentStatus === 'improvements') {
    newStatus = 300;
  }
  return newStatus;
}

function parseCommentIdToString (commentStatus) {
  let newStatus = '';
  if(commentStatus === 100) {
    newStatus = 'strengths';
  } else if(commentStatus === 200) {
    newStatus = 'challenges';
  } else if(commentStatus === 300) {
    newStatus = 'improvements';
  }
  return newStatus;
}



document.getElementById('addCommentBTN').addEventListener('click', async function(event) {
  event.preventDefault();

  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');

  const commentDescription = document.getElementById('commentDescription-retro').value;
  const commentCategory = document.getElementById('dropdown-categories').value;



  if (commentDescription === '' || commentCategory === '') {
    document.getElementById('warningMessage2').innerText ='Please fill in all fields';
  } else {
    document.getElementById('warningMessage2').innerText ='';
    const comment = createComment(commentDescription, commentCategory);
    const retrospectiveId = getRetrospectiveIdFromURL();
    const retrospectiveCommentsEndpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/retrospective/${retrospectiveId}/addComment`;

    try {
      const response = await fetch(retrospectiveCommentsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'username': usernameValue,
          'password': passwordValue
        },
        body: JSON.stringify(comment)
      });

      if (response.ok) {
        console.log('Comment added successfully');
        removeAllCommentsElements();

        //loadComments();
        addCommentToPanel(commentCategory, commentDescription, usernameValue);

        cleanAllCommentFields();
        //createCommentElement(comment);
        
      } else if (response.status === 401) {
        alert('Invalid credentials');
      } else if (response.status === 404) {
        alert('Retrospective not found');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  }
}
);



function addAllCommentsToPanel(commentsArray) {
  commentsArray.forEach((comment) => {
const commentCategory = comment.commentStatus;
const commentDescription = comment.description;
const commentUser = localStorage.getItem('username');
addCommentToPanel(commentCategory, commentDescription, commentUser);
  });
}


function addCommentToPanel(commentCategory, commentDescription) {
  const commentUser = localStorage.getItem('username');

  const panelStrengths = document.getElementById('strengths');
  const panelChallenges = document.getElementById('challenges');
  const panelImprovements = document.getElementById('improvements');

  if (commentCategory === 'strengths') {

    panelStrengths.innerHTML += `<div>${commentDescription} <i>by</i> <b>${commentUser}</b></div>`;
  } else if (commentCategory === 'challenges') {
    panelChallenges.innerHTML += `<div>${commentDescription} <i>by</i> <b>${commentUser}</b></div>`;
  } else if (commentCategory === 'improvements') {
    panelImprovements.innerHTML += `<div>${commentDescription} <i>by</i> <b>${commentUser}</b></div>`;

  }
}


async function getUserByUsername(username) {
  const usernameValue = localStorage.getItem('username');
  const passwordValue = localStorage.getItem('password');

  const endpoint = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/${username}`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'username': usernameValue,
        'password': passwordValue
      },
    });
    if (response.ok) {
      const user = await response.json();
      console.log('user:', user.getUsername());
      return user;
    } else {
      throw new Error('Failed to get user by username');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong');
  }
}

function removeAllCommentsElements() {
  const comments = document.querySelectorAll('.comment');
  comments.forEach(comment => {
    comment.remove();
  });
}

function cleanAllCommentFields() {
  document.getElementById('warningMessage2').innerText ='';
  document.getElementById('commentDescription-retro').value = '';
  document.getElementById('dropdown-categories').value = '';
}



  //LOGOUT 
document.getElementById("logout-button-header").addEventListener('click', async function() {

  let logoutRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/logout";
    
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
