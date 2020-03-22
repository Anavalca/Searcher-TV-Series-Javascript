'use strict';

const searchInput = document.querySelector('#search_input');
const searchButton = document.querySelector('#search_button');
let ulTvSeries = document.querySelector('#series_list');
let ulFav = document.querySelector('#favourites_list');
let webLogo = document.querySelector('#title_container');
let gifCoverPage = document.querySelector('.gif_container');
let favouritesIcon = document.querySelector('#icon_fav');

let TvSeries = [];
let favourites = [];

//AL CARGAR AL PÁGINA PINTO LA CABECERA DE LA WEB Y LEO LOS DATOS DEL LOCAL STORAGE
appearCoverPage();
readLocalStorage();

//LLAMAR A LA API PARA REALIZAR BÚSQUEDA
function loadSeries(){
  fetch(`http://api.tvmaze.com/search/shows?q=${searchInput.value}`)
    .then(response => response.json())
    .then(data => {
      TvSeries = data;
      showSeriesSearch(TvSeries);
    });
}

//PINTAR LOS RESULTADOS DE LA BUSQUEDA EN EL MAIN
function showSeriesSearch(arrTvSeries){
  removeChildren(gifCoverPage);
  removeChildren(ulTvSeries);
  for(let item of arrTvSeries){
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

    //COMPROBAR SI EN LA BUSQUEDA DE LA API HAY ALGUN FAVORITO, ANYADIRLE LA CLASE Y CREAR EL ICONO DE FAVORITO
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
    if(isFavourite){ // INCRUSTAR EL ICONO DE FAVORITO DETRÁS DE LOS ELEMENTOS CORRESPONDIENTES PARA QUE APAREZCA EL ULTIMO
      liObject.appendChild(startIcon);
    }
    ulTvSeries.appendChild(liObject);

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
    let elementId = event.currentTarget.id.substr(4); //ELIMINAMOS ELE_ DEL ID PARA COMPARARLO
    if(favourite.id === elementId){
      idFound = true;
      break; //SI ENCUENTRO MI ELEMENTO NO TENGO QUE SEGUIR ITERANDO
    }
  }
  //SI NO ESTABA METIDO LO METEMOS
  if(idFound === false){
    setLocalStorage(event.currentTarget);
    renderFavourite(event.currentTarget);
    //COLOREAR FAVORITOS DEL LISTADO DEL MAIN Y ANYADIR ICONO FAV
    event.currentTarget.classList.add('favouritesMainStyle'); 
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
  let favCopy = favouriteElement.cloneNode(true); //ME CLONO EL LI DEL MAIN
  favCopy.id = favCopy.id.replace('ele', 'fav'); //REMPLAZO LA CLASE PORQUE CLONO EL ELEMENTO DEL UL A FAVORITOS
  let buttomItem = document.createElement('button');
  buttomItem.type = 'button';
  buttomItem.classList.add('deleteButton');
  buttomItem.addEventListener('click',removeFavouriteFromButton);
  buttomItem.appendChild(document.createTextNode('x'));
  favCopy.appendChild(buttomItem);
  ulFav.appendChild(favCopy);
  changeStarFavoutitesIcon();
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
  liObject.setAttribute('id', 'fav_' + objectSerie.id);//ANYADO FAV_ PORQUE NO ME DEJA BUSCAR UN ID DE NUMEROS 
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

  changeStarFavoutitesIcon();
}

// CUANDO RECIBO EL ID QUE VIENE DE CADA LADO ELIMINO ELEMENTOS DE FAVORITOS Y ESTILOS DE LOS li DEL MAIN
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

  //ELIMINAR DE SECCION FAVORITOS EL ELEMENTO
  let elementToRemove = document.querySelector('#fav_'+id);
  elementToRemove.remove();
  //QUITAR ESTILOS DE FAVORITOS DEL LISTADO DEL MAIN
  let elementToRestore = document.querySelector('#ele_'+id);
  if(elementToRestore !== null){
    elementToRestore.classList.remove('favouritesMainStyle');
    elementToRestore.lastChild.remove(); //ELIMINO ICONO DE FAVORITO
  }
  changeStarFavoutitesIcon();
}

// BUSCO EL ID DEL ELEMENTO DE FAVORITOS DE LA **SECCIÓN** QUE QUIERO ELIMINAR
function removeFavouriteFromButton(event){
  let removeId = event.currentTarget.parentElement.id;
  removeId = removeId.substr(4);
  removeFavouriteFromId(removeId);
}
// BUSCO EL ID DEL ELEMENTO DE FAVORITOS DEL **MAIN** QUE QUIERO ELIMINAR
function removeFavouriteFromUl(event){
  let removeId = event.currentTarget.id;
  removeId = removeId.substr(4);
  removeFavouriteFromId(removeId);
}

//CUANDO HACEMOS CLICK EN EL LOGO DE LA WEB RESTAURAMOS EL MAIN Y EL INPUT SEARCH
function restaureWeb(){
  searchInput.value = '';
  removeChildren(ulTvSeries);
  appearCoverPage();
}

//PINTAR PORTADA DE LA WEB
function appearCoverPage(){
  let gifObject = document.createElement('img');
  gifObject.setAttribute('src','./assets/images/tv.gif');
  gifObject.setAttribute('id', 'gif_tv');
  gifObject.setAttribute('title', 'Stay home');
  gifObject.setAttribute('alt', 'gif tv message:stay home');
  removeChildren(gifCoverPage);
  gifCoverPage.appendChild(gifObject);
}

//FUNCIÓN PARA ELIMINAR LOS HIJOS DE UN ELEMENTO
function removeChildren(object){
  while (object.firstChild) {
    object.removeChild(object.firstChild);
  }
}

//BORRAR TODOS LOS FAVORITOS DESDE EL ICONO DE LA SECCIÓN
function deteleAllFavouties(){
 
  favourites = [];
  localStorage.setItem('seriesFavInfo', JSON.stringify(favourites));

  removeChildren(ulFav);

  //ELIMINAR ESTILOS FAV MAIN
  let liMainArr = document.querySelectorAll('.favouritesMainStyle');
  for(let liMain of liMainArr){
    liMain.classList.remove('favouritesMainStyle');
    liMain.lastChild.remove(); //ELIMINO ICONO DE FAVORITO
  }

  changeStarFavoutitesIcon();
}

//FUNCION PARA REALIZAR BUSQUEDA CON EL ENTER

function activeSearchWithEnter(event) {
  if (event.keyCode === 13) {
    loadSeries();
  }
}

function changeStarFavoutitesIcon(){
  if(ulFav.childNodes.length === 0){
    favouritesIcon.classList.remove('fas');
    favouritesIcon.classList.add('far');
  } else {
    favouritesIcon.classList.remove('far');
    favouritesIcon.classList.add('fas');
  }
}

searchButton.addEventListener('click', loadSeries);
webLogo.addEventListener('click', restaureWeb);
favouritesIcon.addEventListener('click',deteleAllFavouties);
document.addEventListener('keydown', activeSearchWithEnter);