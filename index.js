//http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2
let movie;
let moviesData = [];
const searchInput = document.querySelector(".search--input");
const movieCard = document.querySelector(".results__container");
const form = document.querySelector(".search-bar");
const sliderBar = document.querySelector("#results__slider--input");
const sliderCurrent = document.querySelector("#results__slider--current");
let debounceTimeout;
const query = localStorage.getItem("query");


// SLIDING FILTER FUNCTION

sliderBar.oninput = function() {
  sliderCurrent.innerHTML = this.value;
  moviesDataFiltered = moviesData.Search.filter(movie => movie.Year <= this.value);
  if (moviesDataFiltered.length > 0) {
    const movieCardHtml = moviesDataFiltered.map((movie) => {
      return `<div class="movie-card">
                        <div class="movie__poster"><img src="${movie.Poster}" class="movie__poster-img" alt=""></div>
                        <div class="movie__name">${movie.Title}</div>
                        <div class="movie__rating">${movie.Year}</div>
                    </div>`;
    }).join("");
    movieCard.innerHTML = movieCardHtml;
  } else {
    movieCard.innerHTML = "<p>No movies found for the selected year range.</p>";
  } 
};


// SEARCH FUNCTION


async function onSearchChange(event){
const query = (event.target.value)
    render(query)
}

function redirectToResults(query){
  
    localStorage.setItem("query", query)
    window.location.href = 'results.html';
}

// Clears the query from localStorage when the page is unloaded to prevent stale bread
// window.addEventListener('beforeunload', () => {
//   localStorage.removeItem("query");
// });

searchInput.addEventListener('keyup', (element) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const query = element.target.value.trim();
    if (query.length > 0) {
      render(query);
    } else {
      movieCard.innerHTML = "<p>Please enter a search term.</p>";
    }
  }, 400);
});


// SMALL SCREEN MENU FUNCTION



function toggleMenu(){
    
    
    if (isMenuOpen){
        isMenuOpen = false;
        return document.body.classList.remove("menu--open")
    }
     isMenuOpen = !isMenuOpen;
    document.body.classList +=" menu--open";
}


// RENDER FUNCTION


async function render(query) {
  if (!query || query.length === 0) {
    movieCard.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=29e531e2&s=${encodeURIComponent(query)}`
    );
    moviesData = await response.json();
  if (moviesData && moviesData.Search && Array.isArray(moviesData.Search)) {
    const movieCardHtml = moviesData.Search.map((movie) => {
      // Use moviesData.Search here
      return `<div class="movie-card">
                        <div class="movie__poster"><img src="${movie.Poster}" class="movie__poster-img" alt=""></div>
                        <div class="movie__name">${movie.Title}</div>
                        <div class="movie__rating">${movie.Year}</div>
                    </div>`;
    }).join("");
    movieCard.innerHTML = movieCardHtml;
  } else {
    // Handle cases where no movies are found or an error occurred
    console.warn("No movies found or an error occurred:", moviesData.Error);
    movieCard.innerHTML =
      "<p>No movies found. Please try a different search.</p>";
  }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieCard.innerHTML = "<p>An error occurred. Please try again later.</p>";
  }
}

setTimeout(() => {
  render();
});

// TBA function to handle contact button 
function dontClickThat() {
  alert("Don't click that! This is a demo site.");
} 
