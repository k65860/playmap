import styled from "styled-components";

interface Props {
  title: string;
  children?: React.ReactNode;
  buttons?: React.ReactNode;
  onClose: () => void;
}

export default (props: Props) => {
  return (
    <>
      <Dim onClick={props.onClose}></Dim>
      <Container>
        <Header>
          <Title>{props?.title}</Title>
        </Header>
        <Contents>{props?.children}</Contents>
        <Bottom>{props?.buttons}</Bottom>
      </Container>
    </>
  );
};

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Container = styled.div`
  max-height: 90%;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  width: 100%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  overflow: hidden;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 20px;
`;
const Title = styled.span`
  font-size: 18px;
  font-weight: 900;
`;
const Contents = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 20px;
  overflow-x: hidden;
  overflow-y: auto;
`;
const Bottom = styled.div`
  margin: 20px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
