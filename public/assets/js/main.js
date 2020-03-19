'use strict';

const inputSearch = document.querySelector('#search_input');
const button = document.querySelector('#search_button');
const ulMovies = document.querySelector('#series_list');
// const ulFav = document.querySelector('#favourites_list');

let series = [];

function loadSeries(){
  fetch(`http://api.tvmaze.com/search/shows?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      series = data;
      showSeries(series);
      console.log(series);
    });
}

function showSeries(arr){
  for(let item of arr){
    if (item.show.image !== ''){
      ulMovies.innerHTML += `<li id=${item.show.id}><img src='${item.show.image.medium}'><p class='main-title'>${item.show.name}</p></li>`;
    } else {
      ulMovies.innerHTML += `<li id=${item.show.id}><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV'><p class='main-title'>${item.show.name}</p></li>`;
    }
    // addClickListeners();
  }
}

button.addEventListener('click', loadSeries);

//# sourceMappingURL=main.js.map
