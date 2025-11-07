let movie;
let moviesData = [];
let isMenuOpen = false;
let loading = document.getElementById('loading-screen');
const searchInput = document.querySelector(".search--input");
const movieCard = document.querySelector(".results__container");
const form = document.querySelector(".search-bar");
const sliderBar = document.querySelector("#results__slider--input");
const sliderCurrent = document.querySelector("#results__slider--current");
let debounceTimeout;
const query = localStorage.getItem("query");


// SLIDING FILTER FUNCTION (only on results page)
if (sliderBar && sliderCurrent && movieCard) {
  sliderBar.oninput = function () {
    sliderCurrent.innerHTML = this.value;
    const maxYear = parseInt(this.value, 10);
    const movies = (moviesData?.Search || []);
    const moviesDataFiltered = movies.filter((m) => parseInt(m.Year, 10) <= maxYear);
    if (moviesDataFiltered.length > 0) {
      const movieCardHtml = moviesDataFiltered
        .map(
          (movie) =>
            `<div class="movie-card">
                        <div class="movie__poster"><img src="${movie.Poster}" class="movie__poster-img" alt=""></div>
                        <div class="movie__name">${movie.Title}</div>
                        <div class="movie__rating">${movie.Year}</div>
                    </div>`
        )
        .join("");
      movieCard.innerHTML = movieCardHtml;
    } else {
      movieCard.innerHTML = "<p>No movies found for the selected year range.</p>";
    }
  };
}


// SEARCH FUNCTION


async function onSearchChange(event) {
  const q = event.target.value?.trim();
  if (!q) return;
  localStorage.setItem("query", q);
  render(q);
}

function redirectToResults(query) {
  const q = (query || '').trim();
  if (!q) return;
  localStorage.setItem("query", q);
  window.location.href = 'results.html';
}

// Clears the query from localStorage when the page is unloaded to prevent stale bread
// window.addEventListener('beforeunload', () => {
//   localStorage.removeItem("query");
// });

if (searchInput && movieCard) {
  searchInput.addEventListener('keyup', (element) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const q = element.target.value.trim();
      if (q.length > 0) {
        render(q);
      } else {
        movieCard.innerHTML = "<p>Please enter a search term.</p>";
      }
    }, 400);
  });
}


// SMALL SCREEN MENU FUNCTION



function toggleMenu(){
    
    
    if (isMenuOpen){
        isMenuOpen = false;
        return document.body.classList.remove("menu--open")
    }
     isMenuOpen = !isMenuOpen;
    document.body.classList +=" menu--open";
}


// LOADING SCREEN FUNCTION


setTimeout(function(){
  loading.style.display = 'none';
  loading.style.opacity = '0';  
}, 1000);
// RENDER FUNCTION


async function fetchAllResults(query) {
  // OMDb returns 10 results per page; fetch all pages for the query
  let all = [];
  let page = 1;
  let total = 0;
  while (page <= 10) { // safety cap
    const res = await fetch(`https://www.omdbapi.com/?apikey=29e531e2&s=${encodeURIComponent(query)}&page=${page}`);
    const data = await res.json();
    if (data && data.Response === 'True' && Array.isArray(data.Search)) {
      all = all.concat(data.Search);
      total = parseInt(data.totalResults || `${all.length}`, 10);
      if (all.length >= total) break;
      page++;
    } else {
      break;
    }
  }
  return all;
}

async function render(query) {
  if (!query || query.length === 0) {
    movieCard.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }
  try {
    const allResults = await fetchAllResults(query);
    moviesData = { Search: allResults, totalResults: allResults.length };
  if (Array.isArray(moviesData.Search) && moviesData.Search.length > 0) {
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
  if (movieCard) {
    const q = (localStorage.getItem("query") || "").trim();
    if (q) {
      render(q);
    } else {
      movieCard.innerHTML = "<p>Please enter a search term.</p>";
    }
  }
  console.log(query);
}, 0);

// TBA function to handle contact button 
function dontClickThat() {
  alert("Don't click that! This is a demo site.");
}
// Intercept landing form submit and persist query
if (form) {
  const indexInput = document.querySelector('#search--input') || searchInput;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = indexInput?.value?.trim() || '';
    if (!q) return;
    localStorage.setItem('query', q);
    window.location.href = 'results.html';
  });
}