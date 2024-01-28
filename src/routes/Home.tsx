import { IMovieDetail, getMovieDetail, useMoviesQuery } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import Slider from "../components/Slider";
import { useQuery } from "react-query";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 2;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  position: relative;
`;

const BigClose = styled(motion.span)`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.3);
  color: ${(props) => props.theme.white.lighter};
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: absolute;
  transform: translateY(-80px);
`;

const BigOriginalTitle = styled.span`
  color: ${(props) => props.theme.white.lighter};
  opacity: 0.5;
  padding: 20px;
  font-size: 16px;
  position: absolute;
  transform: translateY(-100px);
`;

const BigMeta = styled.div`
  padding: 15px 20px;
  span {
    background-color: ${(props) => props.theme.red};
    border-radius: 3px;
    padding: 3px 7px;
    margin-right: 10px;
  }
`;

const BigGenres = styled.ul`
  display: flex;
  padding: 0px 20px;
  padding-bottom: 10px;
  li {
    background-color: ${(props) => props.theme.black.darker};
    border-radius: 3px;
    padding: 3px 7px;
    margin-right: 10px;
  }
`;

const BigOverview = styled.p`
  margin: 0px 20px;
  padding: 7px;
  border-radius: 3px;
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  background-color: ${(props) => props.theme.black.veryDark};
`;

const BigAdult = styled.span`
  position: absolute;
  bottom: 10px;
  right: 20px;
  color: ${(props) => props.theme.red};
  font-size: 18px;
`;

function Home() {
  const navigate = useNavigate();
  const [
    { data: nowPlayingData, isLoading: nowPlayingLoading },
    { data: popularData, isLoading: popularLoading },
    { data: topRatedData, isLoading: topRatedLoading },
    { data: upcomingData, isLoading: upcomingLoading },
  ] = useMoviesQuery();
  const onOverlayClicked = () => navigate("/");
  const bigMovieMatch = useMatch("/movies/:movieId");
  let clickedMovie;
  const location = useLocation();
  let category: string | null = "";
  if (bigMovieMatch) {
    category = new URLSearchParams(location.search).get("category");
    switch (category) {
      case "Now Playing":
        clickedMovie = nowPlayingData?.results.find(
          (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );
        break;
      case "Popular":
        clickedMovie = popularData?.results.find(
          (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );
        break;
      case "Top Rated":
        clickedMovie = topRatedData?.results.find(
          (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );
        break;
      case "Upcoming":
        clickedMovie = upcomingData?.results.find(
          (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );
        break;
    }
  }
  const { data: movieDetailData } = useQuery<IMovieDetail | undefined>(
    ["movies", bigMovieMatch?.params.movieId, ""],
    () => getMovieDetail(bigMovieMatch?.params.movieId)
  );
  const isLoading =
    nowPlayingLoading || popularLoading || topRatedLoading || upcomingLoading;
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <Slider
            movieData={nowPlayingData ? nowPlayingData : undefined}
            title="Now Playing"
          />
          <Slider
            movieData={popularData ? popularData : undefined}
            title="Popular"
          />
          <Slider
            movieData={topRatedData ? topRatedData : undefined}
            title="Top Rated"
          />
          <Slider
            movieData={upcomingData ? upcomingData : undefined}
            title="Upcoming"
          />
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={`${category}${bigMovieMatch.params.movieId}`}
                >
                  {clickedMovie && !movieDetailData ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, rgba(0, 0, 0, 0)), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  ) : movieDetailData ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, rgba(0, 0, 0, 0)), url(${makeImagePath(
                            movieDetailData.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        {movieDetailData.adult ? (
                          <BigAdult>19+</BigAdult>
                        ) : null}
                        <BigClose
                          whileHover={{
                            backgroundColor: "#dddddd",
                            color: "#555555",
                          }}
                          onClick={onOverlayClicked}
                        >
                          ×
                        </BigClose>
                      </BigCover>
                      {movieDetailData.title !==
                      movieDetailData.original_title ? (
                        <BigOriginalTitle>
                          {movieDetailData.original_title}
                        </BigOriginalTitle>
                      ) : null}
                      <BigTitle>{movieDetailData.title}</BigTitle>
                      <BigMeta>
                        <span>Released on {movieDetailData.release_date}</span>
                        <span>★ {movieDetailData.vote_average.toFixed(1)}</span>
                        <span>
                          {movieDetailData.runtime >= 60
                            ? `${Math.floor(movieDetailData.runtime / 60)}h`
                            : null}{" "}
                          {movieDetailData.runtime % 60}m
                        </span>
                      </BigMeta>
                      <BigGenres>
                        {movieDetailData.genres.map((genre) => (
                          <li key={genre.id}>#{genre.name}</li>
                        ))}
                      </BigGenres>
                      <BigOverview>{movieDetailData.overview}</BigOverview>
                    </>
                  ) : null}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
