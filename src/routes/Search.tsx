import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IGetTvResult,
  IMovieDetail,
  ITvDetail,
  getMovieDetail,
  getSearchMovies,
  getSearchTv,
  getTvDetail,
} from "../api";
import Slider from "../components/Slider";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigContent = styled(motion.div)`
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

function Search() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const keyword = urlParams.get("keyword");
  const { data: moviesData, isLoading: movieLoading } =
    useQuery<IGetMoviesResult>(["search", "movies", keyword], () =>
      getSearchMovies(keyword)
    );
  const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvResult>(
    ["search", "tv", keyword],
    () => getSearchTv(keyword)
  );
  const navigate = useNavigate();
  const onOverlayClicked = () => navigate(`/search?keyword=${keyword}`);
  const bigContentMatch = useMatch("/search/:id");
  let category: string | null = "";
  if (bigContentMatch) {
    category = urlParams.get("category");
  }
  const { data: movieDetailData } = useQuery<IMovieDetail | undefined>(
    ["movies", bigContentMatch?.params.id, ""],
    () => getMovieDetail(bigContentMatch?.params.id)
  );
  const { data: tvDetailData } = useQuery<ITvDetail | undefined>(
    ["tv", bigContentMatch?.params.id, ""],
    () => getTvDetail(bigContentMatch?.params.id)
  );
  const isLoading = movieLoading || tvLoading;
  return (
    <h1>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <div style={{ marginBottom: 178 }}></div>
            {keyword ? (
              <>
                <Slider
                  movieData={moviesData}
                  title="Movies"
                  keyword={keyword}
                />
                <Slider tvData={tvData} title="Tv" keyword={keyword} />
              </>
            ) : (
              <span>Please search by keyword</span>
            )}
            <AnimatePresence>
              {bigContentMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <BigContent
                    layoutId={`${category}${bigContentMatch.params.id}`}
                  >
                    {category === "Movies" && movieDetailData ? (
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
                          <span>
                            Released on {movieDetailData.release_date}
                          </span>
                          <span>
                            ★ {movieDetailData.vote_average.toFixed(1)}
                          </span>
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
                    {category === "Tv" && tvDetailData ? (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, rgba(0, 0, 0, 0)), url(${makeImagePath(
                              tvDetailData.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        >
                          {tvDetailData.adult ? <BigAdult>19+</BigAdult> : null}
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
                        {tvDetailData.name !== tvDetailData.original_name ? (
                          <BigOriginalTitle>
                            {tvDetailData.original_name}
                          </BigOriginalTitle>
                        ) : null}
                        <BigTitle>{tvDetailData.name}</BigTitle>
                        <BigMeta>
                          <span>
                            {`${tvDetailData.first_air_date} ~ ${tvDetailData.last_air_date}`}
                          </span>
                          <span>★ {tvDetailData.vote_average.toFixed(1)}</span>
                          <span>
                            {tvDetailData.number_of_seasons} seasons |{" "}
                            {tvDetailData.number_of_episodes} episodes
                          </span>
                        </BigMeta>
                        <BigGenres>
                          {tvDetailData.genres.map((genre) => (
                            <li key={genre.id}>#{genre.name}</li>
                          ))}
                        </BigGenres>
                        <BigOverview>{tvDetailData.overview}</BigOverview>
                      </>
                    ) : null}
                  </BigContent>
                </>
              ) : null}
            </AnimatePresence>
          </>
        )}
      </Wrapper>
    </h1>
  );
}
export default Search;
