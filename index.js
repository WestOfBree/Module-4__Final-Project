//http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2
let movie;
let moviesData = [];
let isMenuOpen = false;

let debounceTimeout;
const movieCard = document.querySelector(".results__container");
const form = document.querySelector(".search-bar");
const sliderBar = document.querySelector("#results__slider--input");
const sliderCurrent = document.querySelector("#results__slider--current");

const searchInput = document.querySelector("#search--input") || document.querySelector(".search--input");
// const query = localStorage.getItem("query");
let currentQuery = localStorage.getItem("query") || "";



// SLIDING FILTER FUNCTION

if (sliderBar && sliderCurrent && movieCard) {

  sliderBar.oninput = function() {
    sliderCurrent.innerHTML = this.value;
   const filtered = (moviesData?.Search || []).filter((n)=> parseInt(n.Year, 10) <= parseInt(this.value, 10));
   if (filtered.length > 0) { 
    const movieCardHtml = filtered.map((movie) => {
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
}
 
// SEARCH FUNCTION


async function onSearchChange(event){
const q = event.target.value?.trim();
if (!q) return;
   currentQuery = q;
   localStorage.setItem("query", currentQuery);
   render(currentQuery);
}

function redirectToResults(query){
  
   const q = (query ?? currentQuery ?? "").trim();
   if (!q) return;
   localStorage.setItem("query", q);
   window.location.href = "results.html";

}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  localStorage.setItem("query", q);
  window.location.href = "results.html";
  if (movieCard && currentQuery) {
  searchInput.value = currentQuery;
  render(currentQuery);
}
});

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
// searchInput.addEventListener('keyup', (element) => {
//   clearTimeout(debounceTimeout);
//   debounceTimeout = setTimeout(() => {
//     const query = element.target.value.trim();
//     if (query.length > 0) {
//       render(query);
//     } else {
//       movieCard.innerHTML = "<p>Please enter a search term.</p>";
//     }
//   }, 400);
// });


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
  if (!movieCard) { return; }
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

// Initialize page-specific behavior on load

document.addEventListener("DOMContentLoaded", () => {

  // Index page: capture form submit and store query

  if (form) {

    const indexInput = document.querySelector("#search--input") || document.querySelector(".search--input");

    form.addEventListener("submit", (e) => {

      e.preventDefault();

      const q = indexInput?.value?.trim() || "";

      if (!q) return;

      localStorage.setItem("query", q);

      window.location.href = "results.html";

    });
    // Optional: keep localStorage in sync while typing on index

    if (indexInput) {

      indexInput.addEventListener("keyup", (e) => {

        const q = e.target.value.trim();

        localStorage.setItem("query", q);

      });
    }
  }

  // Results page: hydrate input and render from localStorage

  if (movieCard) {

    const resultsInput = document.querySelector("#query") || document.querySelector(".search--input");

    if (currentQuery) {

      if (resultsInput) resultsInput.value = currentQuery;

      render(currentQuery);

    }
    // Attach keyup for results page input only when it exists

    if (resultsInput) {

      resultsInput.addEventListener("keyup", (element) => {

        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {

          const q = element.target.value.trim();

          if (q.length > 0) {

            currentQuery = q;

            localStorage.setItem("query", currentQuery);

            render(currentQuery);

          } else {

            movieCard.innerHTML = "<p>Please enter a search term.</p>";

          }

        }, 400);

      });

    }

  }

});

// TBA function to handle contact button 
function dontClickThat() {
  alert("Don't click that! This is a demo site.");
} 
