//http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2


async function render() {
    const movie = await fetch ("http://www.omdbapi.com/?i=tt3896198&apikey=29e531e2");
    const movieData = await movie.json();

    console.log(movieData)
}


render();