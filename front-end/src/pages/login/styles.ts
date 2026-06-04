import styled from "styled-components";
import colors from "../../assets/colors";
import kakaoLoginButtonImage from "../../assets/images/sns/kakao.png";

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Icon = styled.img`
  aspect-ratio: 829/375;
  max-height: 15vh;
`;
export const Contents = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  padding: 0 30px;
  justify-content: space-between;
  height: 100%;
`;
export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;
export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  padding: 10px;
  gap: 5px;
`;
export const Text = styled.span`
  font-size: 14px;
  cursor: pointer;

  &:active {
    color: #999;
  }

  &.non-cur {
    cursor: default;
  }
`;
export const Description = styled.span`
  color: #999;
  font-size: 12px;
  padding: 10px 0;
  span {
    font-weight: 600;
    text-decoration: underline;
  }
`;
export const FindIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 30px;
  flex: 1;
  width: 100%;
`;
export const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-bottom: 50px;
`;
export const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const SnsLoginTitle = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${colors.gray};
  margin: 10px 0 0;
`;
export const KakaoLoginButtonImage = styled.button.attrs({
  type: "button",
})`
  border: none;
  border-radius: 4px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${kakaoLoginButtonImage});
  background-color: transparent;
  background-color: none;
  max-height: 40px;
  aspect-ratio: 600/90;
  width: 100%;
  cursor: pointer;
`;
export const reviewHeight = 60;
export const Review = styled.div`
  height: ${reviewHeight}px;
  min-height: ${reviewHeight}px;
  background-color: ${colors.whiteGray}20;
  border: 1px solid ${colors.whiteGray}20;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;
export const ReviewTitle = styled.p`
  font-size: 12px;
  font-weight: 900;
  color: ${colors.sky};
  text-indent: 5px;
  cursor: pointer;
`;
export const ReviewMoreBtn = styled.p`
  font-size: 10px;
  color: ${colors.gray};
  margin-bottom: 30px;
  text-align: right;
  padding-right: 5px;
  cursor: pointer;
`;
export const ReviewList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: 0.5s;
`;
export const ReviewItem = styled.li`
  font-size: 12px;
  color: ${colors.sky};
  font-weight: 700;
  height: ${reviewHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  overflow: hidden;
  gap: 15px;

  & > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
  }

  & > img {
    object-fit: contain;
    height: 80%;
  }
`;
