import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IGetMoviesResult, IGetTvResult } from "../api";

const SliderWrapper = styled.div`
  position: relative;
  top: -100px;
  margin-bottom: 200px;
`;

const SliderTitle = styled.h4`
  font-size: 20px;
  margin: 10px;
  display: inline-block;
`;

const SliderNext = styled.span`
  font-size: 16px;
  cursor: pointer;
  opacity: 0.8;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 160px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background: linear-gradient(
    to top,
    ${(props) => props.theme.black.darker},
    rgba(0, 0, 0, 0)
  );
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    font-size: 18px;
  }
`;

const NoImage = styled.span`
  color: ${(props) => props.theme.black.lighter};
`;

const rowVars = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};

const infoVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
};

const offset = 6;

interface IProps {
  title: string;
  movieData?: IGetMoviesResult;
  tvData?: IGetTvResult;
  keyword?: string | null;
}

function Slider({ movieData, tvData, title, keyword }: IProps) {
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (movieData) {
      if (leaving) return;
      toggleLeaving();
      const toalContents = movieData.results.length - 1;
      const maxIndex = Math.floor(toalContents / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
    if (tvData) {
      if (leaving) return;
      toggleLeaving();
      const toalContents = tvData.results.length - 1;
      const maxIndex = Math.floor(toalContents / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const navigate = useNavigate();
  const onBoxClicked = (id: number) => {
    navigate(
      `/${
        keyword ? "search" : movieData ? "movies" : tvData ? "tv" : ""
      }/${id}${
        keyword ? `?keyword=${keyword}&category=${title}` : `?category=${title}`
      }`
    );
  };
  return (
    <SliderWrapper>
      <SliderTitle>{title}</SliderTitle>
      <SliderNext onClick={increaseIndex}>next</SliderNext>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVars}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={`${title}${index}`}
        >
          {movieData?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={`${title}${movie.id}`}
                onClick={() => onBoxClicked(movie.id)}
                variants={boxVars}
                key={`${title}${movie.id}`}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween" }}
                bgphoto={
                  movie.backdrop_path
                    ? makeImagePath(movie.backdrop_path, "w500")
                    : ""
                }
              >
                <Info variants={infoVars}>
                  <h4>{movie.title}</h4>
                </Info>
                {!movie.backdrop_path ? <NoImage>No Image</NoImage> : null}
              </Box>
            ))}
          {tvData?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((tv) => (
              <Box
                layoutId={`${title}${tv.id}`}
                onClick={() => onBoxClicked(tv.id)}
                variants={boxVars}
                key={`${title}${tv.id}`}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(tv.backdrop_path, "w500")}
              >
                <Info variants={infoVars}>
                  <h4>{tv.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderWrapper>
  );
}

export default Slider;
