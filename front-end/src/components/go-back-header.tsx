import styled from "styled-components";
import colors from "../assets/colors";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";

export default () => {
  const nav = useNavigate();

  const onGoBack = () => {
    nav(-1);
  };

  return (
    <Container>
      <Button onClick={onGoBack}>
        <ArrowBackIosRoundedIcon fontSize="small" />
        <span>뒤로가기</span>
      </Button>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px 10px 0;
`;
const Button = styled.button`
  padding: 5px;
  font-size: 16px;
  color: ${colors.black};
  border: none;
  background-color: transparent;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
`;
