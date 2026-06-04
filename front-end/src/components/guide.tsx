import styled from "styled-components";
import colors from "../assets/colors";
import guideImage1 from "../assets/images/guide/guideline1.png";
import guideImage2 from "../assets/images/guide/guideline2.png";
import guideImage3 from "../assets/images/guide/guideline3.png";
import guideImage4 from "../assets/images/guide/guideline4.png";
import guideImage5 from "../assets/images/guide/guideline5.png";
import { c } from "../assets/functions";
import { useMemo, useState } from "react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import moment from "moment";

const images = [
  guideImage1,
  guideImage2,
  guideImage3,
  guideImage4,
  guideImage5,
];

const today = moment().format("YYYY-MM-DD");

export default () => {
  const [num, setNum] = useState<number>(0);
  const [isView, setView] = useState<boolean>(
    (() => {
      const local = localStorage.getItem("GUIDE_CHECK_DATE");
      if (!local) return true;
      if (local !== today) return true;
      return false;
    })()
  );

  const image = useMemo<string>(() => {
    return images?.[num] || images?.[0];
  }, [num]);

  if (!isView) return null;
  return (
    <>
      <Dim onClick={() => setView(false)} />
      <Container>
        <ImageContainer>
          <Image src={image} />
          <Buttons>
            <Button
              onClick={() =>
                setNum((prev) => {
                  if (prev === 0) return images?.length - 1;
                  return prev - 1;
                })
              }
            >
              <ArrowBackIosNewRoundedIcon />
            </Button>
            <Button
              onClick={() =>
                setNum((prev) => {
                  if (prev === images?.length - 1) return 0;
                  return prev + 1;
                })
              }
            >
              <ArrowForwardIosRoundedIcon />
            </Button>
          </Buttons>
          <IndicatorContainer>
            {images?.map((_, idx) => (
              <Indicator
                key={idx}
                className={c({ active: num === idx })}
                onClick={() => setNum(idx)}
              />
            ))}
          </IndicatorContainer>
        </ImageContainer>
        <CloseButton
          onClick={() => {
            localStorage.setItem("GUIDE_CHECK_DATE", today);
            setView(false);
          }}
        >
          닫기
        </CloseButton>
      </Container>
    </>
  );
};

const Dim = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.dim};
`;
const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 500px;
  background-color: ${colors.white};
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${colors.main};
  box-shadow: 0 2px 4px ${colors.black}40;
`;
const ImageContainer = styled.div`
  aspect-ratio: 1/1;
  position: relative;
`;
const Buttons = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`;
const Button = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: ${colors.gray}60;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  & > svg {
    color: ${colors.white};
    font-size: 20px;
  }
`;
const IndicatorContainer = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 5px;
`;
const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${colors.white};
  transition: 0.2s;
  cursor: pointer;

  &.active {
    background-color: ${colors.orange};
    box-shadow: 0 2px 4px ${colors.dim};
  }
`;
const Image = styled.img`
  display: block;
  width: 100%;
  object-fit: contain;
  user-select: none;
`;
const CloseButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  background-color: ${colors.white};
  border-top: 1px solid ${colors.main};
  letter-spacing: 5px;
  text-indent: 5px;
  font-weight: 500;
  cursor: pointer;
`;
