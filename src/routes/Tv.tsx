import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { ITvDetail, getTvDetail, useTvQuery } from "../api";
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

const BigTv = styled(motion.div)`
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
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
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

const BigOriginalTitle = styled.h3`
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

function Tv() {
  const navigate = useNavigate();
  const onOverlayClicked = () => navigate("/tv");
  const [
    { data: onTheAirData, isLoading: onTheAirLoading },
    { data: airingTodayData, isLoading: airingTodayLoading },
    { data: popularData, isLoading: popularLoading },
    { data: topRatedData, isLoading: topRatedLoading },
  ] = useTvQuery();
  const bigTvMatch = useMatch("/tv/:tvId");
  let clickedTv;
  const location = useLocation();
  let category: string | null = "";
  if (bigTvMatch) {
    category = new URLSearchParams(location.search).get("category");
    switch (category) {
      case "On The Air":
        clickedTv = onTheAirData?.results.find(
          (tv) => String(tv.id) === bigTvMatch?.params.tvId
        );
        break;
      case "Airing Today":
        clickedTv = airingTodayData?.results.find(
          (tv) => String(tv.id) === bigTvMatch?.params.tvId
        );
        break;
      case "Popular":
        clickedTv = popularData?.results.find(
          (tv) => String(tv.id) === bigTvMatch?.params.tvId
        );
        break;
      case "Top Rated":
        clickedTv = topRatedData?.results.find(
          (tv) => String(tv.id) === bigTvMatch?.params.tvId
        );
        break;
    }
  }
  const { data: tvDetailData } = useQuery<ITvDetail | undefined>(
    ["tv", bigTvMatch?.params.tvId, ""],
    () => getTvDetail(bigTvMatch?.params.tvId)
  );
  const isLoading =
    onTheAirLoading || airingTodayLoading || popularLoading || topRatedLoading;
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              onTheAirData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{onTheAirData?.results[0].name}</Title>
            <Overview>{onTheAirData?.results[0].overview}</Overview>
          </Banner>
          <Slider tvData={onTheAirData} title="On The Air" />
          <Slider tvData={airingTodayData} title="Airing Today" />
          <Slider tvData={popularData} title="Popular" />
          <Slider tvData={topRatedData} title="Top Rated" />
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigTv layoutId={`${category}${bigTvMatch.params.tvId}`}>
                  {clickedTv && !tvDetailData ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, rgba(0, 0, 0, 0)), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  ) : tvDetailData ? (
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
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
