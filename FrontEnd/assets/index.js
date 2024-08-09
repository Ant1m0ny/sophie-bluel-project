// variables globales
let stateWorks = [];
let stateCategories = [];
let selectedCategories = [{
    id: -1,
    name: "Tous"
}];

let validTitle = false;
let validImage = false;


// affiche la liste des travaux par catégories
function displayWorks() {

    const gallery = document.querySelector('.gallery'); //selectionne un élément DOM et réinitialise son contenu (assure que la galerie est vide avant ajout)
    gallery.innerHTML = "";


    // filtre les travaux en vérifiant qu'ils appartiennent à une catégorie selectionnée
    let myArrayFiltered = stateWorks.filter((work) => {
        return selectedCategories.some((cat) => {
            return cat.id === work.category.id
        });
    });
    if (selectedCategories.length === 1 && selectedCategories.find(cat => cat.id === -1)) { // activer seulemrnt si le tag Tous est selectionné
        myArrayFiltered = stateWorks;
    };


    // filtre tous les travaux ici + ajoute du HTML à la galerie
    myArrayFiltered.forEach(work => {
        gallery.innerHTML += `
        <figure>
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        </figure>`
    })
}


// réinitialise / nettoie l'affichage du modal en vidant le contenu HTML
function cleanDisplayWorksInModal() {
    const gallery = document.querySelector('.modal-gallery-list'); // represente la galerie des travaux à afficher dans le modal
    gallery.innerHTML = "";
}


//gestionnaire d'evenement permettant de manipuler une fenêtre de modal dans une page web
function displayWorksInModal() {
    const gallery = document.querySelector('.modal-gallery-list'); //affiche le modal à afficher

    stateWorks.forEach(work => { // inclus une icône de suppression 
        gallery.innerHTML += `
        <div class="figure-modal">
            <span class="delete-work" id="${work.id}">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="17" height="17" rx="2" fill="black"/>
                <path d="M6.71607 3.35558C6.82455 3.13661 7.04754 3 7.29063 3H9.70938C9.95246 3 10.1754 3.13661 10.2839 3.35558L10.4286 3.64286H12.3571C12.7127 3.64286 13 3.93013 13 4.28571C13 4.64129 12.7127 4.92857 12.3571 4.92857H4.64286C4.28728 4.92857 4 4.64129 4 4.28571C4 3.93013 4.28728 3.64286 4.64286 3.64286H6.57143L6.71607 3.35558ZM4.64286 5.57143H12.3571V12C12.3571 12.7092 11.7806 13.2857 11.0714 13.2857H5.92857C5.21942 13.2857 4.64286 12.7092 4.64286 12V5.57143ZM6.57143 6.85714C6.39464 6.85714 6.25 7.00179 6.25 7.17857V11.6786C6.25 11.8554 6.39464 12 6.57143 12C6.74821 12 6.89286 11.8554 6.89286 11.6786V7.17857C6.89286 7.00179 6.74821 6.85714 6.57143 6.85714ZM8.5 6.85714C8.32321 6.85714 8.17857 7.00179 8.17857 7.17857V11.6786C8.17857 11.8554 8.32321 12 8.5 12C8.67679 12 8.82143 11.8554 8.82143 11.6786V7.17857C8.82143 7.00179 8.67679 6.85714 8.5 6.85714ZM10.4286 6.85714C10.2518 6.85714 10.1071 7.00179 10.1071 7.17857V11.6786C10.1071 11.8554 10.2518 12 10.4286 12C10.6054 12 10.75 11.8554 10.75 11.6786V7.17857C10.75 7.00179 10.6054 6.85714 10.4286 6.85714Z" fill="white"/>
                </svg>
            </span>
            <img src="${work.imageUrl}" alt="${work.title}">
        </div>`
    })
}


// ajoute un gestionnaire d'evenements à tous les boutons de supressions
async function handleDeleteWork() {
    const deleteWorkBtns = document.querySelectorAll(".delete-work");
    deleteWorkBtns.forEach(btn => {
        btn.addEventListener("click", handleDeleteWorkClick);
    });
}


//gere la supression d'un travail quand l'utilitsateur clique sur un bouton de suppression (via un gestionnaire d'evenements)
async function handleDeleteWorkClick(e) {
    e.preventDefault();
    const userToken = JSON.parse(localStorage.getItem("user_login"));

    if (!userToken) return; // verifie que le token de l'utilisateur existe

    const options = { //configure les options de la suppression
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken.token}`
        },
    };

    try {
        const res = await fetch(`http://localhost:5678/api/works/${e.currentTarget.id}`, options);
        console.log(res);
        console.log("delete successfully!");
        await fetchWorks();
        cleanDisplayWorksInModal();
        displayWorksInModal();
        handleDeleteWork();
    } catch (error) {
        console.error("Error deleting work:", error);
    }
}


// gère l'interaction de l'utilisateur avec les catégories
function addClickEventToCategories() {
    categoriesElements = document.querySelectorAll(".categorie");
    categoriesElements.forEach(element => {
        element.addEventListener('click', (event) => {
            refreshBtnsCategories(categoriesElements, element);

            // compare l'ID de chaque catégorie + les filtres
            selectedCategories = stateCategories.filter((categorie) => {
                return categorie.id === parseInt(element.id);
            });

            displayWorks(); // met à jour l'affichage 

        })
    })
}


// gère la sélection des catégories d'un point de vue visuel pour l'utilisateur
function refreshBtnsCategories(categories, btn) {
    categories.forEach((categorie) => {
        categorie.classList.remove("selected"); // retire la classe selected à tous les boutons 
    })

    btn.classList.add("selected"); // ajoute la classe selected au bouton sélectionné
}

// gere l'interaction de l'utilisateur quand il clique sur le bouton pour ajouter une image
function handleAddPicture() {

    const btn = document.getElementById("add-picture-btn"); //selectionne le DOM avec l'ID + stock la variable

    // gestionnaire d'evenement ajouté au bouton
    btn.addEventListener('click', () => {
        console.log("we clicked add picture")
        const editModal = document.getElementById("modal-edit");
        const addModal = document.getElementById("modal-add");

        editModal.style.display = "none";
        cleanDisplayWorksInModal();

        addModal.style.display = "block";
        refreshCategoriesSelect();
    })
}

function refreshCategoriesSelect() {
    const select = document.querySelector('select[name="category"]');
    select.innerHTML = "";

    const categories = stateCategories.filter((categorie) => categorie.id !== -1);

    categories.forEach((categorie) => {
        select.innerHTML += `<option value="${categorie.id}">${categorie.name}</option>`;
    })
}


// gestionnaire d'evenement qui permet la manipulation du modal
function editmodalHandler() {
    const modal = document.getElementById("modal-edit"); //recupere le modal

    const btns = document.querySelectorAll(".edit"); // recupere le bouton qui ouvre le modal
    const span = document.getElementsByClassName("close-edit")[0]; // recupere le span qui ferme le modal

    // ouvre le modal quand l'utilisateur clique sur le modal
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.style.display = "block";
            displayWorksInModal();
            handleDeleteWork();
            handleAddPicture();
        })
    })

    // quand l'utilisateur clique sur le span (x) cela ferme le modal
    span.addEventListener("click", () => {
        modal.style.display = "none";
        cleanDisplayWorksInModal();
    })
}


// verifie les conditions de validité du bouton
function testBtnValid() {
    const addModal = document.getElementById("modal-add");
    const kbButtons = addModal.querySelector(".btn");

    // si les variables sont toutes les deux valides : la couleur de fond change
    if (validImage && validTitle) kbButtons.style["background-color"] = "#1D6154";
    else kbButtons.style["background-color"] = "#A7A7A7";
}

// gere la validation d'un formulaire + determine si le bouton doit etre activé ou désactivé
function buttonValidateEnableChecker() {

    // recupère l'evenement
    const title = document.querySelector('input[name="title"]');
    const image = document.querySelector('input[name="image"]');
    image.addEventListener("change", (e) => {
        if (image.files.length) validImage = true;
        else validImage = false;
        testBtnValid();

    })
    title.addEventListener('input', (e) => {
        if (e.target.value != "") validTitle = true;
        else validTitle = false;
        testBtnValid();
    })
}


// gère l'ouverture et la fermeture d'une fenêtre modal 
function addModalHandler() {
    // recupère le modal
    const modal = document.getElementById("modal-add");

    // recupère l'element span qui ferme le modal
    const span = document.getElementsByClassName("close-add")[0];
    const myImagePreview = document.querySelector(".input-section-image-preview");
    const myImageInput = document.querySelector(".input-section-image-input");

    // ferme le modal quand l'utilisateur clique sur le span (x)
    span.onclick = function () {
        modal.style.display = "none";
        myImagePreview.style.display = "none";
        myImageInput.style.display = "flex";
    }
}


//gère la soumission d'un formulaire pour ajouter un nouveau travail (via une requête API)
function handleAddWorkForm() {
    const form = document.querySelector("#add_form");
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // recupère et vérifie que les champs du formulaires sont remplis avant l'envoi au serveur
        const errorsContainer = document.querySelector(".errors-messages");

        const title = document.querySelector('input[name="title"]').value;
        const category = document.querySelector('select[name="category"]').value;
        const image = document.querySelector('input[name="image"]').files[0];

        errorsContainer.textContent = "";

        if (title === "" || category === "" || !image) {
            errorsContainer.textContent = "Veuillez remplir tous les champs";
            return;
        }

        // crée une nouvelle manifestation de formData en ajoutant les valeurs récupérées
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", image);

        // vérifie que le token de l'utilisateur est récupéré
        const userToken = JSON.parse(localStorage.getItem("user_login"));

        if (!userToken) return; // verifie que le token de l'utilisateur existe

        // envoi une requête POST à l'API pour ajouter un travail
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${userToken.token}`
            }
        });

        form.reset();
        resetImagePreview();
        backToEdit();
        await fetchWorks();
        cleanDisplayWorksInModal();
        displayWorksInModal();
        handleDeleteWork();
    });
}


// permet d'obtenir les données des travaux via l'API
async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    stateWorks = works;
    displayWorks();
}


// affiche une liste de catégorie dans l'interface de l'utilisateur
function displayCategories() {
    const userToken = localStorage.getItem("user_login");

    if (userToken != null && userToken != undefined) return; // verifie le token de l'utilisateur

    const categoriesElement = document.querySelector('.categories');
    stateCategories.forEach((categorie, index) => { //affiche les catégories
        let className = "categorie";
        if (index === 0) className = className + " " + "selected";
        categoriesElement.innerHTML += `<div id=${categorie.id} class="${className}">
        ${categorie.name}
    </div>`
    })

}


//envoi une requête à l'API  pour récupérer des données
async function fetchCategories() {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    stateCategories = [{
        name: "Tous",
        id: -1
    }, ...categories];
    displayCategories();
    addClickEventToCategories();

}


// permet d'ajuster l'interface de l'utilisateur pour afficher le top bar quand il est connecté
function cleanUI() {
    const userToken = localStorage.getItem("user_login");
    const topBar = document.querySelector(".top-bar-edit");
    const header = document.querySelector(".edit-mode");
    const editBtnBody = document.querySelector("#edit-body");
    if (userToken === null || userToken === undefined) {

        topBar.style.display = "none";
        header.className = "";
        editBtnBody.style.display = "none";

    } else {
        topBar.style.display = "flex";
        header.className = "edit-mode";
        editBtnBody.style.display = "block";
    }
}


// gère la prévisualisation d'une image quand l'utilisateur sélectionne un fichier image
function handleImagePreview() {

    const image = document.querySelector('input[name="image"]');
    image.addEventListener("change", (e) => { // detecte quand l'utilisateur selectionne un fichier image

        // permet à l'utilisateur de voir un apperçu de l'image + de cacher les champs de téléchargements
        const [file] = image.files
        if (file) {
            const myImagePreview = document.querySelector(".input-section-image-preview");
            const myImageInput = document.querySelector(".input-section-image-input");
            myImagePreview.style.display = "block";
            myImageInput.style.display = "none";
            const imgTag = myImagePreview.querySelector("img");
            imgTag.src = URL.createObjectURL(file);
        }
    })
}

function resetImagePreview() {
    const myImagePreview = document.querySelector(".input-section-image-preview");
    const myImageInput = document.querySelector(".input-section-image-input");
    myImagePreview.style.display = "none";
    myImageInput.style.display = "flex";
}


// gère le dynamisme de la flèche retour dans le modal add
function handleBackArrow() {
    const backArrow = document.querySelector(".back-arrow");
    backArrow.addEventListener("click", backToEdit);
}

function backToEdit() {
    const editModal = document.getElementById("modal-edit");
    const addModal = document.getElementById("modal-add");
    editModal.style.display = "block";
    addModal.style.display = "none";
    displayWorksInModal();
}

let isLogged = false

// gere l'état de connexion de l'utilisateur et son interface 
function handleLogin() {
    const loginBtn = document.querySelector("#loginButton")
    loginBtn.addEventListener("click", () => {
        if (isLogged) {
            localStorage.removeItem("user_login")
            isLogged = false

            handleLoginText()
            cleanUI();
            fetchCategories();
            fetchWorks();

        } else {
            window.location.href = "login.html"
            isLogged = true
            handleLoginText()
            cleanUI();
            fetchCategories();
            fetchWorks();
            editmodalHandler();
            addModalHandler();
            buttonValidateEnableChecker();
            handleAddWorkForm();
            handleImagePreview();
            handleBackArrow();
            handleLogin();
        }
    })
}


// permet de mettre à jour le texte affiché en fonction de l'état de connexion
function handleLoginText() {
    const loginBtn = document.querySelector("#loginButton")
    loginBtn.innerHTML = isLogged ? "logout" : "login"
}


// permet de mettre à jour l'état de connexion en vérifiant le token utilisateur
function handleIsLogged() {
    const token = localStorage.getItem("user_login")
    isLogged = token ? true : false
}


// gestionnaires d'évenements qui s'appliquent pour exécuter les différentes fonctions
document.addEventListener('DOMContentLoaded', async () => {
    cleanUI();
    await fetchCategories();
    await fetchWorks();
    editmodalHandler();
    addModalHandler();
    buttonValidateEnableChecker();
    handleAddWorkForm();
    handleImagePreview();
    handleBackArrow();
    handleIsLogged();
    handleLoginText();
    handleLogin();
})