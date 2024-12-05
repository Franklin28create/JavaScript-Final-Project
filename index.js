const moviesWrapper = document.querySelector(`.movies--wrapper`);
const results = document.querySelector(`.movies__results`);

async function recentMoviesAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        fetch(`https://www.omdbapi.com/?apikey=3608d43&y=2023&s=Christmas`)
      );
    }, 2000);
  });
}

async function recentMovies() {
  moviesWrapper.classList += ` movies__loading`;

  const recentMovies = await recentMoviesAPI();
  const data = await recentMovies.json();
  const recentMovieData = data.Search.slice(0, 6);

  moviesWrapper.classList.remove(`movies__loading`);
  results.classList += ` display__results`;

  moviesWrapper.innerHTML = recentMovieData
    .map((movie) => movieHTML(movie))
    .join(``);
}

recentMovies();

function resultsHTML(searchInput) {
  if (searchInput === ``) {
    return `<div class="movies__top">
    <h1 class="movies__results--title">
    Search for <b class="gold">Something...</b>
    </h1>
    <select id="filter">
    <option value="" selected disabled>Search before filtering!</option>
    </select>
    </div>`;
  }
  return `<div class="movies__top">
  <h1 class="movies__results--title">
                Here are some results for
                <br>
                "<b class="gold">${searchInput}</b>"
                </h1>
                <select id="filter" onchange="filterYear(event)">
                <option value="" selected disabled>Filter By year</option>
                <option value="NEW_TO_OLD">New to Old</option>
                <option value="OLD_TO_NEW">Old to New</option>
                </select>
                </div>`;
}

async function movies(event) {
  const search = event.target.value;

  if (search === ``) {
    return results.innerHTML = resultsHTML(search);
  }

  moviesWrapper.innerHTML = `
  <div class="movies__loading--spinner">
  <span class="spinner__little"></span>
  <span class="spinner__little"></span>
  <span class="spinner__little"></span>
  <span class="spinner__little"></span>
  </div>
  `;

  results.classList.remove("display__results", "show__filter");
  moviesWrapper.classList.add("movies__loading");

  localStorage.setItem(
    "movieSearch",
    `https://www.omdbapi.com/?apikey=3608d43&s=${search}`
  );

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=3608d43&s=${search}`
    );
    const data = await response.json();

    moviesWrapper.classList.remove("movies__loading");
    results.classList.add(`display__results`, "show__filter");
    results.innerHTML = resultsHTML(search);

    if (data.Search && data.Search.length > 0) {
      const movieData = data.Search.slice(0, 6);
      moviesWrapper.innerHTML = movieData
        .map((movie) => movieHTML(movie))
        .join("");
    } else {
      results.classList.add(`display__results`);
      results.innerHTML = `<div class="movies__top style="justify-content: center">
  <h1 class="movies__results--title" style="border-radius: 5px">There are no results for "<b class="gold">${search}</b>"</h1>
                </div>`;
    }
  } catch (error) {
    console.log(error);
    moviesWrapper.classList.remove("movies__loading");
    results.classList.add(`display__results`);
    results.innerHTML = `<div class="movies__top" style="justify-content: center">
  <h1 class="movies__results--title" style="border-radius: 5px">Error loading movies. <b class="gold">Please try again!</b></h1>
                </div>`;
  }
}

async function filterYear(event) {
  const filterValue = event.target.value;
  const response = await fetch(localStorage.getItem(`movieSearch`));
  const movieInfo = await response.json();
  const movieData = movieInfo.Search.slice(0, 6);
  let renderedMovies;

  if (filterValue === `NEW_TO_OLD`) {
    renderedMovies = movieData.sort(
      (a, b) =>
        b.Year.toString(``).slice(0, 4) - a.Year.toString(``).slice(0, 4)
    );
    moviesWrapper.innerHTML = renderedMovies
      .map((movie) => movieHTML(movie))
      .join(``);
    return;
  }

  renderedMovies = movieData.sort(
    (a, b) => a.Year.toString(``).slice(0, 4) - b.Year.toString(``).slice(0, 4)
  );
  moviesWrapper.innerHTML = renderedMovies
    .map((movie) => movieHTML(movie))
    .join(``);
  return;
}

function movieHTML(movie) {
  return `<div class="movie">
              <div class="movie__description">
            <h1 class="movie__title">${movie.Title}</h1>
            <p class="movie__year">${movie.Year}</p>
            </div>
            <div class="movie__img--wrapper">
              <img
                src="${
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : `https://static.wikia.nocookie.net/ideas/images/6/66/FoxAndroidTM2%27s_No_Poster.jpg/revision/latest?cb=20230213155127`
                }"
                class="movie__img"
              />
              <div class="movie__CAT--para">WATCH NOW</div>
              <a href="#" class="play__btn click">
                <i class="fa-solid fa-play"></i>
              </a>
            </div>
          </div>`;
}

movies();