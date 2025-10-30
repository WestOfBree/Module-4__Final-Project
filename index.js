//http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2
let movie;
const searchInput= document.querySelector(".search--input")

searchInput,addEventListener("input", element => {
    const value = element.target.value
    console.log(value)
})
async function render() {
    const movieWrapper = document.querySelector(".results__container")
    const movies = await fetch ("http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2");
    const moviesData = await movies.json();
    const movieCardHtml= moviesData.map((movie) => {
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

    console.log(movieCardHtml)
    movieWrapper.innerHTML = movieCardHtml;
}
render();
setTimeout(() => {
  render();
});