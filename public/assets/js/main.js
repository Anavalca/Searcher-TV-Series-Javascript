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
    let liObject = document.createElement('li');
    liObject.setAttribute('id',item.show.id);
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

    //COMPROBAR SI EN LA BÚSQUEDA DE LA API HAY ALGÚN FAVORITO Y AÑADIRLE LA CLASE
    for(let favourite of favourites){
      if(item.show.id === parseInt(favourite.id)){
        liObject.classList.add('favouritesMainStyle');
      }
    }

    //CREAR ESTRUCTURA DE CADA OBJETO DE FAVORITOS
    liObject.appendChild(imgObject);
    liObject.appendChild(pObject);
    ulSeries.appendChild(liObject);

  }
  addClickListeners();

}

//PINTAR AÑADIR EVENTO A LOS LI (CADA SERIE MOSTRADA)
function addClickListeners(){
  const liList = document.querySelectorAll('#series_list li');
  for(let li of liList){
    li.addEventListener('click',saveFavourites);
  }
}

//GUARDAR FAVORITOS
function saveFavourites(event){
  event.currentTarget.classList.add('favouritesMainStyle'); //COLOREAR FAVORITOS DEL LISTADO DEL MAIN
  let idFound = false;

  //iteramos todos los elementos de favourites para saber si el nuevo elemento esta ya metido
  for (let favourite of favourites){
    if(favourite.id === event.currentTarget.id){
      idFound = true;
      break;
    }
  }
  //si no estaba metido lo metemos
  if(idFound === false){
    setLocalStorage(event.currentTarget);
    renderFavourite(event.currentTarget);
  } else {
    removeFavouriteFromLu(event);
  }
}

//PINTAR FAVORITOS EN EL ASIDE
function renderFavourite(favouriteElement) {
  let favCopy = favouriteElement.cloneNode(true);
  favCopy.id = 'fav_' + favCopy.id;
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
  newFavourite.id = currentFav.id;
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

//PINTAR DATOS DE LOCAL STORAGE
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

  //CREAR ESTRUCTURA DE CADA OBJETO DE FAVORITOS
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

  let elementToRemove = document.querySelector('#fav_' + id);
  elementToRemove.remove();

}

function removeFavouriteFromButton(event){
  let removeId = event.currentTarget.parentElement.id;
  removeId = removeId.substr(4);
  removeFavouriteFromId(removeId);
}

function removeFavouriteFromLu(event){
  event.currentTarget.classList.remove('favouritesMainStyle'); //QUITAR COLOR DE FAVORITOS DEL LISTADO DEL MAIN
  let removeId = event.currentTarget.id;
  removeFavouriteFromId(removeId);
}

searchButton.addEventListener('click', loadSeries);

//# sourceMappingURL=main.js.map
