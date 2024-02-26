window.onload = function() {
  
    let usernameValue = localStorage.getItem('username');
    let passwordValue = localStorage.getItem('password');
  
    if (usernameValue === null || passwordValue === null) {
        window.location.href = "index.html";
      } else {
        try {
            getFirstName(usernameValue, passwordValue);
            getPhotoUrl(usernameValue, passwordValue);
            loadUserData(usernameValue, passwordValue);

            clearInputValues();
        } catch (error) {
            
            console.error("An error occurred:", error);
            window.location.href = "index.html";
            
        }
      }
    };
    

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

  async function loadUserData(usernameValue, passwordValue) {

    let loadDataRequest = `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/${usernameValue}`;

    try {
        const response = await fetch(loadDataRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                username: usernameValue,
                password: passwordValue
            },
        });

        if (response.ok) {
            const data = await response.json();

            
            document.getElementById("username-title-editProfile").textContent = data.username || '';
            document.getElementById("firstName-editProfile").placeholder = data.firstName || '';
            document.getElementById("lastName-editProfile").placeholder = data.lastName || '';
            document.getElementById("phone-editProfile").placeholder = data.phone || '';
            document.getElementById("photoURL-editProfile").placeholder = data.photoURL || '';
            document.getElementById("email-editProfile").placeholder = data.email || '';
            document.getElementById("currentPass-editProfile").placeholder = '******';

        } else {

        }
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }
}

document.getElementById("profile-save-button").addEventListener('click', async function (event) {
    event.preventDefault();

    let usernameValue = localStorage.getItem('username');
    let passwordValue = localStorage.getItem('password');

    let newPassword = document.getElementById('newPassword-editProfile').value.trim();
    let confirmNewPassword = document.getElementById('newPasswordConfirm-editProfile').value.trim();


    /*
    Para verificar qual a password que se atualizar, se os campos não estiverem vazios e forem iguais
    a nova password vai ser isso, se os campos estiverem vazios a password vai ficar a password antiga 
    que está guardada na local storage se não, se o user escrever nova passaword mas não for igual, vai ficar 
    null e vai rebentar não deixando o user fazer update ao perfil
    
    */
    let updatedPasswordToObejct;

    if (newPassword !== '' && confirmNewPassword !== '' && newPassword === confirmNewPassword) {
        updatedPasswordToObejct = confirmNewPassword;
    } else if (newPassword === '' && confirmNewPassword === '') {
        updatedPasswordToObejct = passwordValue;
    } else {
        alert("Passwords dont match")
        return;
    }

    let updatedUser = updateUserInfo(updatedPasswordToObejct);

    let updateUserRequest =  `http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/update/${usernameValue}`;


    //verifica se todos os campos não estão vazios, se estiverem nem faz o request e avisa o user
    if (!isEveryFieldUnchanged()) {

        try {
            const response = await fetch(updateUserRequest, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    username: usernameValue,
                    password: passwordValue
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                alert("Profile updated successfully")
                localStorage.setItem('password', updatedPasswordToObejct);
                location.reload();

            } else {
                switch (response.status) {
                case 422:
                    const errorData = await response.text();
                
                    switch (errorData) {
                        case "Invalid email":
                            alert("The email you used is not valid");
                            break;
                        case "Image URL invalid":
                            alert("Image url provided not valid");
                            break;
                        case "Invalid phone number":
                            alert("The phone number is not valid");
                            break;
                        default:
                            console.error('Unknown error message:', errorData);
                            alert("Something went wrong switch");
                    }
                    break;
                case 406: 
                    alert("Wrong username on path");
                    break;
                case 401: 
                alert("Invalid credentials");
                break;
                default:
                    alert("Something went wrong");
            }
        }

        } catch (error) {
            console.error('Error:', error);
            alert("Something went wrong");
        }
    } else {
        alert("No changes detected")
    }
});


function updateUserInfo(updatedPassword) { 


        let username = document.getElementById('username-title-editProfile').textContent.trim();
        let email = getInputValue('email-editProfile');
        let firstName = getInputValue('firstName-editProfile');
        let lastName = getInputValue('lastName-editProfile');
        let phone = getInputValue('phone-editProfile');
        let photoURL = getInputValue('photoURL-editProfile');

        return {
            username: username,
            password: updatedPassword,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            photoURL: photoURL
        };


}

function clearInputValues() {
    document.getElementById('newPassword-editProfile').value = '';
    document.getElementById('newPasswordConfirm-editProfile').value = ''; 
    document.getElementById('email-editProfile').value = '';
    document.getElementById('firstName-editProfile').value = '';
    document.getElementById('lastName-editProfile').value = '';
    document.getElementById('phone-editProfile').value = '';
    document.getElementById('photoURL-editProfile').value = '';
}

function getInputValue(elementId) {
    let inputValue;
    let valueElement = document.getElementById(elementId);
    
    if (valueElement.value === '') {
        inputValue = valueElement.placeholder.trim();
    } else {
        inputValue = valueElement.value.trim();
    }

    return inputValue;
}

function isEveryFieldUnchanged() {

    let allFieldsUnchanged = true;

    let form = document.getElementById('edit-profile-form');
    let fieldsArray = [...form.querySelectorAll('input')];

    fieldsArray.forEach(function(field) {
        if (field.value !== '') {
            allFieldsUnchanged = false;
        }
    });
    return allFieldsUnchanged;
}



