'use strict';

const SearchInput = document.querySelector('#search_input');
const searchButton = document.querySelector('#search_button');
let ulSeries = document.querySelector('#series_list');
let ulFav = document.querySelector('#favourites_list');

let series = [];
let favourites = [];
readLocalStorage();

//LLAMAR A LA API PARA REALIZAR BÚSQUEDA
function loadSeries(){
  fetch(`http://api.tvmaze.com/search/shows?q=${SearchInput.value}`)
    .then(response => response.json())
    .then(data => {
      series = data;
      showSeriesSearch(series);
    });
}

//PINTAR LOS RESULTADOS DE LA BUSQUEDA
function showSeriesSearch(arr){
  ulSeries.innerHTML = '';
  for(let item of arr){
    let isFavourite = false;
    let liObject = document.createElement('li');
    liObject.setAttribute('id','ele_'+item.show.id);
    liObject.classList.add('listSeries');

    let imgObject = document.createElement('img');
    if(item.show.image === null){
      imgObject.setAttribute('src','https://via.placeholder.com/210x295/ffffff/666666/?text=TV');
    }
    else{
      imgObject.setAttribute('src',item.show.image.medium);
    }

    let pObject = document.createElement('p');
    pObject.classList.add('main-title');
    pObject.appendChild(document.createTextNode(item.show.name));

    //COMPROBAR SI EN LA BUSQUEDA DE LA API HAY ALGUN FAVORITO Y ANYADIRLE LA CLASE
    let startIcon;
    for(let favourite of favourites){
      if(item.show.id === parseInt(favourite.id)){
        liObject.classList.add('favouritesMainStyle');
        startIcon = document.createElement('i');
        startIcon.classList.add('icon_fav');
        startIcon.classList.add('fas');
        startIcon.classList.add('fa-star');
        isFavourite = true;
      }
    }
    
    //CREAR ESTRUCTURA DE CADA OBJETO DEL MAIN
    liObject.appendChild(imgObject);
    liObject.appendChild(pObject);
    if(isFavourite){
      liObject.appendChild(startIcon);
    }
    ulSeries.appendChild(liObject);

  }
  addClickListeners();

}

//ANYADIR EVENTO A LOS LI (CADA SERIE DEL MAIN)
function addClickListeners(){
  const liList = document.querySelectorAll('#series_list li');
  for(let li of liList){
    li.addEventListener('click',saveFavourites);
  }
}

//ACCION GUARDAR FAVORITOS
function saveFavourites(event){
  
  let idFound = false;
  
  //ITERAMOS TODOS LOS ELEMENTOS DE FAVOURITES PARA SABER SI EL NUEVO ELEMENTO YA ESTABA METIDO
  for (let favourite of favourites){
    let elementId = event.currentTarget.id.substr(4);
    if(favourite.id === elementId){
      idFound = true;
      break;
    }
  }
  //SI NO ESTABA METIDO LO METEMOS
  if(idFound === false){
    setLocalStorage(event.currentTarget);
    renderFavourite(event.currentTarget);
    event.currentTarget.classList.add('favouritesMainStyle'); //COLOREAR FAVORITOS DEL LISTADO DEL MAIN
    let startIcon = document.createElement('i');
    startIcon.classList.add('icon_fav');
    startIcon.classList.add('fas');
    startIcon.classList.add('fa-star');
    event.currentTarget.appendChild(startIcon);
  } else {
    removeFavouriteFromUl(event);
  }
}

//PINTAR FAVORITOS EN EL ASIDE
function renderFavourite(favouriteElement) {
  let favCopy = favouriteElement.cloneNode(true);
  favCopy.id = favCopy.id.replace('ele', 'fav');
  let buttomItem = document.createElement('button');
  buttomItem.type = 'button';
  buttomItem.classList.add('deleteButton');
  buttomItem.addEventListener('click',removeFavouriteFromButton);
  buttomItem.appendChild(document.createTextNode('x'));
  favCopy.appendChild(buttomItem);
  ulFav.appendChild(favCopy);
}

//GUARDAR FAVORITOS EN LOCALSTORAGE
function setLocalStorage(currentFav) {
  let newFavourite = new Object();
  newFavourite.id = currentFav.id.substr(4);
  newFavourite.imgSrc = currentFav.childNodes[0].src;
  newFavourite.name = currentFav.childNodes[1].textContent;
  
  favourites.push(newFavourite);
  localStorage.setItem('seriesFavInfo', JSON.stringify(favourites));
}

//LEER LOS DATOS DE LOCAL STORAGE
function readLocalStorage() {
  let localInfo = JSON.parse(localStorage.getItem('seriesFavInfo'));
  if (localInfo !== null) {
    for (let objetSerie of localInfo) {
      favourites.push(objetSerie);
      renderFavouritesOfLocalStorage(objetSerie);
    }
  }
}

//PINTAR DATOS DEL LOCAL STORAGE
function renderFavouritesOfLocalStorage(objectSerie) {
  let liObject = document.createElement('li');
  liObject.setAttribute('id', 'fav_' + objectSerie.id);
  liObject.classList.add('listSeries');

  let imgObject = document.createElement('img');
  imgObject.setAttribute('src', objectSerie.imgSrc);

  let pObject = document.createElement('p');
  pObject.classList.add('main-title');
  pObject.appendChild(document.createTextNode(objectSerie.name));

  let buttomItem = document.createElement('button');
  buttomItem.type = 'button';
  buttomItem.classList.add('deleteButton');
  buttomItem.appendChild(document.createTextNode('x'));
  buttomItem.addEventListener('click',removeFavouriteFromButton);

  //CREAR ESTRUCTURA DEL FAVORITO
  liObject.appendChild(imgObject);
  liObject.appendChild(pObject);
  liObject.appendChild(buttomItem);
  ulFav.appendChild(liObject);
}

function removeFavouriteFromId(id){
  let index = 0;
  for (let favourite of favourites){
    if(favourite.id === id){
      favourites.splice(index, 1);
      localStorage.setItem('seriesFavInfo', JSON.stringify(favourites));
      break;
    }
    index++;
  }

  //ELIMINAR DEL DOM EL ELEMENTO DE FAVORITOS
  let elementToRemove = document.querySelector('#fav_'+id);
  elementToRemove.remove();
  //QUITAR ESTILOS FAVORITOS DEL LISTADO DEL MAIN
  let elementToRestore = document.querySelector('#ele_'+id);
  elementToRestore.classList.remove('favouritesMainStyle');
  elementToRestore.lastChild.remove();

}

function removeFavouriteFromButton(event){
  let removeId = event.currentTarget.parentElement.id;
  removeId = removeId.substr(4);
  removeFavouriteFromId(removeId);
}

function removeFavouriteFromUl(event){
  let removeId = event.currentTarget.id;
  removeId = removeId.substr(4);
  removeFavouriteFromId(removeId);
}

searchButton.addEventListener('click', loadSeries);
