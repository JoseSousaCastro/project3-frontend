window.onload = function() {

    localStorage.removeItem("username");
    localStorage.removeItem("password");
}


// ID do botão loginButton
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();


    let loginValue = document.getElementById('username').value.trim();
    let passwordValue = document.getElementById('password').value.trim();


    if (loginValue === '' || passwordValue === '') {
        document.getElementById('warningMessage').innerText = 'Fill in your username and password';
    } 

    
    let loginRequest = "http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/login";
    const inputFieldIds = [
        'username', 
        'password'
    ];

    try {   
        const response = await fetch(loginRequest, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Accept': '*/*',
                username: loginValue,
                password: passwordValue
            },
            
        });

        if (response.ok) {
            
            localStorage.setItem('username', loginValue);
            localStorage.setItem('password', passwordValue);

            //depois de login com sucesso, apaga os values

            inputFieldIds.forEach(fieldId => {
                document.getElementById(fieldId).value = '';
            });
            window.location.href = 'home.html';

        } else if (response.status === 401) {
            alert("Invalid credentials, please try again :(");
        } else if (!response.ok) {
            alert("something went wrong")
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong");
    }

    function createUserData() {
        let isFormValid = document.getElementById('login-form').checkValidity();
    
        if (isFormValid) {
            let username = document.getElementById('username').value.trim();
            let password = document.getElementById('password').value.trim();
    
            return {
                username: username,
                password: password
            };
        } else {
            document.getElementById('login-form').reportValidity();
            console.error('Form is not valid');
            return null;
        }
    }
    
});

