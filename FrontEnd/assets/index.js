let stateWorks = [];
let stateCategories = [];
let selectedCategories = [{
    id: -1,
    name: "Tous"
}];

let validTitle = false;
let validImage = false;

/**
 * display list of  filtered works by category
 */
function displayWorks() {

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";


    let myArrayFiltered = stateWorks.filter((work) => {
        return selectedCategories.some((cat) => {
            return cat.id === work.category.id
        });
    });
    if (selectedCategories.length === 1 && selectedCategories.find(cat => cat.id === -1)) { // activer seuelemnt si le tag Tous est selectionner
        myArrayFiltered = stateWorks;
    };


    myArrayFiltered.forEach(work => {
        gallery.innerHTML += `
        <figure>
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        </figure>`
    })
}

function cleanDisplayWorksInModal() {
    const gallery = document.querySelector('.modal-gallery-list');
    gallery.innerHTML = "";
}

function displayWorksInModal() {
    const gallery = document.querySelector('.modal-gallery-list');

    stateWorks.forEach(work => {
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

async function handleDeleteWork() {
    const deleteWorkBtns = document.querySelectorAll(".delete-work");
    deleteWorkBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log("test")
            e.preventDefault();
            const userToken = JSON.parse(localStorage.getItem("user_login"));
            console.log(userToken)

            if (userToken === null || userToken == undefined) return;
            const options = {
                method: 'DELETE', // HTTP method
                headers: {
                    'Content-Type': 'application/json', // Headers
                    Authorization: `Bearer ${userToken.token}`

                },
            };

            fetch(`http://localhost:5678/api/works/${btn.id}`, options).then(async (res) => {
                console.log(res);
                console.log("delete successfully!")
                await fetchWorks();

            }).then(() => {
                cleanDisplayWorksInModal();
                displayWorksInModal();
            })
        })
    })
}

function addClickEventToCategories() {
    categoriesElements = document.querySelectorAll(".categorie");
    categoriesElements.forEach(element => {
        element.addEventListener('click', (event) => {


            if (element.className.includes("selected")) {
                element.className = "categorie";
                selectedCategories = selectedCategories.filter(cat => cat.id != event.target.id);
            } else {
                element.className += " selected";
                selectedCategories.push({
                    id: Number(event.target.id)
                });
            }
            if (event.target.id != -1 && selectedCategories.length > 1) {
                categoriesElements[0].className = "categorie";
                selectedCategories = selectedCategories.filter(cat => cat.id != -1);
            }
            if (selectedCategories.length === 0) {
                categoriesElements[0].className = "categorie selected";
                selectedCategories.push({
                    id: -1,
                    name: "Tous"
                })
            }
            displayWorks();

        })
    })
}

function handleAddPicture() {

    const btn = document.getElementById("add-picture-btn");

    btn.addEventListener('click', () => {
        console.log("we clicked add picture")
        const editModal = document.getElementById("modal-edit");
        const addModal = document.getElementById("modal-add");
        editModal.style.display = "none";
        cleanDisplayWorksInModal();
        addModal.style.display = "block";
    })
}

function editmodalHandler() {
    // Get the modal
    const modal = document.getElementById("modal-edit");

    // Get the button that opens the modal
    const btns = document.querySelectorAll(".edit");
    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close-edit")[0];

    // When the user clicks on the button, open the modal
    btns.forEach(btn => btn.onclick = function () {
        modal.style.display = "block";
        displayWorksInModal();
        handleDeleteWork();
        handleAddPicture();

    })

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        cleanDisplayWorksInModal();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


function testBtnValid() {
    const addModal = document.getElementById("modal-add");
    const kbButtons = addModal.querySelector(".btn");
    console.log(kbButtons);
    if (validImage && validTitle) kbButtons.style["background-color"] = "#1D6154";
    else kbButtons.style["background-color"] = "#A7A7A7";
}

function buttonValidateEnableChecker() {

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

function addModalHandler() {
    // Get the modal
    const modal = document.getElementById("modal-add");

    // Get the button that opens the modal

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close-add")[0];
    const myImagePreview = document.querySelector(".input-section-image-preview");
    const myImageInput = document.querySelector(".input-section-image-input");



    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        myImagePreview.style.display = "none";
        myImageInput.style.display = "flex";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function handleAddWorkForm() {
    document.forms["add_form"].onsubmit = async function (e) {
        e.preventDefault();

        const title = document.querySelector('input[name="title"]').value;
        const category = document.querySelector('select[name="category"]').value;
        const image = document.querySelector('input[name="image"]');

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", image.files[0]);

        console.log(formData);

        const userToken = JSON.parse(localStorage.getItem("user_login"));

        if (userToken === null || userToken == undefined) return;

        console.log("options", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${userToken.token}`,
                'content-type': 'multipart/form-data'
            }
        })
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${userToken.token}`
            }
        });


        console.log(response);

    }
}

function displayEditBtn() {}

async function fetchWorks() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    stateWorks = works;
    displayWorks();
}

function displayCategories() {
    const userToken = localStorage.getItem("user_login");

    if (userToken != null && userToken != undefined) return;

    const categoriesElement = document.querySelector('.categories');
    stateCategories.forEach((categorie, index) => {
        let className = "categorie";
        if (index === 0) className = className + " " + "selected";
        categoriesElement.innerHTML += `<div id=${categorie.id} class="${className}">
        ${categorie.name}
    </div>`
    })

}


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

function filterWorks() {

}

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

function handleImagePreview() {

    const image = document.querySelector('input[name="image"]');
    image.addEventListener("change", (e) => {

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

function handleBackArrow() {
    const backArrow = document.querySelector(".back-arrow");
    backArrow.addEventListener("click", () => {
        const editModal = document.getElementById("modal-edit");
        const addModal = document.getElementById("modal-add");
        editModal.style.display = "block";
        addModal.style.display = "none";
        displayWorksInModal();
    })

}

let isLogged = false

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

function handleLoginText() {
    const loginBtn = document.querySelector("#loginButton")
    loginBtn.innerHTML = isLogged ? "logout" : "login"
}

function handleIsLogged() {
    const token = localStorage.getItem("user_login")
    isLogged = token ? true : false
}


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