import { useQuery } from "react-query";

const API_KEY = "59d1c59f5421756258e80a5863984dc2";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IMovieDetail {
  adult: boolean;
  backdrop_path: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  original_title: string;
  overview: string;
  release_date: string;
  runtime: number;
  title: string;
  vote_average: number;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface ITvDetail {
  adult: boolean;
  backdrop_path: string;
  episode_runtime: number[];
  first_air_date: string;
  last_air_date: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  name: string;
  original_name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  overview: string;
  vote_average: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvResult {
  page: 1;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export function getNowPlayingMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export const useMoviesQuery = () => {
  const nowPlaying = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getNowPlayingMovies
  );
  const popular = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const topRated = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const upcoming = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );
  return [nowPlaying, popular, topRated, upcoming];
};

export function getOnTheAirTv() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getAiringTodayTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export const useTvQuery = () => {
  const onTheAir = useQuery<IGetTvResult>(["tv", "onTheAir"], getOnTheAirTv);
  const airingToday = useQuery<IGetTvResult>(
    ["tv", "airingToday"],
    getAiringTodayTv
  );
  const popular = useQuery<IGetTvResult>(["tv", "popular"], getPopularTv);
  const topRated = useQuery<IGetTvResult>(["tv", "topRated"], getTopRatedTv);
  return [onTheAir, airingToday, popular, topRated];
};

export function getSearchMovies(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getMovieDetail(movieId: string | undefined) {
  if (movieId) {
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  }
}

export function getTvDetail(tvId: string | undefined) {
  if (tvId) {
    return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  }
}
