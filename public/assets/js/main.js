'use strict';

const inputSearch = document.querySelector('#search_input');
const button = document.querySelector('#search_button');
let ulSeries = document.querySelector('#series_list');
let ulFav = document.querySelector('#favourites_list');

let series = [];
let favourites = [];
readLocalStorage();

//LLAMAR A LA API PARA REALIZAR BÚSQUEDA
function loadSeries(){
  fetch(`http://api.tvmaze.com/search/shows?q=${inputSearch.value}`)
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

    //CREAR ESTRUCTURA DE CADA OBJETO DE FAVORITOS
    liObject.appendChild(imgObject);
    liObject.appendChild(pObject);
    ulSeries.appendChild(liObject);
  }

  // for(let item of arr){
  //   if (item.show.image !== null){
  //     ulMovies.innerHTML += `<li class="listSeries" id=${item.show.id}><img src='${item.show.image.medium}'><p class='main-title'>${item.show.name}</p></li>`;
  //   } else {
  //     ulMovies.innerHTML += `<li class="listSeries" id=${item.show.id}><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV'><p class='main-title'>${item.show.name}</p></li>`;
  //   }
  // }
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
  const index = event.currentTarget.id;
  if (favourites.indexOf(index) === -1) {
    setLocalStorage(event.currentTarget);
    renderFavourite(event.currentTarget);
  } else {
    alert('Ya has añadido esta película a favoritos'); //buscar opción más elegante//
  }
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

//PINTAR FAVORITOS EN EL ASIDE
function renderFavourite(favouriteElement) {
  let favCopy = favouriteElement.cloneNode(true);
  let buttomItem = document.createElement('button');
  buttomItem.type = 'button';
  buttomItem.appendChild(document.createTextNode('Remove'));
  favCopy.appendChild(buttomItem);
  ulFav.appendChild(favCopy);

}

//LEER LOS DATOS DE LOCAL STORAGE
function readLocalStorage() {
  let localInfo = JSON.parse(localStorage.getItem('seriesFavInfo'));
  if (localInfo !== null) {
    for (let objetSerie of localInfo) {
      favourites.push(objetSerie);
      renderFavouritesOfLocalStorage(objetSerie);
    }
  } else {
    return localInfo = [];
    //para que no de null devolvemos array vacío para llenarlo.
  }
}

//PINTAR DATOS DE LOCAL STORAGE
function renderFavouritesOfLocalStorage(objectSerie) {
  let liObject = document.createElement('li');
  liObject.classList.add('listSeries');

  let imgObject = document.createElement('img');
  imgObject.setAttribute('src', objectSerie.imgSrc);

  let pObject = document.createElement('p');
  pObject.classList.add('main-title');
  pObject.appendChild(document.createTextNode(objectSerie.name));

  let buttomItem = document.createElement('button');
  buttomItem.type = 'button';
  buttomItem.appendChild(document.createTextNode('Remove'));

  //CREAR ESTRUCTURA DE CADA OBJETO DE FAVORITOS
  liObject.appendChild(imgObject);
  liObject.appendChild(pObject);
  liObject.appendChild(buttomItem);
  ulFav.appendChild(liObject);
}

button.addEventListener('click', loadSeries);

//# sourceMappingURL=main.js.map
