'use strict';

const inputSearch = document.querySelector('#search_input');
const button = document.querySelector('#search_button');
let ulMovies = document.querySelector('#series_list');
let ulFav = document.querySelector('#favourites_list');

let series = [];
let favourites = [];

function loadSeries(){
  fetch(`http://api.tvmaze.com/search/shows?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      series = data;
      showSeriesSearch(series);
    });
}

function showSeriesSearch(arr){
  for(let item of arr){
    if (item.show.image !== null){
      ulMovies.innerHTML += `<li class="listSeries" id=${item.show.id}><img src='${item.show.image.medium}'><p class='main-title'>${item.show.name}</p></li>`;
    } else {
      ulMovies.innerHTML += `<li class="listSeries" id=${item.show.id}><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV'><p class='main-title'>${item.show.name}</p></li>`;
    }
    addClickListeners();
  }
}

function addClickListeners(){
  const liList = document.querySelectorAll('#series_list li');
  for(let li of liList){
    li.addEventListener('click',saveFavourites);
  }
}

function saveFavourites(event){
  const index = event.currentTarget.id;
  if (favourites.indexOf(index) === -1) {
    favourites.push(index);
    // setLocalStorage(favourites);
    renderFavourite(event.currentTarget);
  } else {
    alert('Ya has añadido esta película a favoritos'); //buscar oppción más elegante//
  }
}

function renderFavourite(favouriteElement) {
  let favCopy = favouriteElement.cloneNode(true);
  let buttomItem = document.createElement('button');
  buttomItem.type = 'button';
  buttomItem.appendChild(document.createTextNode('Remove'));
  favCopy.appendChild(buttomItem);

  ulFav.appendChild(favCopy);
}

//7.Funcion que relaciona el favorito con su ID, lo lee y devuelve el objeto para pintar

// function getSerieObject(idSerie) {
//   for (let serie of series) {
//     if (serie.show.id === idSerie) {
//       return serie;
//     }
//   }
// }


button.addEventListener('click', loadSeries);
