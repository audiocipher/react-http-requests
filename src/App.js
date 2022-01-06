import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

const firebaseUrl =
  'https://react-http-991ba-default-rtdb.firebaseio.com/movies.json';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // using the built in fetch API for sending HTTP requests (could also use Axios)
  // GET is the default method
  // fetch() returns a promise
  const handleFetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // const response = await fetch('https://swapi.py4e.com/api/films/'); // star wars API (mirror)
      // const response = await fetch('https://swapi.py4e.com/api/error/'); // error example

      const response = await fetch(firebaseUrl); // using firebase (react-http)

      // could instead check response.status
      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json(); // .json() returns a promise which resolves with the result of parsing the body text as JSON

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);

      // logic for star wars API
      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      // setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);

  const handleAddMovie = async (movie) => {
    // TODO: add same error handling logic as in handleFetchMovies
    const response = await fetch(firebaseUrl, {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    // console.log(`inside handleAddMovie ${data}`);
    console.log(data);
  };

  useEffect(() => {
    handleFetchMovies();
  }, [handleFetchMovies]);

  let content = <p>No movies found.</p>;

  if (movies && movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={handleAddMovie} />
      </section>
      <section>
        <button onClick={handleFetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>No movies found.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>} */}
      </section>
    </React.Fragment>
  );
}

export default App;
