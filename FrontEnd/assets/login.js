// const seConnecterBtn = document.addEventListener("submit")
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem("user_login");
    if (session != null && session != undefined) window.location.replace("http://localhost:5500/FrontEnd/");
});


document.forms["login_form"].onsubmit = async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = {
        password: password,
        email: email
    }
    const options = {
        method: 'POST', // HTTP method
        headers: {
            'Content-Type': 'application/json' // Headers
        },
        body: JSON.stringify(data) // Request body
    };


    const response = await fetch('http://localhost:5678/api/users/login', options);
    if (response.status === 200) {
        errorMessage(false);
        const responseData = await response.json();
        localStorage.setItem("user_login", JSON.stringify(responseData));
        window.location.replace("http://localhost:5500/FrontEnd/");
    } else {
        errorMessage(true);
    }

}

function errorMessage(show){
    if(show === true){
        const errorMsgElmnt = document.querySelector(".form-error");
        errorMsgElmnt.style.setProperty('display', 'block');
    }else{
        const errorMsgElmnt = document.querySelector(".form-error");
        errorMsgElmnt.style.setProperty('display', 'none');
    }
}