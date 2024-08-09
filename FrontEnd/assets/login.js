// vérification si l'utilisateur est connecté
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem("user_login");
    if (session != null && session != undefined) window.location.replace("http://localhost:5500/");
});


// gestionnaire d'évenements pour la soumission d'un formulaire de connexion à un serveur
document.forms["login_form"].onsubmit = async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = {
        password: password,
        email: email
    }
    // prépare la requête HTTP
    const options = {
        method: 'POST', // HTTP method
        headers: {
            'Content-Type': 'application/json' // Headers
        },
        body: JSON.stringify(data) // Request body
    };


    // permet l'envoi des informations de connexion au serveur + la gestion de la réponse 
    const response = await fetch('http://localhost:5678/api/users/login', options);
    if (response.status === 200) {
        errorMessage(false);
        const responseData = await response.json();
        localStorage.setItem("user_login", JSON.stringify(responseData));
        window.location.replace("http://localhost:5500/");
    } else {
        errorMessage(true); // gere l'affichage d'un message d'erreur en cas d'echec de connexion
    }

}


// gère la visibilité  du message d'erreur (en fonction du paramètre show)
function errorMessage(show) {
    if (show === true) {
        const errorMsgElmnt = document.querySelector(".form-error");
        errorMsgElmnt.style.setProperty('display', 'block');
    } else {
        const errorMsgElmnt = document.querySelector(".form-error");
        errorMsgElmnt.style.setProperty('display', 'none');
    }
}