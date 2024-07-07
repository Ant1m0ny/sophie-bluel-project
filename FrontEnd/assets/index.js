let stateWorks = [];
let stateCategories = [];
let selectedCategories = [{id:-1,name:"Tous"}];



/**
 * display list of  filtered works by category
 */
function displayWorks(){

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";



    // TODO : fix that
    let myArrayFiltered = stateWorks.filter((work) => {
        return selectedCategories.some((cat) => {
          return cat.id === work.category.id
        });
      });
      if(selectedCategories.length === 1 && selectedCategories.find(cat=>cat.id===-1)) { // activer seuelemnt si le tag Tous est selectionner
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




document.addEventListener('DOMContentLoaded', () => {
    // Tous mon html est chargé donc je peux executer du js sans soucis
    // Récupérer un élement par son id
    // const contact = document.getElementById('contact')
    // const contact = document.querySelector('#contact');

    // Récupérer un élement par class
    // const gallery = document.getElementsByClassName('gallery');
    // [...gallery].forEach(element => {console.log(element)});

    // Récupérer une seule classe
    const categoriesElement = document.querySelector('.categories');
    // console.log(gallery)

    // const galleries = document.querySelectorAll('.gallery');
    // galleries.forEach(element => {console.log(element)});

    // asynchrone donc n'attends pas la fin de l'execution pour continuer
    fetch('http://localhost:5678/api/categories').then(response => {
        return response.json();
    }).then(categories=>{
        stateCategories=categories;
        stateCategories.forEach(categorie=>{
            categoriesElement.innerHTML += `<div id=${categorie.id} class="categorie">
            ${categorie.name}
        </div>`
        })
        
        
    }).then(()=>{
        categoriesElements = document.querySelectorAll(".categorie");
        categoriesElements.forEach(element=>{
            element.addEventListener('click', (event)=>{


                if(element.className.includes("selected")) {
                    element.className = "categorie";
                    selectedCategories = selectedCategories.filter(cat=>cat.id != event.target.id);
                }
                else  {
                    element.className += " selected";
                    selectedCategories.push({id:Number(event.target.id)});
                }
                displayWorks();
                // console.log(stateCategories);
                // console.log("j'ai clicker sur la cetegorie ===>",stateCategories.find(cat => cat.id == event.target.id));
            })
        })
    })

    fetch('http://localhost:5678/api/works').then(response => {
        return response.json()
    }).then(works => {

        stateWorks = works;
        displayWorks();
        // autre manière
        // gallery.innerHTML = works.map(work => {
        //     return `
        //     <figure>
        //         <img src="${work.imageUrl}" alt="${work.title}">
        //         <figcaption>${work.title}</figcaption>
        //     </figure>`
        // }).join(' ')

    });
})



// chargé mon fichier js
// m'assurer que mon fichier et chargé
// récupérer le container des élements
// récupérer la data
// insérer la data dans le html

