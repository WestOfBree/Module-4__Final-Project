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
    const movies = await fetch ("https://imdb.iamidiotareyoutoo.com/search?tt=tt2250912");
    const moviesData = await movies.json();
    const movieCardHtml = moviesData.map((movie) => {
      return `<div class="movie">
                <figure class="movie__img--wrapper">
                 <img class="movie__img"
                 src="${movie.url}" alt="">
                </figure>
              <div class="movie__title">
              ${movie.title}
              </div>
             <div class="movie__ratings">
              ${ratingsHtml(movie.ratings)}
              </div>
            </div>`;
    })
    .join("");

    console.log(moviesData)
    movieCard.innerHTML = movieCardHtml;
}
render();
setTimeout(() => {
  render();
});