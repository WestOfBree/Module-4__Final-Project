//http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2
let movie;
const searchInput= document.querySelector(".search--input")
const movieCard = document.querySelector(".movie-card")

searchInput,addEventListener("input", element => {
    const value = element.target.value
    console.log(value)
})
async function render() {
    // const movieWrapper = document.querySelector(".results__container")
    const movies = await fetch ("http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2");
    const moviesData = await movies.json();
    const movieCardHtml = moviesData.map((movie) => {
      return `<div class="movie-card">
                    <div class="movie__poster"><img src="${movie.url}" alt=""></div>
                    <div class="movie__name">${movie.name}</div>
                    <div class="movie__rating">${movie.contentRating}</div>
                    <div class="movie__plot">${movie.description}</div>
                </div>`;
    })
    .join("");

    console.log(movieCardHtml)
    movieCard.innerHTML += movieCardHtml;
}
render();
setTimeout(() => {
  render();
});