import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../services/fetchData";
import { Loader2, Star, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const baseimgURL = "https://image.tmdb.org/t/p/original";

const Movie = () => {
  const { movieid } = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const getMovieData = async () => {
    try {
      setLoading(true);
      const responseData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/details/${movieid}`
      );
      const castData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/cast/${movieid}`
      );
      const relatedMoviesData = await fetchData(
        `${import.meta.env.VITE_BASE_API_URL}api/movie/related/${movieid}`
      );

      setMovie(responseData.movieDetails);
      setCast(castData.castData.cast);
      setRelatedMovies(relatedMoviesData.relatedMovies);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovieData();
  }, [movieid]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-[70vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${baseimgURL}${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 flex gap-8">
          {/* Poster */}
          <div className="hidden md:block w-64 translate-y-16">
            <img
              src={`${baseimgURL}${movie.poster_path}`}
              alt="Movie Poster"
              className="w-full rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform hover:scale-105"
            />
          </div>
          {/* Movie Info */}
          <div className="flex-1 space-y-4 self-end">
            <h1 className="text-5xl font-bold">{movie.title}</h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center text-yellow-400">
                <Star className="h-6 w-6 mr-1 fill-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="h-5 w-5 mr-1" />
                <span>{movie.release_date}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="h-5 w-5 mr-1" />
                <span>{movie.runtime} min</span>
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl">{movie.overview}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Genres and Production */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genre/${genre.id}`}
                  className="px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Production Companies</h2>
            <div className="flex flex-wrap gap-2">
              {movie.production_companies.map((company) => (
                <span
                  key={company.id}
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-300"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {cast.map((actor) => (
              <Link
                key={actor.id}
                to={`/cast/${actor.id}/${actor.name}`}
                className="flex-shrink-0 w-44 bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition duration-300"
              >
                <img
                  src={
                    actor.profile_path
                      ? `${baseimgURL}${actor.profile_path}`
                      : "/images/profile.png"
                  }
                  alt={actor.name}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{actor.name}</h3>
                  <p className="text-sm text-gray-400">{actor.character}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related Movies */}
        {/* <section className="space-y-6">
          <h2 className="text-3xl font-bold">More Like This</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {relatedMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="flex-shrink-0 w-44 bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition duration-300"
              >
                <img
                  src={`${baseimgURL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.release_date}</p>
                </div>
              </Link>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default Movie;