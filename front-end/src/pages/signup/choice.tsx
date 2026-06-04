import styled from "styled-components";
import Button from "../../layouts/button";
import colors from "../../assets/colors";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { alert } from "../../assets/functions";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Title from "../../components/title";

export default () => {
  const [isUser, setIsUser] = useState<"user" | "admin" | null>(null);
  const nav = useNavigate();
  const kakaoInfo = useLocation()?.state?.kakaoInfo;
  const next = () => {
    if (isUser === null) return alert.warn("유형을 선택해주세요.");

    if (kakaoInfo) {
      nav("/signup/create", { state: { isUser, kakaoInfo } });
    } else {
      nav("/signup/create", { state: { isUser } });
    }
  };

  return (
    <>
      <Title title="가입 유형" />
      <Container>
        <Contents>
          <Box
            className={isUser === "user" ? "active" : ""}
            onClick={() => setIsUser("user")}
          >
            {isUser === "user" && <CheckRoundedIcon />}회원
          </Box>
          <Box
            className={isUser === "admin" ? "active" : ""}
            onClick={() => setIsUser("admin")}
          >
            {isUser === "admin" && <CheckRoundedIcon />}관리자
          </Box>
        </Contents>
        <Bottom>
          <Button full backgroundColor="gray" onClick={() => nav(-1)}>
            뒤로가기
          </Button>
          <Button full onClick={next}>
            다음
          </Button>
        </Bottom>
      </Container>
    </>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100% - 62px);
  justify-content: space-between;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Box = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 100px;
  background-color: ${colors?.sky};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  letter-spacing: 5px;
  text-indent: 5px;
  cursor: pointer;

  &.active {
    background-color: ${colors?.green};
  }
`;
const Bottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
