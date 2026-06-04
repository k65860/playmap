import styled from "styled-components";

type Props = {
  type: "circle" | "rect";
  src?: string;
  "none-margin-top"?: boolean;
};

export default ({
  type,
  src,
  "none-margin-top": noneMarginTop = false,
}: Props) => {
  if (type === "rect") {
    return <RectImage src={src} noneMarginTop={noneMarginTop} />;
  } else {
    return <CircleImage src={src} />;
  }
};

const RectImage = styled.img<{ noneMarginTop: boolean }>`
  width: ${(x) => (x?.noneMarginTop ? "100%" : "calc(100% - 20px)")};
  border-radius: 8px;
  object-fit: contain;
  opacity: 0.8;
  margin: ${(x) => (x?.noneMarginTop ? 0 : 20)}px
    ${(x) => (x?.noneMarginTop ? 0 : 10)}px
    ${(x) => (x?.noneMarginTop ? 10 : 0)}px;
  border: 1px solid #eee;
`;
const CircleImage = styled.img`
  width: 100px;
  height: 100px;
  aspect-ratio: 1/1;
  border-radius: 100%;
  object-fit: cover;
  opacity: 0.8;
  margin-top: -10px;
`;
